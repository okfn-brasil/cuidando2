#!/usr/bin/env python
# coding: utf-8

from flask.ext.script import Server, Manager, Shell

from app import app
from extensions import db


manager = Manager(app)
manager.add_command('run', Server(port=5002))
manager.add_command('shell', Shell(make_context=lambda: {
    'app': app,
    'db': db,
}))

# def run():
#     import views
#     Server()


@manager.command
def initdb():
    from social.apps.flask_app.default import models as social_models
    import models

    social_models.PSABase.metadata.drop_all(db.engine)
    models.Base.metadata.drop_all(db.engine)
    # db.drop_all()

    # db.create_all()
    models.Base.metadata.create_all(db.engine)
    social_models.PSABase.metadata.create_all(db.engine)

if __name__ == '__main__':
    manager.run()
