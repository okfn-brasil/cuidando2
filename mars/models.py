#!/usr/bin/env python
# coding: utf-8

from sqlalchemy import Column, String, Integer, Boolean
from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(200))
    password = Column(String(200), default='')
    name = Column(String(100))
    email = Column(String(200))
    active = Column(Boolean, default=True)
    description = Column(String(500))

    def is_active(self):
        return self.active
