import contextlib
import sqlalchemy
from sqlalchemy.orm.session import sessionmaker
from config.settings import DB, ECHO_SQL

db_engine = sqlalchemy.create_engine(
    'mysql://%s:%s@%s:%s/%s?charset=utf8' % (DB['user'], DB['password'], DB['host'], DB['port'], DB['db_name']),
    echo=ECHO_SQL,
    pool_recycle=3600,
    pool_size=15
)

@contextlib.contextmanager
def session_cm():
    session = sessionmaker(bind=db_engine)()
    try:
        yield session
    except Exception, e:
        # logger.warn(traceback.format_exc())
        raise
    finally:
        session.close()