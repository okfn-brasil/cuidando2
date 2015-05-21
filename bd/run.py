from eve import Eve
from flask import current_app, jsonify
from flask.ext.cors import cross_origin

app = Eve()


@app.route("/list/<resource>")
@cross_origin(allow_headers=['Content-Type'])
def list(resource):
    proj = {"pk": 1, "lat": 1, "lon": 1, "_id": 0}
    cursor = current_app.data.driver.db[resource].find({}, proj)
    return jsonify({"data": [i for i in cursor]})


if __name__ == '__main__':
    app.run(debug=True)
