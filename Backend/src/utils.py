import pandas as pd


def get_mean_hourly_ridership(
    csv: str = "https://data.ny.gov/resource/wujg-7c2s.csv?$limit=500000000&$select=station_complex_id,transit_timestamp,sum(ridership)&$group=station_complex_id,transit_timestamp&$where=transit_timestamp>'2023-01-01T00:00:00'",
):
    """This function reads in the data from the csv file and returns the mean hourly ridership for each station complex."""
    df = pd.read_csv(csv)  # Read in the data.
    df["hours"] = df["transit_timestamp"].apply(
        lambda x: x.split("T")[1].split(":")[0]
    )  # Adding a column of just the hours (24 hour military scale).

    return (
        df.groupby(["hours", "station_complex_id"])["sum_ridership"]
        .mean()
        .reset_index()
    )


def get_station_ridership(
    complex_id: str,
    hour: str,
    df: pd.DataFrame,
):
    return dict(
        df[(df["station_complex_id"] == complex_id) & (df["hours"] == hour)].iloc[0]
    )
