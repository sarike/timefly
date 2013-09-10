from models.achievement import Achievement
from models.base import Base
from models.todo import Todo
from models.user import User
from utils.database_session import db_engine


def init_db():
    tables = [User.__table__,
              Todo.__table__,
              Achievement.__table__]
    Base.metadata.create_all(bind=db_engine, tables=tables)

if __name__ == '__main__':
    init_db()