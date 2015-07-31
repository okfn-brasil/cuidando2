#!/usr/bin/env python
# coding: utf-8

from flask import Flask
from flask.ext.cors import CORS
from flask.ext.restplus import apidoc

from extensions import db, sv
from views import api


# App
app = Flask(__name__)
app.config.from_pyfile('settings/common.py', silent=False)
app.config.from_pyfile('settings/local_settings.py', silent=False)
CORS(app, resources={r"*": {"origins": "*"}})

# DB
db.init_app(app)

# Signer/Verifier
sv = sv.config(pub_key_path="settings/keypub")

# API
api.init_app(app)
app.register_blueprint(apidoc.apidoc)
