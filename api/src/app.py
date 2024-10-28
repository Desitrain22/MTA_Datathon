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


@app.post("/stations_at_timespan/")
async def stations_at_timespam(request: Request):
    data = await request.json()
    stations = data.get("stations")
    timespan = data.get("timespan")

    json_return = dict(
        grouped_by_timespan[
            grouped_by_timespan["station_complex_id"].isin(stations)
            & (grouped_by_timespan["time_of_day"] == timespan)
        ]
        .set_index("station_complex_id")
        .T
    )

    return dict(json_return)


if __name__ == "__main__":
    df = pd.read_json("src/outputs/new_ridership_time_strata.json")

    grouped_by_timespan = (
        df.groupby(["station_complex_id", "time_of_day"])["sum_ridership"]
        .sum()
        .reset_index()
    )

    avg_by_timespan = (
        grouped_by_timespan.groupby(["station_complex_id"])["sum_ridership"]
        .mean()
        .reset_index()
        .rename(columns={"sum_ridership": "mean_ridership"})
    )

    grouped_by_timespan = (
        grouped_by_timespan.set_index("station_complex_id")
        .join(avg_by_timespan.set_index("station_complex_id")["mean_ridership"])
        .reset_index()
    )

    uvicorn.run(app, host="0.0.0.0", port=8000)
