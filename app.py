#!/usr/bin/env python
# -*- coding: utf-8 -*-
from datetime import datetime

from flask import Flask, request
from flask import render_template
from flask import send_from_directory

from secret import SECRET_KEY


app = Flask(__name__)
app.secret_key = SECRET_KEY
app.url_map.strict_slashes = False


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/service-worker.js')
def service_worker():
    return send_from_directory(app.static_folder, request.path[1:])


if __name__ == '__main__':
    app.run(debug=True)
