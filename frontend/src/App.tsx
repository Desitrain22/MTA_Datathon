import subwayLines from "@/assets/lines.json";
import rawStations from "@/assets/stations.json";
import Marker from "@/common/ConcentricChart";
import FilterWindow from "@/common/FilterWindow";
import { stationToColor } from "@/common/color-helpers";
import type { GeoJsonObject } from "geojson";
import { latLngBounds } from "leaflet";
import { GeoJSON, MapContainer, Pane, TileLayer } from "react-leaflet";

// Merge stations by complex ID
type Station = (typeof rawStations)[0];
const stationsDict = {} as Record<string, Station[]>;
rawStations.forEach((station) => {
	stationsDict[station["Complex ID"]] = [
		...(stationsDict[station["Complex ID"]] || []),
		station,
	];
});
const stations = Object.values(stationsDict).map((stations) => {
	// Average the coordinates of all stations in the complex
	// Add all the lines together
	const coords = stations.map((station) => [
		station["GTFS Latitude"],
		station["GTFS Longitude"],
	]);
	const center = coords.reduce(
		(acc, coord) => acc.map((a, i) => a + coord[i]!),
		[0, 0],
	) as [number, number];
	center[0] /= coords.length;
	center[1] /= coords.length;
	return {
		...stations[0]!,
		"GTFS Latitude": center[0],
		"GTFS Longitude": center[1],
		"Daytime Routes": stations
			.map((station) => station["Daytime Routes"])
			.join(" "),
	};
});

const nycBounds = latLngBounds(
	// Southwest corner (Staten Island)
	[40.4961, -74.2557],
	// Northeast corner (Bronx)
	[40.9176, -73.7002],
);

function App() {
	return (
		<>
			<div className="absolute top-0 left-0 z-[99999999] p-4 pl-2 pt-2 text-black md:p-8 border border-2 border-black bg-white/75 backdrop-blur-sm rounded-br-2xl">
				<h1 className="font-bold text-6xl">Transit Tides</h1>
				<h2 className="text-2xl">Exploring NYC Subway Usage</h2>
			</div>
			<div className="absolute bottom-0 left-0 z-[9999999] p-4 text-black md:p-8">
				<FilterWindow stations={stations} />
			</div>
			<MapContainer
				className="absolute top-0 left-0 h-screen w-screen"
				zoomControl={false}
				center={[40.7128, -74.006]}
				zoom={14}
				maxBounds={nycBounds}
				maxBoundsViscosity={1.0}
				minZoom={11}
				maxZoom={16}
				bounceAtZoomLimits={false}
				scrollWheelZoom={true}
				worldCopyJump={false}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/light_nolabels/{z}/{x}/{y}.png"
				/>
				<Pane
					name="tint-pane"
					style={{
						zIndex: 250,
						pointerEvents: "none",
						backgroundColor: "#E5CC9160",
						width: "1000vw",
						height: "400vh",
						marginLeft: "-500vw",
						marginTop: "-200vh",
					}}
				>
					<div className="h-full w-full" />
				</Pane>
				<GeoJSON
					data={subwayLines as GeoJsonObject}
					style={(feature) => ({
						weight: 5,
						color: feature && stationToColor(feature.properties.name),
						zIndex: 300,
					})}
				/>
				{stations.map((station) => (
					<Marker
						title={station["Stop Name"]}
						stations={
							typeof station["Daytime Routes"] === "number"
								? [`${station["Daytime Routes"]}`]
								: station["Daytime Routes"].split(" ")
						}
						position={[station["GTFS Latitude"], station["GTFS Longitude"]]}
					/>
				))}
			</MapContainer>
		</>
	);
}

export default App;
