# -*- coding: utf-8 -*-
from __future__ import unicode_literals

#
# Common settings
#

AVAILABLE_LOCALES = ['pt_BR', 'en']

DEFAULT_LOCALE = 'pt_BR'

FLATPAGES_EXTENSION = '.md'

BABEL_DEFAULT_LOCALE = DEFAULT_LOCALE

# REQUIREJS_CONFIG = "js/config.js"
# REQUIREJS_CONFIG = 'js/build.js'
# REQUIREJS_BASEURL = 'website/static/js'
# REQUIREJS_BASEURL = "static/js"
# REQUIREJS_BASEURL = "jslib"
REQUIREJS_RUN_IN_DEBUG = False
REQUIREJS_OPTIMIZE = "none"
# REQUIREJS_EXTRAS = "mainConfigFile=static/js/config.js include=requirejs"
# REQUIREJS_EXTRAS = "paths.requireLib=../../require include=requireLib"
# REQUIREJS_EXTRAS = "; touch {{output}}"
