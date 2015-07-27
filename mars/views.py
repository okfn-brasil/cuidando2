#!/usr/bin/env python
# coding: utf-8

from flask.ext.restplus import Resource, Api, apidoc

from auths import get_auth_url, get_username


api = Api(version='1.0',
          title='MARS',
          description='Social Auth')


def init_api(app, sv):
    api.init_app(app)
    app.register_blueprint(apidoc.apidoc)
    api.sv = sv


@api.route('/login/<string:backend>/')
class Auth(Resource):

    def get(self, backend):
        print("AUTH-GET")
        return {'redirect': get_auth_url(backend)}


@api.route('/complete/<string:backend>/')
class Complete(Resource):

    def get(self, backend):
        print("COMPLETE-GET")
        return {
            'token': api.sv.encode({'username': get_username(backend)})
        }
