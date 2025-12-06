from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='.', static_url_path='')

@app.route('/')
def index():
    return send_from_directory(os.getcwd(), 'index.html')

@app.route('/script.js')
def script():
    return send_from_directory(os.getcwd(), 'script.js')


if __name__ == '__main__':
    app.run(debug=True)