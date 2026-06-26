"""fix users table

Revision ID: 634a614b47d5
Revises: 6059501dc27a
Create Date: 2026-06-26 13:52:04.427949

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '634a614b47d5'
down_revision: Union[str, Sequence[str], None] = '6059501dc27a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column(
            "auth_provider",
            sa.String(length=50),
            nullable=False,
            server_default="email",
        ),
    )

    op.alter_column(
        "users",
        "auth_provider",
        server_default=None,
    )

    op.create_unique_constraint(
        "uq_users_google_sub",
        "users",
        ["google_sub"],
    )


def downgrade() -> None:
    op.drop_constraint(
        "uq_users_google_sub",
        "users",
        type_="unique",
    )

    op.drop_column("users", "auth_provider")