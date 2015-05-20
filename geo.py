# import re
import shelve
from collections import OrderedDict

import geopy
import pandas as pd

from utils import canonical_form
from terms import TERMSDB


# ('-24.0069999', '-23.3569999', '-46.8264086', '-46.3650897')


class Geocoder(object):

    def __init__(self):
        self.cache = shelve.open("cache.db")

        self.osm = geopy.Nominatim()
        self.gm = geopy.GoogleV3()
        self.server_options = {
            "osm": self.geocode_osm,
            "gm": self.geocode_gm,
        }

    def geocode(self, s):
        # tries cache
        entry = self.cache.get(s)
        if not entry:
            entry = {}
            # query all servers
            for name, func in self.server_options.items():
                r = func(s)
                if r:
                    entry[name] = (r.address, r.latitude, r.longitude)
                else:
                    entry[name] = None
            self.cache[s] = entry
        print(entry)

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


a = OrderedDict()
EXC = open("exc", 'r').read().splitlines()
raw_db = pd.read_csv("bd.csv")


def add_pks(table):
    # get Series with codes
    code_series = [col for name, col in raw_db.iteritems()
                   if name[:3].casefold() == "cd_"]
    code_series.append(table["PROJETOATIVIDADE"])
    # create table of codes
    code_table = pd.concat(code_series, axis=1)
    # create PK Series
    pks = pd.Series(['.'.join([str(i) for i in i[1][1:]])
                    for i in code_table.iterrows()])

    # check pk uniqueness
    if len(pks) != len(pks.drop_duplicates()):
        print("Error: There are duplicated pks!")

    return pd.concat([table, pks], axis=1)

add_pks(raw_db)


def x():
    coder = Geocoder()
    for row in raw_db.iterrows():
        for i in row[1]:
            if type(i) is str:
                # geo = extract_geos(i)
                canonical = canonical_form(i)
                geo = TERMSDB.search(i, canonical)
                if geo:
                    geo.sort(key=lambda x: x[1])
                    coder.geocode(geo[0][0])
                # if not geo and i not in EXC:
                #     a[i] = 1

    for i in a.keys():
        print(i)


# def canonize_terms():
#     for k, v in EXPS.items():
#         if v:
#             EXPS[k] = (canonical_form(v[0]), [canonical_form(i) for i in v[1]])
#         else:
#             EXPS[k] = ("", (canonical_form(k),))
#     # global PLACES
#     # PLACES = [canonical_form(i) for i in PLACES]
#     # global REGIONS
#     # REGIONS = [canonical_form(i) for i in REGIONS]
#     global RP
#     temp = []
#     for i in RP:
#         c = canonical_form(i)
#         if c not in temp:
#             temp.append(c)
#     RP = temp
# canonize_terms()
# # print(EXPS)

# def extract_geos(noncanonical):
#     canonical = canonical_form(noncanonical)
#     return TERMSDB.search(noncanonical, canonical)
#     # for k, v in EXPS.items():
#     #     for term in v[1]:
#     #         pattern = r"(?:\W|^)({term}[ s][^-,]+)(.*)"
#     #         if v[0]:
#     #             pattern = r"(?<!{excep})\s*" + pattern
#     #         pattern = pattern.format(excep=v[0], term=term)
#     #         r = re.search(pattern, canonical)
#     #         if r:
#     #             ret += [r.group(1)]
#     #             r2 = r.group(2)
#     #             if r2:
#     #                 ret += [i for i in re.split("[-,]", r2) if i]

#     # # print(RP)
#     # for term in RP:
#     #     # print(term)
#     #     pattern = r"(?:\W|^)({term})(\W|$)"
#     #     pattern = pattern.format(term=term)
#     #     r = re.search(pattern, canonical)
#     #     if r:
#     #         # print("----------",s)
#     #         # print("T:",term)
#     #         # print(r.groups())
#     #         ret += [r.group(1)]

#     # if ret:
#     #     print(s)
#     #     print(ret)
#     # # print("========================")
#     # return ret
