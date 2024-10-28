from fastapi import FastAPI
import pandas as pd
from fastapi import Request

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "Hello, World!"}


@app.get("/station_ridership/{complex_id}/{hour}")
def station_ridership(complex_id: str, hour: str):
    """Given a station complex id and an hour, returns the ridership for that station at that hour. Note that the hour is formatted without any leading zeros

    Args:
        complex_id (str): an alphanumerical complex id of a station (618, 10, TRAM1)
        hour (str): a number in the range (0, 24) representing the military time of the day.

    Returns:
        json: Ridership for the station at that hour. at 10 A.M, for station 618, the json would look like this:
        {
            "station_complex_id": "618",
            "hours": "10",
            "sum_ridership": 100
        }
        Where there are on average 100 unique riders swiping in to the station from 10 to 11 A.M.
    """
    df = pd.read_json("outputs/new_ridership_time_strata.json")

    df["hours"] = df["hours"].astype(str)
    json_return = dict(
        df[(df["station_complex_id"] == complex_id) & (df["hours"] == hour)].iloc[0]
    )

    json_return["avg"] = df[df["hours"] == hour]["sum_ridership"].mean()

    return json_return


@app.post("/stations_at_hour/")
async def stations_at_hour(request: Request):
    """Given a list of station complex ids (as strings) and an hour, returns the ridership for those stations at that hour. Note that the hour is formatted without any leading zeros

     Args:
        stations lst[str]: an alphanumerical complex id of a station (618, 10, TRAM1)
        hour int: a number in the range (0, 24) representing the military time of the day.


    Returns:
        json: Ridership for the station at that hour. at 10 A.M, for station 1 and 618, the json would look like this:
        {
            "station_complex_id": "618",
            "hours": "10",
            "sum_ridership": 100
        }
        {
            "station_complex_id": "1",
            "hours": "10",
            "sum_ridership": 42
        }
    """
    data = await request.json()
    stations = data.get("stations")
    hour = data.get("hour")
    df = pd.read_json("outputs/new_ridership_time_strata.json")

    filtered_df = df[df["station_complex_id"].isin(stations) & (df["hours"] == hour)]

    json_return = dict(filtered_df.set_index("station_complex_id").T)

    return dict(json_return)


@app.get("/all_stations/{hour}")
def all_stations(hour: str):
    """Given an hour, returns the ridership for all stations at that hour. Note that the hour is formatted without any leading zeros"""
    df = pd.read_json("outputs/new_ridership_time_strata.json")

    df["hours"] = df["hours"].astype(str)
    json_return = dict(df[df["hours"] == hour].set_index("station_complex_id").T)
    json_return["avg"] = df[df["hours"] == hour]["sum_ridership"].mean()
    return json_return


@app.post("/stations_at_timespan/")
async def stations_at_timespam(request: Request):
    """Given a list of stations and a timespan, returns the ridership for those stations at that timespan, and the average overall ridership across different time spans for that station.
    Note that the timespan is formatted as a string (Early Morning, Morning, Midday, Afternoon, Evening, Overnight)

    Args:
        list[str]: a list of alphanumerical complex id of a station (618, 10, TRAM1)
        timespan str: a string representing the timespan of the day. (Early Morning, Morning, Midday, Afternoon, Evening, Overnight)

    Returns:
        json: Ridership at the timespan + average ridership for each station.
        {
            "1": {
                "time_of_day": "Afternoon",
                "sum_ridership": 1963.261021904,
                "mean_ridership": 1506.9378560725
            },
            "10": {
                "time_of_day": "Afternoon",
                "sum_ridership": 6223.5837245697,
                "mean_ridership": 2646.8120364523165
            },
            "618": {
                "time_of_day": "Afternoon",
                "sum_ridership": 12573.2378716745,
                "mean_ridership": 5092.022553230317
            }
        }
        This means that in the afternoon, station 1 averages 1963 riders over the course of the 4 hour time span.
        Over all time spans, station 1 averages 1506 riders, meaning the afternoon is relatively high traffic.

    """
    data = await request.json()
    stations = data.get("stations")
    timespan = data.get("timespan")

    df = pd.read_json("outputs/new_ridership_time_strata.json")

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

    json_return = dict(
        grouped_by_timespan[
            grouped_by_timespan["station_complex_id"].isin(stations)
            & (grouped_by_timespan["time_of_day"] == timespan)
        ]
        .set_index("station_complex_id")
        .T
    )

    return dict(json_return)

