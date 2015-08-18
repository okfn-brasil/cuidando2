#!/usr/bin/env python
# coding: utf-8

import os

from flask import Blueprint, render_template


bp = Blueprint('routes', __name__)


@bp.route('/')
@bp.route('/index.html')
def root():
    ''' Main page '''
    return render_template(
        'app.html',
        textpages=os.listdir(
            os.path.join('cuidando2', 'templates', 'textpages')
        )
    )


# @app.route('/handlebars_templates/<path:path>')
# def send_templates(path):
#     return send_from_directory('cuidando2/templates/handlebars/', path)
