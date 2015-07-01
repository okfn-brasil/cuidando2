# -*- coding: utf-8 -*-
from __future__ import unicode_literals

#
# Common settings
#

AVAILABLE_LOCALES = ['pt_BR', 'en']

DEBUG = True
DEFAULT_LOCALE = 'pt_BR'

FLATPAGES_AUTO_RELOAD = DEBUG
FLATPAGES_EXTENSION = '.md'

BABEL_DEFAULT_LOCALE = DEFAULT_LOCALE

# REQUIREJS_CONFIG = "js/config.js"
REQUIREJS_BASEURL = "static/js"
# REQUIREJS_BASEURL = "jslib"
REQUIREJS_OPTIMIZE = "none"
REQUIREJS_EXTRAS = "mainConfigFile=static/js/config.js include=requirejs"
