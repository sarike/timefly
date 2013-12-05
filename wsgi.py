from flask import Flask
from flask.ext.login import LoginManager
from models.user import User
from utils.db_utils.database_session import session_cm
from views.account.view import account
from views.frontend.views import frontend
from views.todo.views import todo

app = Flask(__name__)
app.config.from_object('config.settings')

app.register_blueprint(todo, url_prefix='/todo')
app.register_blueprint(account, url_prefix='/account')
app.register_blueprint(frontend, url_prefix='')

login_manager = LoginManager()

@login_manager.user_loader
def load_user(user_id):
    with session_cm() as session:
        return session.query(User).get(user_id)

login_manager.init_app(app)

if __name__ == '__main__':
    app.run(port=5001)
