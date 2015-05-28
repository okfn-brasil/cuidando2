import os
import re

from utils import canonical_form


class Term(object):
    """Class for a term that preceeds the name of a place.
    The real name of the place must be after it.
    E.g.: Rua ..."""

    pattern = r"(?:\W|^)({term}[ s][^-,]+)(.*)"

    def __init__(self, terms, excep, weight=0, canonize=True):
        self.weight = weight
        self.canonize = canonize
        if self.canonize:
            terms = canonical_form(terms)

        if excep:
            self.pattern = r"(?<!{excep})\s*" + self.pattern
            if self.canonize:
                excep = canonical_form(excep)

        self.pattern = re.compile(self.pattern.format(term=terms, excep=excep))

    def compare(self, noncanonical, canonical):
        if self.canonize:
            text = canonical
        else:
            text = noncanonical
        r = re.search(self.pattern, text)
        if r:
            return (r.group(1), self.weight)
        else:
            return None


class Name(Term):
    """Class for a name of a place or region.
    The name by itself should be enough to locate a place or region.
    E.g.: Câmara Municipal"""

    pattern = r"(?:\W|^)({term})(\W|$)"


CLASS_LIST = {"Term": Term}
for c in Term.__subclasses__():
    CLASS_LIST[c.__name__] = c


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
        current_weight = 0
        current_class = None
        for line in text.splitlines():
            # control line, e.g.: ">> Name 10"
            if line[:2] == ">>":
                _, class_name, current_weight = line.split()
                current_class = CLASS_LIST[class_name]
            # ignore lines started with '#'
            elif line and line[0] != "#":
                # do not canonize if line starts with '!'
                # alias are separeted with '|'
                # use '?!' for except if preceded by
                patt = r"(?P<canonize>!)?(?P<terms>.+?)((\?\!)(?P<excep>.*))?"
                dic = re.fullmatch(patt, line).groupdict()
                canonize = not dic["canonize"]
                excep = dic["excep"]
                terms = dic["terms"]
                token = current_class(terms, excep, current_weight, canonize)
                self.tokens.append(token)

    def search(self, noncanonical, canonical):
        found = []
        for i in self.tokens:
            result = i.compare(noncanonical, canonical)
            if result:
                found.append(result)
        return found


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

