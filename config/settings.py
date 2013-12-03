import os
import posixpath
import urlparse


DEBUG = True

if 'TIME_FLY_MODE' in os.environ:
    time_fly_mode = os.environ.get('TIME_FLY_MODE').lower()
    if time_fly_mode == 'debug':
        DEBUG = True
    if time_fly_mode == 'production':
        DEBUG = False

SECRET_KEY = 'time_fly key'

PROJECT_PATH = os.path.dirname(posixpath.dirname(__file__.replace('\\', '/')))

ECHO_SQL = False

if 'OPENSHIFT_MYSQL_DB_URL' in os.environ:
    url = urlparse.urlparse(os.environ.get('OPENSHIFT_MYSQL_DB_URL'))
    DB = {
        'db_name': os.environ['OPENSHIFT_APP_NAME'],
        'user': url.username,
        'password': url.password,
        'host': url.hostname,
        'port': url.port,
    }

elif 'TIME_FLY_MYSQL_DB_USER' in os.environ and 'TIME_FLY_MYSQL_DB_PWD' in os.environ:
    DB = {
        'db_name': os.environ.get('TIME_FLY_MYSQL_DB_NAME', 'timefly'),
        'user': os.environ.get('TIME_FLY_MYSQL_DB_USER'),
        'password': os.environ.get('TIME_FLY_MYSQL_DB_PWD'),
        'host': os.environ.get('TIME_FLY_MYSQL_DB_HOST', 'localhost'),
        'port': os.environ.get('TIME_FLY_MYSQL_DB_PORT', '3306')
    }

else:
    DB = {
        'host': 'localhost',
        'db_name': 'time_fly',
        'user': 'sarike',
        'password': 'test',
        'port': '3306'
    }