#!/usr/bin/env python
# coding: utf-8

from flask.ext.script import Server, Manager, Shell

from app import app, db


manager = Manager(app)
manager.add_command('run', Server(port=5003))
manager.add_command('shell', Shell(make_context=lambda: {
    'app': app,
    'db_session': db.session,
}))


@manager.command
def initdb():
    db.drop_all()
    db.create_all()

if __name__ == '__main__':
    manager.run()
