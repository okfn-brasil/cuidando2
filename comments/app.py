#!/usr/bin/env python
# coding: utf-8

# Comment

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

from flask import Flask
from flask.ext.cors import CORS

from phobos import SignerVerifier

from views import init_api


# App
app = Flask(__name__)
app.config.from_pyfile('settings/common.py', silent=False)
app.config.from_pyfile('settings/local_settings.py', silent=False)
CORS(app, resources={r"*": {"origins": "*"}})

# DB
engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db_session = scoped_session(Session)

# Signer/Verifier
sv = SignerVerifier(pub_key_path="settings/keypub")

init_api(app, sv)
