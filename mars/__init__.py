from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

from flask import Flask, g, url_for, request
from flask.ext.cors import CORS
from flask.ext.restplus import Resource, Api, apidoc
# from flask.ext import login
# from flask.ext.login import login_required, login_user

from social.apps.flask_app.default.models import init_social
from social.actions import do_auth, do_complete
from social.apps.flask_app.utils import load_strategy, load_backend
from social.backends.facebook import FacebookOAuth2
from social.strategies.flask_strategy import FlaskStrategy
from social.strategies.utils import set_current_strategy_getter
from social.utils import build_absolute_uri
# from social.apps.flask_app.routes import social_auth
# from social.apps.flask_app.template_filters import backends

import jwt

# from mars import models

# from itsdangerous import Signer
# from itsdangerous import JSONWebSignatureSerializer

set_current_strategy_getter(load_strategy)

# DANGEROUS_SECRET_KEY = "AVOBSRD@H908o12wo9HDO289o(Dct2yh8o99238ow9"
# signer = JSONWebSignatureSerializer(DANGEROUS_SECRET_KEY)

KEY = "AVOBSRD@H908o12wo9HDO289o(Dct2yh8o92dko9c28w39kw3298w)"

# a=jwt.encode({"username":u, 'exp': datetime.utcnow()}, D)


def encode(data, exp=None):
    # TODO: Usar chaves pub/priv
    if exp:
        data["exp"] = exp
    return jwt.encode(data, KEY).decode("utf8")


# App
app = Flask(__name__)
app.config.from_object('mars.settings')

try:
    app.config.from_object('mars.local_settings')
except ImportError:
    pass
# app.config.from_pyfile('mars.local_settings', silent=True)

# DB
engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db_session = scoped_session(Session)

# app.register_blueprint(social_auth)
init_social(app, db_session)

# login_manager = login.LoginManager()
# login_manager.login_view = 'main'
# login_manager.login_message = ''
# login_manager.init_app(app)


# from mars import views


api = Api(app, version='1.0',
          title='MARS',
          description='Social Auth')
# api.init_app(app)
app.register_blueprint(apidoc.apidoc)
CORS(app, resources={r"*": {"origins": "*"}})


def insert_user(user, is_new, **kwargs):
    if user:
        g.user = user
    if is_new:
        db_session.add(user)
        db_session.commit()
        print(">>>>>Adicinado ao BD!!!")


# count = 0
# def pipe_count(**kwargs):
#     global count
#     print("============", count)
#     count += 1


class HeadlessFacebookStrategy(FlaskStrategy):
    name = 'facebook'

    def build_absolute_uri(self, path=None):
        return build_absolute_uri(request.referrer, path).partition("&")[0]


class HeadlessFacebookBackend(FacebookOAuth2):
    name = 'facebook'

    def validate_state(self):
        if not self.STATE_PARAMETER and not self.REDIRECT_STATE:
            return None
        state = self.get_session_state()
        request_state = self.get_request_state()
        print("VALIDATE!!!!!!!!!!")
        print(state)
        print(request_state)
        # if not request_state:
        #     raise AuthMissingParameter(self, 'state')
        return request_state


@api.route('/done')
class Done(Resource):

    def get(self, *args, **kwargs):
        # import IPython; IPython.embed()
        return {'feito': "eeeeeeeeee!"}


@api.route('/login/<string:backend>/')
class Auth(Resource):

    def get(self, backend, redirect_uri='complete', *args, **kwargs):
        print("AUTH-GET")
        uri = redirect_uri
        if uri and not uri.startswith('/'):
            uri = url_for(uri, backend=backend)

        g.strategy = load_strategy()
        g.backend = load_backend(g.strategy, backend, redirect_uri=uri,
                                 *args, **kwargs)
        resp = do_auth(g.backend)
        return {'redirect': resp.location}
        # return do_auth(g.backend)


@api.route('/complete/<string:backend>/')
class Complete(Resource):

    def get(self, backend):
        g.strategy = load_strategy()
        g.backend = load_backend(g.strategy, backend, redirect_uri="/")
        do_complete(g.backend, login=do_login)
        return {
            'token': encode({'username': g.user.username})
        }


def do_login(backend, user, social_user):
    print("do_login", user, social_user)
