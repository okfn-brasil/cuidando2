#!/usr/bin/env python
# coding: utf-8

# Micro Auth: Restful & Social

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

from flask import Flask
from flask.ext.cors import CORS
from flask.ext.restplus import Api, apidoc
# from flask.ext import login
# from flask.ext.login import login_required, login_user

from phobos import SignerVerifier

from auths import init_social_models


# App
app = Flask(__name__)
# app.config.from_object('mars.settings')
app.config.from_pyfile('settings/common.py', silent=False)
app.config.from_pyfile('settings/local_settings.py', silent=False)
# try:
#     # app.config.from_object('mars.local_settings')
#     app.config.from_pyfile('settings/common.py', silent=False)
# except ImportError:
#     app.config.from_pyfile('settings/2local_settings.py', silent=False)

# DB
engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db_session = scoped_session(Session)

init_social_models(app, db_session)


# login_manager = login.LoginManager()
# login_manager.login_view = 'main'
# login_manager.login_message = ''
# login_manager.init_app(app)


api = Api(app, version='1.0',
          title='MARS',
          description='Social Auth')
# api.init_app(app)
app.register_blueprint(apidoc.apidoc)
CORS(app, resources={r"*": {"origins": "*"}})

sv = SignerVerifier(priv_key_path="settings/key",
                    priv_key_password=app.config['PRIVATE_KEY_PASSWORD'])
