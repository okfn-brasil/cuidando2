from eve import Eve
from flask import current_app, jsonify
from flask.ext.cors import cross_origin

app = Eve()


# def post_get_callback(r):
#     print(r)
#     raise

# app.on_fetched_resource_info += post_get_callback

@app.route("/info/<resource>")
@cross_origin(allow_headers=['Content-Type'])
def info(resource):
    total = current_app.data.driver.db[resource].find({}).count()
    notmapped = current_app.data.driver.db[resource].find({'lat': 404}).count()
    r = {
        "data": {
            "total": total,
            "mapped": total - notmapped,
        }
    }
    return jsonify(r)


@app.route("/list/<resource>")
@cross_origin(allow_headers=['Content-Type'])
def list(resource):
    proj = {"pk": 1, "lat": 1, "lon": 1, "_id": 0}
    cursor = current_app.data.driver.db[resource].find({}, proj)
    return jsonify({"data": [i for i in cursor]})


if __name__ == '__main__':
    app.run(debug=True)
