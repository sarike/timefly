import contextlib
import sqlalchemy
from sqlalchemy.orm.session import sessionmaker
from config.settings import DB

db_engine = sqlalchemy.create_engine(
    'mysql://%s:%s@%s/%s?charset=utf8' % (DB['user'], DB['password'], DB['host'], DB['db_name']),
    echo=True,
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