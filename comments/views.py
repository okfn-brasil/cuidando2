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


parser = api.parser()
parser.add_argument('token')
# From http cookies
# parser.add_argument('session_id', location='cookies')


@api.route('/<string:topic>/<int:comment>')
class GetComment(Resource):

    def get(self, topic, comment):
        pass


@api.route('/<string:topic>/add')
class AddComment(Resource):

    def post(self, topic):
        args = parser.parse_args()
        data = args['token']
        try:
            decoded = api.sv.decode(data)
        except:
            # TODO: tratar erros...
            raise
        username = decoded['username']
        print("------------->", username)
        return {'status': 'ok'}


@api.route('/<string:topic>/<int:comment>/delete')
class DeleteComment(Resource):

    def delete(self, topic, comment):
        pass


@api.route('/<string:topic>/<int:comment>/edit')
class EditComment(Resource):

    def put(self, topic, comment):
        pass


@api.route('/<string:topic>')
class GetTopic(Resource):

    def get(self, topic):
        pass
