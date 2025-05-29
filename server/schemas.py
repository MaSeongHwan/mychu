from pydantic import BaseModel

class AssetRead(BaseModel):
    actr_disp: str | None
    asset_nm: str | None
    genre: str | None

    class Config:
        orm_mode = True

class UserRead(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        orm_mode = True