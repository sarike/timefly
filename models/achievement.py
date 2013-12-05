from sqlalchemy.dialects.mysql.base import BIGINT, TEXT
from sqlalchemy.types import String, DateTime
from models.base import Base, id_generate
import sqlalchemy as SA


class Achievement(Base):

    __tablename__ = 'achievement'
    PER_PAGE = 15

    ac_id = SA.Column(BIGINT(unsigned=True), default=id_generate, primary_key=True)
    ac_name = SA.Column(String(128))
    ac_description = SA.Column(TEXT)

    todo_id = SA.Column(BIGINT(unsigned=True), SA.ForeignKey("todo.todo_id"), nullable=False)
    user_id = SA.Column(BIGINT(unsigned=True), SA.ForeignKey("user.user_id"), nullable=False)

    def __unicode__(self):
        return self.ac_name

    def to_dict(self):
        return {
            'id': str(self.ac_id),
            'ac_name': self.ac_name,
            'ac_description': self.ac_description,
            'created_date': self.created_date.strftime("%Y-%m-%d %H:%M"),
        }