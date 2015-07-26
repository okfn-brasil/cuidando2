#!/usr/bin/env python
# coding: utf-8

from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()


class Comment(Base):
    __tablename__ = 'comments'
    id = Column(Integer, primary_key=True)
    date = Column(DateTime, nullable=False)
    text = Column(String(500), nullable=False)
    topic = Column(String(200), nullable=False)
    username = Column(String(200), nullable=False)
