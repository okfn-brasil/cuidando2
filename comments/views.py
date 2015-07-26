#!/usr/bin/env python
# coding: utf-8

from flask.ext.restplus import Resource, Api, apidoc


api = Api(version='1.0',
          title='comments',
          description='Comments')


def init_api(app, sv):
    api.init_app(app)
    app.register_blueprint(apidoc.apidoc)
    api.sv = sv


parser = api.reqparse.RequestParser()
parser.add_argument('token')
# From http cookies
# parser.add_argument('session_id', location='cookies')


@api.route('/<string:topic>/add')
class Add(Resource):

    def get(self, topic):
        args = parser.parse_args()
        data = args['token']
        api.sv.decode(data)
        print("------------->", data)
        return {'status': 'ok'}


# @api.route('/complete/<string:backend>/')
# class Complete(Resource):

#     def get(self, backend):
#         print("COMPLETE-GET")
#         return {
#             'token': api.sv.encode({'username': get_username(backend)})
#         }
