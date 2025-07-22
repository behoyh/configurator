import grpc
import time
from concurrent import futures
import asyncio
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select, SQLModel
import uuid


import status_pb2 as status_pb2
import status_pb2_grpc as status_pb2_grpc
from database import get_session, engine
from models import SweepConfig, SweepConfigCreate, SweepConfigRead, SweepConfigBase, Parameter



def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    create_db_and_tables()
    yield
    # Shutdown

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8080",
    "http://localhost:7891"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/configs", response_model=SweepConfigRead)
def create_sweep_config(config: SweepConfigCreate, db: Session = Depends(get_session)):
    db_config = SweepConfig.model_validate(config)
    db.add(db_config)
    db.commit()
    db.refresh(db_config)
    return db_config

@app.get("/configs/{id}", response_model=SweepConfigRead)
def read_sweep_config(id: uuid.UUID, db: Session = Depends(get_session)):
    config = db.get(SweepConfig, id)
    if not config:
        raise HTTPException(status_code=404, detail="Configuration not found")
    return config

@app.get("/configs", response_model=list[SweepConfigRead])
def read_sweep_configs(db: Session = Depends(get_session)):
    print("Reading all configs")
    configs = db.exec(select(SweepConfig)).all()
    return configs

class StatusStreamerServicer(status_pb2_grpc.StatusStreamerServicer):
    def StreamStatus(self, request, context):
        for i in range(101):
            yield status_pb2.StatusUpdate(state="RUNNING", progress=i)
            time.sleep(0.1)
        yield status_pb2.StatusUpdate(state="COMPLETED", progress=100)


def serve_grpc():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    status_pb2_grpc.add_StatusStreamerServicer_to_server(StatusStreamerServicer(), server)
    server.add_insecure_port('[::]:5001')
    server.start()
    server.wait_for_termination()

async def main():
    loop = asyncio.get_event_loop()
    loop.run_in_executor(None, serve_grpc)
    config = uvicorn.Config(app, host="0.0.0.0", port=8000, log_level="info")
    server = uvicorn.Server(config)
    await server.serve()

if __name__ == '__main__':
    asyncio.run(main())
