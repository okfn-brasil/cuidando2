import os
import re

from utils import canonical_form


class Term(object):
    """Class for a term that preceeds the name of a place.
    The real name of the place must be after it.
    E.g.: Rua ..."""

    define_pattern = r">> {class_name} (?P<weight>\d+)"

    pattern = r"(?:\W|^)({term}[ s][^-,]+)(.*)"

    def __init__(self, terms, excep, canonize, weight=0):
        self.weight = weight
        self.canonize = canonize
        if self.canonize:
            terms = canonical_form(terms)

        if excep:
            self.pattern = r"(?<!{excep})\s*" + self.pattern
            if self.canonize:
                excep = canonical_form(excep)

        self.pattern = re.compile(self.pattern.format(term=terms, excep=excep))

    # def check_definition(self)

    def compare(self, noncanonical, canonical):
        if self.canonize:
            text = canonical
        else:
            text = noncanonical
        all_found = re.search(self.pattern, text)
        if all_found:
            return {
                "string": all_found.group(1),
                "weight": self.weight
            }
        else:
            return None


class Name(Term):
    """Class for a name of a place.
    The name by itself should be enough to locate a place.
    E.g.: Câmara Municipal"""

    pattern = r"(?:\W|^)({term})(\W|$)"


class Region(Name):
    """Class for a name of a region.
    The name by itself should be enough to locate a region.
    E.g.: Parelheiros"""

    define_pattern = (
        r">> {class_name} (?P<region>[^|]+)(?: | (?P<weight>\d+))?"
    )

    def __init__(self, terms, excep, canonize, region, weight=0):
        """Calls super's init and adds 'region' attr"""
        super().__init__(terms, excep, canonize, weight)
        self.region = region

    def compare(self, noncanonical, canonical):
        """Calls super's compare and adds 'region' attr"""
        found = super().compare(noncanonical, canonical)
        if found:
            found['region'] = self.region
        return found


def get_all_subclasses(cls):
    """Get all subclasses of a class"""
    all_subclasses = [cls]
    for subclass in cls.__subclasses__():
        all_subclasses.append(subclass)
        all_subclasses.extend(get_all_subclasses(subclass))
    return all_subclasses

# CLASS_LIST = {"Term": Term}
# for c in Term.__subclasses__():
#     CLASS_LIST[c.__name__] = c


def check_class(line):
    """Check if line defines a class"""
    # for name, c in CLASS_LIST.items():
    for c in get_all_subclasses(Term):
        patt = c.define_pattern.format(class_name=c.__name__)
        matched = re.fullmatch(patt, line)
        if matched:
            return c, matched.groupdict()
    return None


class TermsDB(object):
    """Class to load and search the REs"""

    def __init__(self, folder="terms"):
        self.tokens = []
        self.load_folder(folder)

    def load_folder(self, path):
        files = os.listdir(path)
        for file_name in files:
            if file_name[0] != '.':
                with open(os.path.join(path, file_name), 'r') as f:
                    self.load_text(f.read())

    def load_text(self, text):
        for line in text.splitlines():
            # ignore lines started with '#'
            if line and line[0] != "#":
                new_class = check_class(line)
                if new_class:
                    current_class, current_args = new_class
                # do not canonize if line starts with '!'
                # alias are separeted with '|'
                # use '?!' for except if preceded by
                patt = r"(?P<canonize>!)?(?P<terms>.+?)((\?\!)(?P<excep>.*))?"
                dic = re.fullmatch(patt, line).groupdict()
                canonize = not dic["canonize"]
                excep = dic["excep"]
                terms = dic["terms"]
                token = current_class(terms, excep, canonize, **current_args)
                self.tokens.append(token)

    def search(self, noncanonical, canonical):
        """Search all the terms for matching ones and return them."""
        all_found = []
        for token in self.tokens:
            found = token.compare(noncanonical, canonical)
            if found:
                all_found.append(found)
        return all_found


# TERMSDB = TermsDB()


# EXPS = {
#     "rua": ("em situação de", ("rua", "r\.")),
#     "avenida": ("", ("avenida", "av\.")),
#     "jardim": ("", ("jardim", "jd\.")),
#     "travessa": ("", ("travessa", "trav.")),
#     "favela": "",
#     "praca": "",
#     "viela": "",
#     # "operacao urbana": "",
#     "vila": "",
#     "ponte": "",
#     "parque": "",
#     "escola": "",
#     "bairro": "",
#     "quadra": "",
#     "corrego": "",
#     "viaduto": "",
#     "ladeira": "",
#     "ginasio": "",
#     "chacara": "",
#     "estadio": "",
#     "hospital": "",
#     "distrito": "",
#     "autodromo": "",
#     "cemiterio": "",
#     "instituto": "",
#     "biblioteca": "",
#     "maternidade": "",
#     "Polo Cultural": "",
#     "Centro Cultural": "",
#     "Complexo Esportivo": "",
#     "Conjunto Habitacional": "",
#     "Conservatório Musical": "",
#     "UBS": "",
#     "CDC": "",
#     "emef": "",
#     "emei": "",
#     "cei": "",
#     "ceu": "",
#     "apa": "",
# }
# # EXPS["subprefeitura"] = ("", subs)
