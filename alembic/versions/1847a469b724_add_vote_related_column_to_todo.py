"""add vote related column to todo

Revision ID: 1847a469b724
Revises: 2ffa56ce3811
Create Date: 2013-12-15 16:48:40.456000

"""

# revision identifiers, used by Alembic.
revision = '1847a469b724'
down_revision = '2ffa56ce3811'

from alembic import op
from sqlalchemy.types import Integer
import sqlalchemy as sa


def upgrade():
    op.add_column('todo', sa.Column('todo_down_vote', Integer()))
    op.add_column('todo', sa.Column('todo_up_vote', Integer()))


def downgrade():
    op.drop_column('todo', 'todo_down_vote')
    op.drop_column('todo', 'todo_up_vote')