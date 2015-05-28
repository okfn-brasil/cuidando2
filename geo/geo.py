# import re
import sys
import shelve
from collections import OrderedDict

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
        if (lat > self.limits[0] and lon > self.limits[1] and
           lat < self.limits[2] and lon < self.limits[3]):
            return True
        else:
            return False

    def geocode(self, s):
        # check cache
        entry = self.cache.get(s)
        if not entry:
            entry = {}
            # query all servers
            for name, func in self.server_options.items():
                r = func(s)
                if r and self.inside_limits(r):
                    entry[name] = (r.address, r.latitude, r.longitude)
                else:
                    entry[name] = None
            self.cache[s] = entry
        # print("------------------------------------")
        # print(entry)
        return entry

    def geocode_osm(self, s):
        s += ", São Paulo, São Paulo"
        return self.osm.geocode(s, timeout=10, exactly_one=True)

    def geocode_gm(self, s):
        s += ", São Paulo, São Paulo"
        r = self.gm.geocode(s, timeout=10, exactly_one=True)
        if r and r.address == "São Paulo - State of São Paulo, Brazil":
            return None
        else:
            return r

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
    coder = Geocoder()
    terms = TermsDB()
    table_coords = []
    total = len(table)
    for index, row in table.iterrows():
        row_coords = None
        for cell in row:
            if type(cell) is str:
                # geo = extract_geos(cell)
                canonical = canonical_form(cell)
                geo = terms.search(cell, canonical)
                if geo:
                    geo.sort(key=lambda x: x[1])
                    row_coords = coder.geocode(geo[0][0])
                    # print(row_coords)
                # if not geo and cell not in EXC:
                #     a[cell] = 1
        table_coords.append(row_coords)
        # print progress
        sys.stdout.write("\r %s / %s" % (str(index), total))
        sys.stdout.flush()

    # for i in a.keys():
    #     print(i)

    coder.close()

    return pd.concat([table, pd.Series(table_coords, name="geo")], axis=1)

# a = OrderedDict()


def do_all():
    # EXC = open("exc", 'r').read().splitlines()
    print("Reading table")
    table = pd.read_csv("data/bd.csv")
    # table = table.iloc[0:100]
    print("Adding pks")
    table = add_pks(table)
    print("Adding geos")
    table = add_geos(table)
    return table
