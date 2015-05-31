# import re
import sys
import shelve

import geopy
import pandas as pd

from utils import canonical_form
from terms import TermsDB


# ('-24.0069999', '-23.3569999', '-46.8264086', '-46.3650897')


class Geocoder(object):

    def __init__(self):
        self.cache = shelve.open("data/cache.db")

        # Coords limits for geolocation
        #         bot  left    top     right
        self.limits = (-47, -24.05, -46.30, -23.35)

        self.osm = geopy.Nominatim(view_box=self.limits)
        self.gm = geopy.GoogleV3()
        self.server_options = {
            "osm": self.geocode_osm,
            "gm": self.geocode_gm,
        }

    def inside_limits(self, point):
        """Checks if point is inside coords limits (rectangle)."""
        lat, lon = point.latitude, point.longitude
        if (lon > self.limits[0] and lat > self.limits[1] and
           lon < self.limits[2] and lat < self.limits[3]):
            # print("DENTRO!!!!!!")
            return True
        else:
            # print("FORA!!!!!!")
            return False

    def geocode(self, term):
        # limit string size
        s = term['string'][:60]
        # check cache
        term_geo = self.cache.get(s)
        if not term_geo:
            term_geo = {}
            # query all servers
            # print(">>>>>>>>>>> ", s)
            for server_name, func in self.server_options.items():
                points = func(s)
                # print(points)
                term_geo[server_name] = []
                for point in points:
                    if self.inside_limits(point):
                        # print("DENTRO!!!!!!")
                        # print(point.raw)
                        term_geo[server_name].append({
                            "address": point.address,
                            "latitude": point.latitude,
                            "longitude": point.longitude
                        })
            self.cache[s] = term_geo
        # print("------------------------------------")
        # print(term_geo)
        return term_geo

    def geocode_osm(self, s):
        s += ", São Paulo, São Paulo"
        r = self.osm.geocode(s, timeout=10, exactly_one=True)
        if r:
            return [r]
        else:
            return []

    def geocode_gm(self, s):
        s += ", São Paulo, São Paulo"
        r = self.gm.geocode(s, timeout=10, exactly_one=True)
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
        row_coords = []
        for cell in row:
            if type(cell) is str:
                # geo = extract_geos(cell)
                canonical = canonical_form(cell)
                terms = terms_db.search(cell, canonical)
                for term in terms:
                    print(term)
                    row_coords.append(geocoder.geocode(term))
                # if geo:
                #     geo.sort(key=lambda x: x[1])
                    # print(row_coords)
                # if not geo and cell not in EXC:
                #     a[cell] = 1
        table_coords.append(row_coords)
        # print progress
        sys.stdout.write("\r %s / %s" % (str(index), total))
        sys.stdout.flush()
    print("")

    # for i in a.keys():
    #     print(i)

    geocoder.close()

    return pd.concat([table, pd.Series(table_coords, name="geo")], axis=1)

# a = OrderedDict()


def do_all():
    # EXC = open("exc", 'r').read().splitlines()
    print("Reading table")
    table = pd.read_csv("data/bd.csv")
    table = table.iloc[0:100]
    print("Adding pks")
    table = add_pks(table)
    print("Adding geos")
    table = add_geos(table)
    return table
