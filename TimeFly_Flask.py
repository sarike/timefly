from flask import Flask
from accounts.view import accounts

app = Flask(__name__)
app.config.from_object('config.settings')
app.register_blueprint(accounts, url_prefix='/accounts')


@app.route('/')
def hello_world():
    return 'Hello World!'


if __name__ == '__main__':
    app.run()
