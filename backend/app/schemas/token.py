from pydantic import BaseModel, Field


class Token(BaseModel):
    access_token: str = Field(
        description="Short-lived JWT used to access protected APIs.",
    )

    refresh_token: str = Field(
        description="Long-lived JWT used to obtain a new access token.",
    )

    token_type: str = Field(
        default="bearer",
        description="Authentication scheme used for the access token.",
    )