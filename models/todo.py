from sqlalchemy.dialects.mysql.base import BIGINT
from sqlalchemy.types import String, Boolean, DateTime
from models.base import Base, id_generate
import sqlalchemy as SA


class Todo(Base):

    __tablename__ = 'todo'
    PER_PAGE = 15

    todo_id = SA.Column(BIGINT(unsigned=True), default=id_generate, primary_key=True)
    user_id = SA.Column(BIGINT(unsigned=True), SA.ForeignKey("user.user_id"))
    todo_name = SA.Column(String(128))
    todo_description = SA.Column(String(256))
    todo_visible = SA.Column(Boolean, default=True)
    todo_start = SA.Column(DateTime)
    todo_end = SA.Column(DateTime)
    todo_add_time = SA.Column(DateTime)
    todo_is_top = SA.Column(Boolean, default=False)
    todo_erasable = SA.Column(Boolean, default=False)
    todo_is_completed = SA.Column(Boolean, default=False)
    todo_is_deleted = SA.Column(Boolean, default=False)

    def __unicode__(self):
        return self.todo_name