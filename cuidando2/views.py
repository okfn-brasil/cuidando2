#!/usr/bin/env python
# coding: utf-8

import os

from flask import Blueprint, render_template, send_from_directory


bp = Blueprint('routes', __name__)


@bp.route('/')
@bp.route('/index.html')
def root():
    ''' Main page '''
    return render_template(
        'base.html',
        textpages=os.listdir(
            os.path.join('cuidando2', 'templates', 'textpages')
        )
    )


@bp.route('/textpages/<path:path>')
def send_textpages(path):
    folder_path = os.path.join(os.getcwd(), 'cuidando2/templates/textpages/')
    return send_from_directory(folder_path, path)

# @app.route('/handlebars_templates/<path:path>')
# def send_templates(path):
#     return send_from_directory('cuidando2/templates/handlebars/', path)


# {% for page in textpages %}
#     <div data-textpage="{{page.split('.')[0]}}">
#         {% include "textpages/" + page %}
#     </div>
# {% endfor %}
