#!/usr/bin/env python
# coding: utf-8

from flask.ext.sqlalchemy import SQLAlchemy

from phobos import SignerVerifier


db = SQLAlchemy()
sv = SignerVerifier()
