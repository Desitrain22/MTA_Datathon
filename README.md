# Team Dongress: MTA Open Data Challenge

Our goal: Create a fun, interactive website where users can visualize

- Average ridership at a given hour across the whole MTA system
- Aggregate ridership traffic for a given train line
- Select different times to compare and contrast traffic around the whole system.

When we lived in Manhattan, we'd select different stations based on traffic. Sometimes, the extra few blocks to 49th St beats the traffic at Time Sq. Even more so, the live traffic at a stop like Fulton St's 4/5 stop can give insight on potential delays and unsafe levels of crowding.

However, the utility is secondary to fun. We wanted to encompass as much of New York's energy as we could with our branding. Ultimately, the MTA and it's data should be accessible for everyone.

Frontend: React (Daniel Tao [@danxtao](https://twitter.com/danxtao) [github](https://github.com/sigmachirality))

Backend + Data: Python/Pandas (Neal Patel [@HinduHops](https://twitter.com/HinduHops))

Design: Adobe Illustrator (Iris Xie [@Pi.xien](https://instagram.com/pi.xien))

Station/Booth Mapping: Excel (Dongress special guest Ricky Li [@swagasianninja](https://instagram.com/mr.rickyy))

# MTA Datasets employed

[Legacy Turnstyle Usage Data](https://data.ny.gov/Transportation/MTA-Subway-Turnstile-Usage-Data-2022/k7j9-jnct/about_data) - The legacy dataset which provides both entries and exits. Unfortunately, this dataset is stratified in 4 hour chunks (3 A.M, 7 A.M, 11 A.M, 3 P.M, 7 P.M, and 11 P.M) and doesn't have the complex IDs.

[Hourly Ridership Data (new)](https://data.ny.gov/Transportation/MTA-Subway-Hourly-Ridership-Beginning-July-2020/wujg-7c2s/about_data) - The core dataset giving us the complex IDs, timestamps, and ridership per complex. Specifically, we constructed [the magic endpoint](https://data.ny.gov/resource/wujg-7c2s.json?$limit=200000000&$select=station_complex_id,transit_timestamp,sum(ridership)&$group=station_complex_id,transit_timestamp&$where=transit_timestamp>'2023-01-01T00:00:00') The curated endpoint from the new ridership dataset, which gets the complex Ids, timestamps, and summed ridership across all payment types for each complex ID. Warning, this endpoint will take minutes to load.

[Station Directory](https://data.ny.gov/widgets/i9wp-a4ja) - A cross reference for mapping station names, booths, and complex IDs

[Station Directory with coordinates](https://data.ny.gov/Transportation/MTA-Subway-Stations/39hk-dx4f/about_data) -- Information for populating the front end for each complex ID accurately, with proper human readable naming conventions.


# References
[NYC Turnstile Counts](https://github.com/qri-io/data-stories-scripts/tree/master/nyc-turnstile-counts) - exploring turnstile counts and mappings of units, booths, and remotes

[Stations Data](http://web.mta.info/developers/data/nyct/subway/Stations.csv) - Raw MTA station information. This, combined with the below dock, helped us group units by station complex.

[Remote-Booth-Station](http://web.mta.info/developers/resources/nyct/turnstile/Remote-Booth-Station.xls) - A well hidden document of all the Unit - Station ID mappings. Special thanks to 

[Yanghe Huo's write up](http://www.columbia.edu/~yh2693/MTA_data.html), an archived 2020 data challenge piece, with which we would've never found the modern Remote-Booth-Station xls.

[Chris Wong's Write up](https://medium.com/qri-io/taming-the-mtas-unruly-turnstile-data-c945f5f96ba0) - Offered one example of matching booths to units. Unfortunately, the disparity in the naming convention for stations between documents resulted in teammate Ricky's manual matching of remotes to complex IDs in order to get the exit data.
