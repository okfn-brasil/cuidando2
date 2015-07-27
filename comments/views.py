#!/usr/bin/env python
# coding: utf-8

from flask.ext.restplus import Resource, Api, apidoc

from models import Comment, Thread, User
from extensions import db, sv


api = Api(version='1.0',
          title='comments',
          description='Comments')


parser = api.parser()
parser.add_argument('token')
# From http cookies
# parser.add_argument('session_id', location='cookies')


@api.route('/<string:thread>/add')
class AddComment(Resource):

    def post(self, thread):
        args = parser.parse_args()
        try:
            decoded = sv.decode(args['token'])
        except:
            # TODO: tratar erros...
            raise
        author = decoded['username']
        # TODO: validar text (XSS)
        text = args['text']
        comment = Comment()
        db.session.add(comment)
        db.session.commit()
        return {}


@api.route('/<string:thread>/<int:comment>/delete')
class DeleteComment(Resource):

    def delete(self, thread, comment):
        pass


@api.route('/<string:thread>/<int:comment>/edit')
class EditComment(Resource):

    def put(self, thread, comment):
        pass


@api.route('/<string:thread>')
class GetThread(Resource):

    def get(self, thread):
        pass


# @api.route('/<string:thread>/<int:comment>')
# class GetComment(Resource):

#     def get(self, thread, comment):
#         pass
