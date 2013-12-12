import os
import posixpath
import urlparse


DEBUG = True

RECAPTCHA_PUBLIC_KEY = '6LfJr-sSAAAAAEFMby-eIiGDxxRAo-TuWaKP8pPZ'
RECAPTCHA_PRIVATE_KEY = '6LfJr-sSAAAAAC1mbnMkP1hfGQlt53YBVwMWQR0R'

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

else:
    DB = {
        'host': 'localhost',
        'db_name': 'time_fly',
        'user': 'sarike',
        'password': 'test',
        'port': '3306'
    }