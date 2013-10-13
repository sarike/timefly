from sqlalchemy.dialects.mysql.base import BIGINT
from sqlalchemy.orm import relationship
from sqlalchemy.types import String, Boolean, DateTime
from models.achievement import Achievement
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
    todo_is_top = SA.Column(Boolean, default=False)
    todo_erasable = SA.Column(Boolean, default=False)
    todo_is_completed = SA.Column(Boolean, default=False)
    todo_is_deleted = SA.Column(Boolean, default=False)

    achievement_list = relationship(Achievement, order_by='desc(Achievement.created_date)')

    def __unicode__(self):
        return self.todo_name

    def to_dict(self):
        return {
            'todo_id': str(self.todo_id),
            'todo_name': self.todo_name,
            'todo_description': self.todo_description,
            'todo_visible': self.todo_visible,
            'todo_erasable': self.todo_erasable,
            'todo_start': self.todo_start.strftime("%Y-%m-%d"),
            'todo_end': self.todo_end.strftime("%Y-%m-%d"),
            'todo_is_completed': self.todo_is_completed,
            'user': self.user.to_dict(),
            'achievement_list': [ac.to_dict() for ac in self.achievement_list]
        }