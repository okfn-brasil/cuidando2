#!/usr/bin/env python
# coding: utf-8

# from sqlalchemy import Column, String, Integer, Boolean
from sqlalchemy.ext.declarative import declarative_base
from extensions import db


Base = declarative_base()


# class User(db.Model):
class User(Base):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(200), unique=True)
    password = db.Column(db.String(200), default='')
    # name = db.Column(db.String(100))
    email = db.Column(db.String(200), default='')
    active = db.Column(db.Boolean, default=True)
    description = db.Column(db.String(500))
    last_token_exp = db.Column(db.Integer, nullable=True)

    def is_active(self):
        return self.active

    @classmethod
    def get_user(cls, username):
        return (db.session.query(cls)
                .filter(cls.username == username).one())

    @classmethod
    def verify_password(cls, username, password):
        return (db.session.query(cls.password)
                .filter(cls.username == username)
                .one() == password)
