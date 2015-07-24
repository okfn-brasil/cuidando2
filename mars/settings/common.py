# from os.path import dirname, abspath

DEBUG = True
DEBUG_TB_INTERCEPT_REDIRECTS = False

# SQLALCHEMY_DATABASE_URI = 'sqlite:////%s/test.db' % dirname(abspath(__file__))

SESSION_COOKIE_NAME = 'psa_session2'
SESSION_PROTECTION = 'strong'

# STORAGE = 'social.apps.flask_app.default.models.FlaskStorage2'
SOCIAL_AUTH_STRATEGY = 'mars.HeadlessFacebookStrategy'

SOCIAL_AUTH_PIPELINE = (
 'social.pipeline.social_auth.social_details',
 'social.pipeline.social_auth.social_uid',
 'social.pipeline.social_auth.auth_allowed',
 'social.pipeline.social_auth.social_user',
 'social.pipeline.user.get_username',
 'social.pipeline.user.create_user',
 'social.pipeline.social_auth.associate_user',
 'social.pipeline.social_auth.load_extra_data',
 'social.pipeline.user.user_details',
 'mars.insert_user',
)

SOCIAL_AUTH_LOGIN_URL = '/meu_login_url/'
SOCIAL_AUTH_LOGIN_REDIRECT_URL = '/meu_login_url/done/'
SOCIAL_AUTH_USER_MODEL = 'mars.models.User'
SOCIAL_AUTH_AUTHENTICATION_BACKENDS = (
    # 'social.backends.open_id.OpenIdAuth',
    # 'social.backends.google.GoogleOpenId',
    # 'social.backends.google.GoogleOAuth2',
    # 'social.backends.google.GoogleOAuth',
    # 'social.backends.twitter.TwitterOAuth',
    # 'social.backends.yahoo.YahooOpenId',
    # 'social.backends.stripe.StripeOAuth2',
    # 'social.backends.persona.PersonaAuth',
    # 'social.backends.facebook.FacebookOAuth2',
    'mars.HeadlessFacebookBackend',
    # 'social.backends.facebook.FacebookAppOAuth2',
    # 'social.backends.yahoo.YahooOAuth',
    # 'social.backends.angel.AngelOAuth2',
    # 'social.backends.behance.BehanceOAuth2',
    # 'social.backends.bitbucket.BitbucketOAuth',
    # 'social.backends.box.BoxOAuth2',
    # 'social.backends.linkedin.LinkedinOAuth',
    # 'social.backends.github.GithubOAuth2',
    # 'social.backends.foursquare.FoursquareOAuth2',
    # 'social.backends.instagram.InstagramOAuth2',
    # 'social.backends.live.LiveOAuth2',
    # 'social.backends.vk.VKOAuth2',
    # 'social.backends.dailymotion.DailymotionOAuth2',
    # 'social.backends.disqus.DisqusOAuth2',
    # 'social.backends.dropbox.DropboxOAuth',
    # 'social.backends.eveonline.EVEOnlineOAuth2',
    # 'social.backends.evernote.EvernoteSandboxOAuth',
    # 'social.backends.fitbit.FitbitOAuth',
    # 'social.backends.flickr.FlickrOAuth',
    # 'social.backends.livejournal.LiveJournalOpenId',
    # 'social.backends.soundcloud.SoundcloudOAuth2',
    # 'social.backends.thisismyjam.ThisIsMyJamOAuth1',
    # 'social.backends.stocktwits.StocktwitsOAuth2',
    # 'social.backends.tripit.TripItOAuth',
    # 'social.backends.clef.ClefOAuth2',
    # 'social.backends.twilio.TwilioAuth',
    # 'social.backends.xing.XingOAuth',
    # 'social.backends.yandex.YandexOAuth2',
    # 'social.backends.podio.PodioOAuth2',
    # 'social.backends.reddit.RedditOAuth2',
    # 'social.backends.mineid.MineIDOAuth2',
    # 'social.backends.wunderlist.WunderlistOAuth2',
)
