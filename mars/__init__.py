from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

from flask import Flask, g, url_for
# from flask.ext import login
from flask.ext.cors import CORS

# from social.apps.flask_app.routes import social_auth
# from social.apps.flask_app.template_filters import backends
from social.apps.flask_app.default.models import init_social


from flask import g, Blueprint, request, current_app
# from flask.ext.login import login_required, login_user

from social.actions import do_auth, do_complete, do_disconnect
from social.apps.flask_app.utils import psa
from flask.ext.restplus import Resource, Api, apidoc


from social.strategies.utils import set_current_strategy_getter
from social.apps.flask_app.utils import load_strategy, load_backend
set_current_strategy_getter(load_strategy)

from social.strategies.utils import get_strategy
from social.backends.utils import get_backend
from social.utils import module_member, setting_name
from social.utils import build_absolute_uri

from social.strategies.flask_strategy import FlaskStrategy
from social.backends.facebook import FacebookOAuth2

# from itsdangerous import Signer
# from itsdangerous import JSONWebSignatureSerializer
import jwt


# DANGEROUS_SECRET_KEY = "AVOBSRD@H908o12wo9HDO289o(Dct2yh8o92dko9c28w39kw3298w)"
# signer = JSONWebSignatureSerializer(DANGEROUS_SECRET_KEY)

KEY = "AVOBSRD@H908o12wo9HDO289o(Dct2yh8o92dko9c28w39kw3298w)"

# a=jwt.encode({"username":u, 'exp': datetime.utcnow()}, D)


def encode(data, exp=None):
    #TODO: Usar chaves pub/priv
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


from mars import models
# from mars import views


def insert_user(user, is_new, **kwargs):
    if user:
        g.user = user
    if is_new:
        db_session.add(user)
        db_session.commit()
        print(">>>>>Adicinado ao BD!!!")

count = 0
def pipe_count(**kwargs):
    global count
    print("============", count)
    count += 1


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


api = Api(app, version='1.0',
          title='MARS',
          description='Social Auth')
# api.init_app(app)
app.register_blueprint(apidoc.apidoc)
CORS(app, resources={r"*": {"origins": "*"}})


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

    def get(self, backend, redirect_uri='complete', *args, **kwargs):
        print("COMPLETE-GET")
        uri = redirect_uri
        if uri and not uri.startswith('/'):
            uri = url_for(uri, backend=backend)

        g.strategy = load_strategy()
        g.backend = load_backend(g.strategy, backend, redirect_uri=uri,
                                 *args, **kwargs)
        print("COMPLETE-GET-2")
        # u = models.User.query.get(int(1))
        # resp = do_complete(g.backend, login=do_login, user=u,
        do_complete(g.backend, login=do_login, *args, **kwargs)
        print("COMPLETE-GET-3")
        return {
            'token': encode({'username': g.user.username})
        }
        # return {'redirect': resp.location}


def do_login(backend, user, social_user):
    print("do_login", user, social_user)

# @api.route('/login/<string:backend>/', methods=('GET', 'POST'))
# @psa('social.complete')
# def auth(backend):
#     return do_auth(g.backend)


# @api.route('/complete/<string:backend>/', methods=('GET', 'POST'))
# @psa('social.complete')
# def complete(backend, *args, **kwargs):
#     """Authentication complete view, override this view if transaction
#     management doesn't suit your needs."""
#     return do_complete(g.backend, login=do_login, user=g.user,
#                        *args, **kwargs)


# @api.route('/disconnect/<string:backend>/', methods=('POST',))
# @api.route('/disconnect/<string:backend>/<int:association_id>/',
#                    methods=('POST',))
# @api.route('/disconnect/<string:backend>/<string:association_id>/',
#                    methods=('POST',))
# @login_required
# @psa()
# def disconnect(backend, association_id=None):
#     """Disconnects given backend from current logged in user."""
#     return do_disconnect(g.backend, g.user, association_id)


# def do_login(backend, user, social_user):
#     return login_user(user, remember=request.cookies.get('remember') or
#                       request.args.get('remember') or
#                       request.form.get('remember') or False)


# app.context_processor(backends)



# @login_manager.user_loader
# def load_user(userid):
#     try:
#         u = models.User.query.get(int(userid))
#         # import IPython; IPython.embed()
#         print("OOOOOOOOOOHH", u)
#         # import IPython; IPython.embed()
#         return u
#     except (TypeError, ValueError):
#         print("Ahhhhhhhhhh")
#         pass


# @app.before_request
# def global_user():
#     # g.user = login.current_user
#     g.user = login.current_user._get_current_object()


# @app.teardown_appcontext
# def commit_on_success(error=None):
#     if error is None:
#         db_session.commit()


# @app.teardown_request
# def shutdown_session(exception=None):
#     db_session.remove()


# @app.context_processor
# def inject_user():
#     try:
#         return {'user': g.user}
#     except AttributeError:
#         return {'user': None}
