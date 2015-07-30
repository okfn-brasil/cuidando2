#!/usr/bin/env python
# coding: utf-8

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import NoResultFound

from flask.ext.restplus import Resource, Api

from auths import get_auth_url, get_username
from models import User
from extensions import db, sv


api = Api(version='1.0',
          title='MARS',
          description='Social Auth')


@api.route('/login/<string:backend>/')
class LoginBackend(Resource):
    """Asks the URL that should be used to login with a specific backend (like
    Facebook)."""

    def get(self, backend):
        print("AUTH-GET")
        return {'redirect': get_auth_url(backend)}


@api.route('/complete/<string:backend>/')
class CompleteLoginBackend(Resource):
    """Completes the login with a specific backend."""

    def post(self, backend):
        print("COMPLETE-GET")
        username = get_username(backend)
        return create_tokens(username)


@api.route('/login_local')
class LoginLocal(Resource):
    """Login using local BD, not backend."""

    parser = api.parser()
    parser.add_argument('username', type=str,
                        location='json', help="Username!!")
    parser.add_argument('password', type=str,
                        location='json', help="Password!!")

    def post(self):
        args = self.parser.parse_args()
        username = args['username']
        password = args['password']
        try:
            if User.verify_password(username, password):
                return create_tokens(username)
            else:
                api.abort(400, "Wrong password...")
        except NoResultFound:
            api.abort(400, "Username seems not registered...")


@api.route('/renew_micro_token')
class RenewMicroToken(Resource):

    parser = api.parser()
    parser.add_argument('token', type=str, location='json', help="Token!!!")

    def post(self):
        args = self.parser.parse_args()
        try:
            decoded = sv.decode(args['token'])
            # options={"verify_exp": False})
        except:
            # TODO: tratar erros... quais são?
            raise
        if decoded['type'] != "main":
            # This seems not to be a main token. It must be main for security
            # reasons, for only main ones can be invalidated at logout
            api.abort(400)

        username = decoded['username']
        user = User.get_user(username)
        if decoded['exp'] != user.last_token_exp:
            api.abort(400)
        token = create_token(username),
        return {'micro-token': token}


@api.route('/logout')
class Logout(Resource):

    parser = api.parser()
    parser.add_argument('token', type=str, location='json', help="Token!!!")

    def post(self):
        args = self.parser.parse_args()
        # TODO: Oq fazer aqui?
        return {}


@api.route('/users/<string:username>')
class GetUser(Resource):

    def get(self, username):
        try:
            # user = (db.session.query(User)
            #         .filter(User.username == username).one())
            user = User.get_user(username)
        except NoResultFound:
            api.abort(404)

        return {
            "username": user.username,
            "email": user.email,
            "description": user.description,
        }


@api.route('/users/<string:username>/edit')
class EditUser(Resource):

    def put(self, username):
        # Must check permission! If token user == username?
        pass


@api.route('/users/<string:username>/register')
class RegisterUser(Resource):

    parser = api.parser()
    parser.add_argument('password')

    def post(self, username):
        args = self.parser.parse_args()
        # TODO: validar username
        username
        # TODO: validar password
        # TODO: encriptar e salgar password
        password = args['password']
        # TODO: validar email
        email = args.get('email')

        user = User(username=username, password=password, email=email)
        db.session.add(user)
        try:
            db.session.commit()
        except IntegrityError:
            api.abort(400, "It seems this username is already registered...")
        return {}


# def create_token(username, exp_minutes=5):
#     """Returns a token."""
#     return sv.encode({
#         'username': username,
#     }, exp_minutes)


def create_tokens(username):
    """Returns tokens."""
    main_token = create_token(username, True)
    user = User.get_user(username)
    # TODO: Talvez usar algo mais rápido para decodificar o token?
    # ignorar verificações?
    user.last_token_exp = sv.decode(main_token)['exp']
    db.session.commit()
    return {
        'mainToken': main_token,
        'microToken': create_token(username),
    }


def create_token(username, main=False):
    """Returns a token."""

    if main:
        # TODO: permitir configurar
        # one week
        exp_minutes = 10080
        token_type = "main"
    else:
        # TODO: permitir configurar
        exp_minutes = 5
        token_type = "micro"

    return sv.encode({
        'username': username,
        'type': token_type,
    }, exp_minutes)
