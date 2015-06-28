from eve import Eve
from flask import current_app, jsonify
from flask.ext.cors import cross_origin

app = Eve()


# def post_get_callback(r):
#     print(r)
#     raise

# app.on_fetched_resource_info += post_get_callback

@app.route("/info")
@cross_origin(allow_headers=['Content-Type'])
def info():
    resource = "data"
    years = current_app.data.driver.db[resource].find({}).distinct("year")

    r = {
        "data": {
            "years": years,
        }
    }
    return jsonify(r)


@app.route("/info/<year>")
@cross_origin(allow_headers=['Content-Type'])
def info_data(year):
    resource = "data"
    year = int(year)

    total = current_app.data.driver.db[resource].find({'year': year}).count()
    notmapped = current_app.data.driver.db[resource].find(
        {'year': year, 'lat': 404}).count()
    noregion = current_app.data.driver.db[resource].find(
        {'year': year, 'reg': ''}).count()

    r = {
        "data": {
            "total": total,
            "mapped": total - notmapped,
            "region": total - noregion,
        }
    }
    return jsonify(r)


@app.route("/list/<year>")
@cross_origin(allow_headers=['Content-Type'])
def list(year):
    resource = "data"
    year = int(year)

    proj = {"pk": 1, "lat": 1, "lon": 1, "_id": 0}
    cursor = current_app.data.driver.db[resource].find(
        {'year': year}, proj)
    return jsonify({"data": [i for i in cursor]})


if __name__ == '__main__':
    app.run(debug=True)
