from flask.ext.script import Manager
from utils.build_utils.static_package import package_js
from utils.database import init_db, alter_db
from wsgi import app

manager = Manager(app)


@manager.command
def hello(name):
    u"""Just test say hello"""
    print 'hello', name


@manager.command
def build():
    package_js('timefly')


@manager.command
def db_init():
    init_db()


@manager.command
def db_alter():
    alter_db()


if __name__ == "__main__":
    manager.run()