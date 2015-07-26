#!/usr/bin/env python
# coding: utf-8

from flask.ext.restplus import Resource

from app import api, sv
from auths import get_auth_url, get_username


@api.route('/login/<string:backend>/')
class Auth(Resource):

    def get(self, backend, *args, **kwargs):
        print("AUTH-GET")
        return {'redirect': get_auth_url(backend)}


@api.route('/complete/<string:backend>/')
class Complete(Resource):

    def get(self, backend):
        print("COMPLETE-GET")
        return {
            'token': sv.encode({'username': get_username(backend)})
        }
