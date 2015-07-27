#!/usr/bin/env python
# coding: utf-8

# from sqlalchemy import Column, String, Integer, Boolean
# from sqlalchemy.ext.declarative import declarative_base
from extensions import db


# Base = declarative_base()


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(200))
    password = db.Column(db.String(200), default='')
    name = db.Column(db.String(100))
    email = db.Column(db.String(200))
    active = db.Column(db.Boolean, default=True)
    description = db.Column(db.String(500))

    def is_active(self):
        return self.active
