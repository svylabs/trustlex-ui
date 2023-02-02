#!/usr/bin/python3
from flask import Flask
import subprocess

app = Flask(__name__)


def format(res):
    return str(res).replace("\\n", "<br/>")

@app.route('/')
def index():
    return 'Hello world'

@app.route('/reset')
def restart():
    result = subprocess.run(['systemctl', 'restart', 'testnet.service'], capture_output=True)    
    return (format(result.stdout))

@app.route('/status')
def status():
    result = subprocess.run(['systemctl', 'status', 'testnet.service'], capture_output=True)
    return (format(result.stdout))

@app.route('/deploy')
def deploy():
    result = subprocess.run(['truffle', 'test', "./test/TrustlexOrderBookTest.js", "--compile-none"], capture_output=True)
    return (format(result.stdout))


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
