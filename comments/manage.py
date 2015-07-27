#!/usr/bin/env python
# coding: utf-8

from flask.ext.script import Server, Manager, Shell

from app import app, db_session, engine


manager = Manager(app)
manager.add_command('run', Server(port=5005))
manager.add_command('shell', Shell(make_context=lambda: {
    'app': app,
    'db_session': db_session,
}))


@manager.command
def initdb():
    import models
    models.Base.metadata.drop_all(engine)
    models.Base.metadata.create_all(engine)

if __name__ == '__main__':
    manager.run()
