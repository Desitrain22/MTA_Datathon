from fastapi import FastAPI
from utils import get_station_ridership
import pandas as pd
import uvicorn

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "Hello, World!"}


@app.get("/station_ridership/{complex_id}/{hour}")
def station_ridership(complex_id: str, hour: str):
    return get_station_ridership(str(complex_id), str(hour), df)


if __name__ == "__main__":
    global df
    df = pd.read_json("src/outputs/new_ridership.json")
    print(df)
    uvicorn.run(app, host="0.0.0.0", port=8000)
