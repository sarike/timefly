import os
import urlparse

DEBUG = True
SECRET_KEY = 'time_fly key'


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
        'user': 'root',
        'password': 'root',
        'port': '3306'
    }