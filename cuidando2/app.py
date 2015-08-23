#!/usr/bin/env python
# coding: utf-8

from __future__ import unicode_literals  # unicode by default
import os
import codecs

from flask import Flask
from flask_frozen import Freezer
from flask.ext.assets import Environment, Bundle
from flask.ext.cors import CORS
from webassets.filter import Filter
import markdown

from gambs import MyRequireJSFilter
from views import bp


class TextpagesFilter(Filter):
    name = 'textpages'

    output_base_folder = 'cuidando2/static/textpages'

    def output(self, _in, out, **kwargs):
        # print('OUT', _in, out, kwargs)
        # out.write(_in.read())
        pass

    def input(self, _in, out, **kwargs):
        filepath = kwargs['source_path']
        with codecs.open(filepath, 'r', 'utf-8') as f:
            text = f.read()
            filename = os.path.basename(filepath)
            file_no_ext, file_extension = os.path.splitext(filename)
            lang = os.path.split(os.path.split(filepath)[0])[1]
            # Convert to markdown if needed
            if file_extension == '.md':
                text = markdown.markdown(text)

        out_folder = os.path.join(self.output_base_folder, lang)
        out_filepath = os.path.join(out_folder, file_no_ext + '.html')

        # Create folder if doesn't exist
        if not os.path.exists(out_folder):
            os.makedirs(out_folder)

        with codecs.open(out_filepath, 'w', 'utf-8') as f:
            f.write(text)
        # out.write(_in.read())


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
                        output='js/compiled_templates/handlebars.js',
                        )
    app.assets.register('handlebars', handlebars)

    textpages = Bundle('../templates/textpages/*/*',
                       filters=TextpagesFilter,
                       output='js/compiled_templates/textpages.js',
                       depends='../templates/textpages/*/*',
                       # extra={'static_folder': 'textpages/'},
                       )
    app.assets.register('textpages', textpages)

    app.assets.debug = app.config['DEBUG']

    # Add the Frozen extension
    app.freezer = Freezer(app)

    # Register views
    app.register_blueprint(bp)

    return app
