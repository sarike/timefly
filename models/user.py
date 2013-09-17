#coding=utf-8
import hashlib
from flask.ext.login import UserMixin
from sqlalchemy.dialects.mysql import BIGINT, VARCHAR
from sqlalchemy.orm import relationship, backref
from sqlalchemy.types import String, Boolean
from werkzeug.security import generate_password_hash, check_password_hash
from models.base import Base, id_generate
import sqlalchemy as SA
from utils.database_session import session_cm


class User(Base, UserMixin):
    __tablename__ = 'user'
    PER_PAGE = 15

    user_id = SA.Column(BIGINT(unsigned=True), default=id_generate, primary_key=True)
    email = SA.Column(VARCHAR(128, charset='latin1', collation='latin1_general_cs'), unique=True, nullable=False)
    username = SA.Column(String(128), unique=True, nullable=False)
    nick_name = SA.Column(String(128))
    active = SA.Column(Boolean, default=True, nullable=False)
    is_admin = SA.Column(Boolean, default=False, nullable=False)
    pw_hash = SA.Column(String(128))

    todo_list = relationship('Todo', backref='user')

    def get_id(self):
        return self.user_id

    def set_password(self, pw):
        self.pw_hash = generate_password_hash(pw, salt_length=16)

    def check_password(self, pw):
        return check_password_hash(self.pw_hash, pw)

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "username": self.username,
            "is_authenticated": self.is_authenticated(),
            "avatar_hash": self.get_gravatar_hash()
        }

    @classmethod
    def validate_user(cls, email, password):
        # TODO: 验证用户是否激活，否则发送激活邮件
        validate_user_errors = {}
        with session_cm() as session:
            user = session.query(User).filter(User.email == email).first()
            if not user:
                validate_user_errors['user_error'] = u'该邮箱尚未注册'
                return None, validate_user_errors
            elif not user.check_password(password):
                validate_user_errors['password_error'] = u'密码错误'
                return None, validate_user_errors
            return user, validate_user_errors

    def get_gravatar_hash(self):
        return hashlib.md5(self.email.lower()).hexdigest()