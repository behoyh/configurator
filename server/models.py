from typing import List, Union, Any, Optional
from sqlmodel import Field, SQLModel, JSON, Column
from pydantic import BaseModel
import uuid

class Parameter(BaseModel):
    key: str
    type: str
    values: List[Any]

class SweepConfigBase(SQLModel):
    name: str
    description: str
    parameters: List[dict] = Field(sa_column=Column(JSON))

class SweepConfig(SweepConfigBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

class SweepConfigCreate(SweepConfigBase):
    pass

class SweepConfigRead(SweepConfigBase):
    id: uuid.UUID
