#!/usr/bin/env python
# coding: utf-8

# Micro Auth: Restful & Social

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

from flask import Flask
from flask.ext.cors import CORS

from phobos import SignerVerifier

from views import init_api
from auths import init_social_models


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
sv = SignerVerifier(priv_key_path="settings/key",
                    priv_key_password=app.config['PRIVATE_KEY_PASSWORD'])

init_social_models(app, db_session)
init_api(app, sv)
