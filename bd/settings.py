# Let's just use the local mongod instance. Edit as needed.

# Please note that MONGO_HOST and MONGO_PORT could very well be left
# out as they already default to a bare bones local 'mongod' instance.
# MONGO_HOST = 'localhost'
# MONGO_PORT = 27017
# MONGO_USERNAME = 'test'
# MONGO_PASSWORD = 'user'
MONGO_DBNAME = 'apitest'


# Enable reads (GET), inserts (POST) and DELETE for resources/collections
# (if you omit this line, the API will default to ['GET'] and provide
# read-only access to the endpoint).
RESOURCE_METHODS = ['GET', 'POST', 'DELETE']

# Enable reads (GET), edits (PATCH), replacements (PUT) and deletes of
# individual items  (defaults to read-only item access).
ITEM_METHODS = ['GET', 'PATCH', 'PUT', 'DELETE']


# schemaU = {
#     'allow_unknown': True
# }
schema2 = {
    'pk': {
        'type': 'string',
        'unique': True,
    },
    'descr': {
        'type': 'string',
    },
    'lat': {
        'type': 'float',
    },
    # 'role' is a list, and can only contain values from 'allowed'.
    'lon': {
        'type': 'float',
    },
    'reg': {
        'type': 'string',
    },
}

# info = {
#     'datasource': {
#         'source': 'data',
#     },
#     'resource_methods': ["GET"],
#     'item_methods': [],
# }

data = {
    # 'title' tag used in item links. Defaults to the resource title minus
    # the final, plural 's' (works fine in most cases but not for 'people')
    'item_title': 'data',

    # by default the standard item entry point is defined as
    # '/people/<ObjectId>'. We leave it untouched, and we also enable an
    # additional read-only entry point. This way consumers can also perform
    # GET requests at '/people/<lastname>'.
    'additional_lookup': {
         'url': 'regex("\d+(\.\d+)+")',
         'field': 'pk'
    },

    # We choose to override global cache-control directives for this resource.
    'cache_control': 'max-age=10,must-revalidate',
    'cache_expires': 10,

    # most global settings can be overridden at resource level
    # 'resource_methods': ['GET', 'POST'],

    'schema': schema2
}

DOMAIN = {
    "data": data,
    # "info": info,
}

#PAGINATION_LIMIT = 100000
X_DOMAINS = "*"

XML = False
