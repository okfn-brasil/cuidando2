#!/usr/bin/env python
# coding: utf-8

# Micro Auth: Restful & Social

from flask import Flask
from flask.ext.cors import CORS

from extensions import db, sv
from views import init_api
from auths import init_social_models


# App
app = Flask(__name__)
app.config.from_pyfile('settings/common.py', silent=False)
app.config.from_pyfile('settings/local_settings.py', silent=False)
CORS(app, resources={r"*": {"origins": "*"}})

# DB
db.init_app(app)

# Signer/Verifier
sv.config(priv_key_path="settings/key",
          priv_key_password=app.config['PRIVATE_KEY_PASSWORD'])

# Social
init_social_models(app)

# API
init_api(app)
