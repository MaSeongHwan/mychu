from pydantic import BaseModel

class ItemBase(BaseModel):
    """
    Base model for Item
    """
    name: str
    description: str | None = None

class ItemCreate(ItemBase):
    """
    Model for creating a new item
    """
    pass

class Item(ItemBase):
    """
    Model for Item response
    """
    id: int

    class Config:
        from_attributes = True 