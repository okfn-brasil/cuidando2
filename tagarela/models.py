#!/usr/bin/env python
# coding: utf-8

from extensions import db


class Comment(db.Model):
    __tablename__ = 'comment'
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(500), nullable=False)
    created = db.Column(db.DateTime, nullable=False)
    modified = db.Column(db.DateTime, nullable=False)
    # http://docs.sqlalchemy.org/en/rel_1_0/orm/basic_relationships.html
    thread_id = db.Column(db.Integer, db.ForeignKey('thread.id'),
                          nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('author.id'),
                          nullable=False)

    # TODO: adicionar mais? likes e dislikes (precisa de voters),
    # parent_comment (para permitir respostas a comentários, não thread)


class Thread(db.Model):
    __tablename__ = 'thread'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False, unique=True)
    comments = db.relationship("Comment")


class Author(db.Model):
    __tablename__ = 'author'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False, unique=True)
    comments = db.relationship("Comment", backref="author")
