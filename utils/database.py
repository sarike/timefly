#coding=utf8
import traceback
from sqlalchemy.dialects.mysql.base import TEXT
from sqlalchemy.schema import Table
from sqlalchemy.types import String
from models.achievement import Achievement
from models.base import Base
from models.todo import Todo
from models.user import User
from utils.database_session import db_engine

metadata = Base.metadata


def init_db():
    tables = [User.__table__,
              Todo.__table__,
              Achievement.__table__]
    metadata.create_all(bind=db_engine, tables=tables)


def alter_column(table_name, col, **kwargs):
    u"""
        修改某个表中字段的属性
    """
    try:
        assert type(table_name) is str
        assert type(col) is str
        table = Table(table_name, metadata, autoload=True)
        print 'altering col', col
        getattr(table.c, col).alter(**kwargs)
    except AssertionError:
        print 'col should be a str type'
    except Exception, e:
        print traceback.format_exc(e)


def alter_db_for_markdown_context_input():
    """
    todo.todo_description: String(256) ---> String(2000)
    achievement.ac_description: String(512) ---> Text
    """
    alter_column('todo', 'todo_description', type=String(2000))
    alter_column('achievement', 'ac_description', type=TEXT)


def alter_db():
    alter_db_for_markdown_context_input()


if __name__ == '__main__':
    init_db()