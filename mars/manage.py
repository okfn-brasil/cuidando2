#!/usr/bin/env python
# coding: utf-8

import sys

from flask.ext.script import Server, Manager, Shell

sys.path.append('..')

from mars import app, db_session, engine


manager = Manager(app)
manager.add_command('run', Server())
manager.add_command('shell', Shell(make_context=lambda: {
    'app': app,
    'db_session': db_session
}))


@manager.command
def initdb():
    import models
    from social.apps.flask_app.default import models as social_models

    social_models.PSABase.metadata.drop_all(engine)
    models.Base.metadata.drop_all(engine)

    models.Base.metadata.create_all(engine)
    social_models.PSABase.metadata.create_all(engine)

if __name__ == '__main__':
    manager.run()
