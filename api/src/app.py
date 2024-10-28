from fastapi import FastAPI
import pandas as pd
import uvicorn
from fastapi import Request

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "Hello, World!"}


@app.get("/station_ridership/{complex_id}/{hour}")
def station_ridership(complex_id: str, hour: str):
    df["hours"] = df["hours"].astype(str)
    json_return = dict(
        df[(df["station_complex_id"] == complex_id) & (df["hours"] == hour)].iloc[0]
    )

    json_return["avg"] = df[df["hours"] == hour]["sum_ridership"].mean()

    return json_return


@app.get("/all_stations/{hour}")
def all_stations(hour: str):
    df["hours"] = df["hours"].astype(str)
    json_return = dict(df[df["hours"] == hour].set_index("station_complex_id").T)
    json_return["avg"] = df[df["hours"] == hour]["sum_ridership"].mean()
    return json_return


@app.post("/stations_at_hour/")
async def submit_data(request: Request):
    data = await request.json()
    stations = data.get("stations")
    hour = data.get("hour")
    filtered_df = df[df["station_complex_id"].isin(stations) & (df["hours"] == hour)]

    
    json_return = dict(filtered_df.set_index("station_complex_id").T)
    json_return["avg"] = filtered_df[filtered_df["hours"] == hour][
        "sum_ridership"
    ].mean()

    return dict(json_return)


if __name__ == "__main__":
    df = pd.read_json("src/outputs/new_ridership.json")
    uvicorn.run(app, host="0.0.0.0", port=8000)
