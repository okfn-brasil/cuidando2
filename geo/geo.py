# import re
import sys
import shelve
import json

import geopy
import pandas as pd
from shapely.geometry import shape, Point

from utils import canonical_form
from terms import TermsDB


# ('-24.0069999', '-23.3569999', '-46.8264086', '-46.3650897')

class GeoEntity(object):
    """Stores information about an entity possibly geocoded."""

    def __init__(self, terms=None):
        self.terms = terms
        terms.sort(reverse=True, key=lambda x: x['weight'])
        self.region = ''

    def geocode(self, geocoder):
        """Geocodes all the terms of this entity"""
        for term in self.terms:
            # No need to geocode regions
            if not term.get('region'):
                geo = geocoder.geocode(term['string'])
                if geo:
                    term['geo'] = geo
                    if not self.region:
                        # TODO: descobrir regiao do ponto
                        self.region = "???"
            else:
                self.region = term['region']

    def best_coords(self):
        """Returns the best latitude, longitude and region found for this
        entity."""
        lat, lon = None, None
        for term in self.terms:
            # print(term)
            # print(term['weight'])
            geo = term.get("geo")
            if geo:
                osm = geo['osm']
                gm = geo['gm']
                geo_data = None
                if osm:
                    geo_data = osm
                elif gm:
                    geo_data = gm
                if geo_data:
                    g = geo_data[0]
                    lat, lon = g['latitude'], g['longitude']
                    break
        return lat, lon, self.region


class Geocoder(object):
    """A class to organize geoservers and geocode terms"""

    def __init__(self):
        self.cache = shelve.open("data/cache.db")

        # Coords limits for geolocation
        #         bot  left    top     right
        self.limits = (-47, -24.05, -46.30, -23.35)
        self.regions = None

        self.osm = geopy.Nominatim(view_box=self.limits)
        self.gm = geopy.GoogleV3()
        self.server_options = {
            "osm": self.geocode_osm,
            "gm": self.geocode_gm,
        }
        self.shapefy_regions()

    def shapefy_regions(self):
        # TODO: permitir configurar...
        with open("data/subprefeituras.geojson", 'r') as f:
            self.regions = {}
            j = json.load(f)
            for region in j['features']:
                name = region['properties']['name']
                poly = shape(region['geometry'])
                self.regions[name] = poly

    def inside_limits(self, point):
        """Checks if point is inside coords limits or possible region."""
        if not self.regions:
            # Use rectangle check
            lat, lon = point.latitude, point.longitude
            if (lon > self.limits[0] and lat > self.limits[1] and
               lon < self.limits[2] and lat < self.limits[3]):
                return True
            else:
                return False
        else:
            # Check inside all possible regions
            p = Point((point.longitude, point.latitude))
            print(p, point)
            # import IPython; IPython.embed()
            for name, poly in self.regions.items():
                # if poly.contains(p):
                if p.intersects(poly):
                    return name
            return False

    def geocode(self, term):
        """Geocodes a term in all avaiable geoservers"""
        # TODO: permitir cofigurar isso...
        # limit string size
        s = term[:60]
        # check cache
        term_geo = self.cache.get(s)
        if not term_geo:
            term_geo = {}
            # query all servers
            for server_name, func in self.server_options.items():
                points = func(s)
                term_geo[server_name] = []
                for point in points:
                    region = self.inside_limits(point)
                    if region:
                        if region is True:
                            region = "???"
                        print(region)
                        term_geo[server_name].append({
                            "address": point.address,
                            "latitude": point.latitude,
                            "longitude": point.longitude,
                            "region": region
                        })
            self.cache[s] = term_geo
        # print("------------------------------------")
        # print(term_geo)
        return term_geo

    def geocode_osm(self, s):
        # TODO: permitir configurar
        s += ", São Paulo, São Paulo"
        r = self.osm.geocode(s, timeout=10, exactly_one=True)
        if r:
            return [r]
        else:
            return []

    def geocode_gm(self, s):
        # TODO: permitir configurar
        s += ", São Paulo, São Paulo"
        r = self.gm.geocode(s, timeout=10, exactly_one=True)
        # TODO: permitir configurar
        if not r or r.address == "São Paulo - State of São Paulo, Brazil":
            return []
        else:
            return [r]

    def close(self):
        """Closes cache."""
        self.cache.close()


def add_pks(table):
    # get Series with codes
    code_series = [col for name, col in table.iteritems()
                   if name[:3].casefold() == "cd_"]
    # this column doesn't start with "cd_" but is a code
    code_series.append(table["PROJETOATIVIDADE"])
    # create table of codes
    code_table = pd.concat(code_series, axis=1)
    # create PK Series
    pks = pd.Series(['.'.join([str(i) for i in i[1][1:]])
                    for i in code_table.iterrows()],
                    name="pk")

    # check pk uniqueness
    if len(pks) != len(pks.drop_duplicates()):
        print("Error: There are duplicated pks!")

    return pd.concat([table, pks], axis=1)


def add_geos(table):
    geocoder = Geocoder()
    terms_db = TermsDB()
    table_coords = []
    total = len(table)
    for index, row in table.iterrows():
        row_terms = []
        for cell in row:
            if type(cell) is str:
                canonical = canonical_form(cell)
                terms = terms_db.search(cell, canonical)
                if terms:
                    row_terms = row_terms + terms
                # for term in terms:
                #     # print(term)
                #     row_coords.append(geocoder.geocode(term))
                # if geo:
                #     geo.sort(key=lambda x: x[1])
                    # print(row_coords)
                # if not geo and cell not in EXC:
                #     a[cell] = 1
        gt = GeoEntity(row_terms)
        gt.geocode(geocoder)
        table_coords.append(gt)
        # print progress
        sys.stdout.write("\r %s / %s" % (str(index), total))
        sys.stdout.flush()
    print("")

    geocoder.close()

    return pd.concat(
        [table, pd.Series(table_coords, name="geoentity")],
        axis=1)

# a = OrderedDict()


def do_all():
    # EXC = open("exc", 'r').read().splitlines()
    print("Reading table")
    table = pd.read_csv("data/bd.csv")
    table = table#.iloc[0:100]
    print("Adding pks")
    table = add_pks(table)
    print("Adding geos")
    table = add_geos(table)
    return table
