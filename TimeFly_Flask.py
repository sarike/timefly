from flask import Flask
from flask.ext.login import LoginManager
from views.account.view import account
from views.todo.views import todo

app = Flask(__name__)
app.config.from_object('config.settings')

app.register_blueprint(todo, url_prefix='')
app.register_blueprint(account, url_prefix='/account')

login_manager = LoginManager()
login_manager.init_app(app)

if __name__ == '__main__':
    app.run()
