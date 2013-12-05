import datetime
import os
import threading
from sqlalchemy.ext.declarative.api import declarative_base
from sqlalchemy.orm.session import object_session
import sqlalchemy as SA
import time


class tBase(object):
    session = property(lambda self: object_session(self))

    created_date = SA.Column(SA.DateTime, default=datetime.datetime.utcnow)
    modified_date = SA.Column(SA.DateTime, default=datetime.datetime.utcnow, onupdate=SA.text('current_timestamp'))

Base = declarative_base(cls=tBase)


def id_generate():
    return IdGenerator.generate()


class IdGenerator(object):
    _inc = 0
    _inc_lock = threading.Lock()

    @staticmethod
    def generate():
        # 32 bits time
        id = (int(time.time()) & 0xffffffff) << 32
        # 8 bits pid
        id |= (os.getpid() % 0xFF) << 20
        # 20 bits increment number
        IdGenerator._inc_lock.acquire()
        id |= IdGenerator._inc
        IdGenerator._inc = (IdGenerator._inc + 1) % 0xFFFFF
        IdGenerator._inc_lock.release()

        return id