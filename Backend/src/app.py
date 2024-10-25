from fastapi import FastAPI
import pandas as pd
import uvicorn

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "Hello, World!"}


@app.get("/station_ridership/{complex_id}/{hour}")
def station_ridership(complex_id: str, hour: str):
    df["hours"] = df["hours"].astype(str)
    return dict(
        df[(df["station_complex_id"] == complex_id) & (df["hours"] == hour)].iloc[0]
    )


@app.get("/all_stations/{hour}")
def all_stations(hour: str):
    df["hours"] = df["hours"].astype(str)
    return dict(df[df["hours"] == hour].set_index("station_complex_id").T)


if __name__ == "__main__":
    global df
    df = pd.read_json("src/outputs/new_ridership.json")
    print(df)
    uvicorn.run(app, host="0.0.0.0", port=8000)
