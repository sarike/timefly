"""change desc col to accept md content

Revision ID: 2ffa56ce3811
Revises: None
Create Date: 2013-12-04 20:33:08.747000

"""

# revision identifiers, used by Alembic.
from sqlalchemy.dialects.mysql.base import TEXT
from sqlalchemy.types import String

revision = '2ffa56ce3811'
down_revision = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.alter_column("todo", "todo_description", type_=TEXT)
    op.alter_column("achievement", "ac_description", type_=TEXT)


def downgrade():
    op.alter_column("todo", "todo_description", type_=String(256))
    op.alter_column("achievement", "ac_description", type_=String(512))
