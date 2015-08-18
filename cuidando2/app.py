#!/usr/bin/env python
# coding: utf-8

from flask import Flask
from flask_frozen import Freezer
from flask.ext.assets import Environment, Bundle
from flask.ext.cors import CORS

from gambs import MyRequireJSFilter
from views import bp


def create_app(config=None):
    # Create the Flask app
    app = Flask(__name__)

    # Load settings
    app.config.from_pyfile('../settings/common.py')
    if config:
        app.config.from_pyfile(
            '../settings/{}_settings.py'.format(config),
            silent=False)
    else:
        app.config.from_pyfile(
            '../settings/local_settings.py',
            silent=False)

    # Enable CORS
    CORS(app)

    # Prepare assets
    app.assets = Environment(app)
    requirejs = Bundle('vendor/requirejs/js/require.js',
                       filters=MyRequireJSFilter,
                       output='build/app/main.js',
                       depends='js/app/*')
    app.assets.register('requirejs', requirejs)

    handlebars = Bundle('../templates/handlebars/*',
                        filters='handlebars',
                        output='js/compiled_templates/all.js',
                        )
    app.assets.register('handlebars', handlebars)

    app.assets.debug = app.config['DEBUG']

    # Add the Frozen extension
    app.freezer = Freezer(app)

    # Register views
    app.register_blueprint(bp)

    return app
