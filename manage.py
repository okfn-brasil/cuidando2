#!/usr/bin/env python
# coding: utf-8

from __future__ import unicode_literals  # unicode by default

from flask.ext.script import Server, Manager, Shell

from cuidando2.app import create_app


manager = Manager(create_app)
manager.add_option('-c', '--config', dest='config', required=False)
manager.add_command('run', Server(port=5001))
manager.add_command('shell', Shell(make_context=lambda: {
    'app': manager.app,
}))


# @manager.command
# def run(config=None):
#     '''Run in local machine.'''
#     print(config)
#     manager.app.run(port=5001)


@manager.command
def build():
    '''Build site.'''
    # TODO: Não sei se esse build compila os templates handlebars sozinho.
    # De qualquer forma seria só rodar o watch, ou essa linha:
    # handlebars templates/handlebars/ -f static/js/compiled_templates/all.js -e html -a
    print('Freezing...')
    manager.app.freezer.freeze()


@manager.command
def watch():
    '''Watches for JS or handlebars templates alterations and build them.'''
    import logging
    from webassets.script import CommandLineEnvironment

    # Setup a logger
    log = logging.getLogger('webassets')
    log.addHandler(logging.StreamHandler())
    log.setLevel(logging.DEBUG)

    cmdenv = CommandLineEnvironment(manager.app.assets, log)
    cmdenv.watch()


if __name__ == '__main__':
    manager.run()
