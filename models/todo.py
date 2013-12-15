from sqlalchemy.dialects.mysql.base import BIGINT, TEXT
from sqlalchemy.orm import relationship
from sqlalchemy.types import String, Boolean, DateTime, Integer
from models.achievement import Achievement
from models.base import Base, id_generate
import sqlalchemy as SA


class Todo(Base):

    __tablename__ = 'todo'
    PER_PAGE = 15

    todo_id = SA.Column(BIGINT(unsigned=True), default=id_generate, primary_key=True)
    user_id = SA.Column(BIGINT(unsigned=True), SA.ForeignKey("user.user_id"))
    todo_name = SA.Column(String(128))
    todo_description = SA.Column(TEXT)
    todo_visible = SA.Column(Boolean, default=True)
    todo_start = SA.Column(DateTime)
    todo_end = SA.Column(DateTime)
    todo_is_top = SA.Column(Boolean, default=False)
    todo_erasable = SA.Column(Boolean, default=False)
    todo_is_completed = SA.Column(Boolean, default=False)
    todo_is_deleted = SA.Column(Boolean, default=False)

    todo_up_vote = SA.Column(Integer, default=0)
    todo_down_vote = SA.Column(Integer, default=0)

    achievement_list = relationship(Achievement, order_by='asc(Achievement.created_date)')

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
            'todo_down_vote': str(self.todo_down_vote or 0),
            'todo_up_vote': str(self.todo_up_vote or 0),
            'user': self.user.to_dict(),
            'achievement_list': [ac.to_dict() for ac in self.achievement_list]
        }