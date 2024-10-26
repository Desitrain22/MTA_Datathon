import config from "@/../tailwind.config";
import { Marker } from "@adamscybot/react-leaflet-component-marker";
import { LinearGradient } from "@visx/gradient";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { Arc } from "@visx/shape";
import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import { stationToColor } from "./color-helpers";

const { colors } = config.theme.extend;

type DataElem = {
	"avg-exits": number;
	"avg-entries": number;
	exits: number;
	entries: number;
};

interface ConcentricChartProps {
	title: string;
	width: number;
	height: number;
	data: DataElem;
	maxValue: number;
	className?: string;
}

const GRADIENTS = [
	{ id: "avg-exits", from: colors["tint-pink"], to: colors["tint-orange"] },
	{ id: "avg-entries", from: colors["tint-yellow"], to: colors["tint-green"] },
	{ id: "exits", from: colors.pink, to: colors.orange },
	{ id: "entries", from: colors.yellow, to: colors.green },
] as const;

const LABELS = {
	"avg-exits": "Average Exits",
	"avg-entries": "Average Entries",
	exits: "Exits",
	entries: "Entries",
} as const;

const SCALE_FACTOR = 0.98 as const;
const STROKE_WIDTH = 1 as const;

const ConcentricChart = ({
	title,
	width,
	height,
	maxValue,
	data,
	className,
}: ConcentricChartProps) => {
	const widthScale = scaleLinear({
		domain: [0, maxValue],
		range: [0, width / 2],
	});
	return (
		<svg width={width} height={height} className={className}>
			<title>{title}</title>
			{GRADIENTS.map(({ id, from, to }) => (
				<LinearGradient
					key={id}
					id={id}
					from={from}
					fromOffset="60%"
					to={to}
					vertical={true}
				/>
			))}
			<Group top={height} left={width / 2}>
				<g transform={`scale(${SCALE_FACTOR})`}>
					{Object.entries(data)
						.sort(
							([keyA], [keyB]) =>
								data[keyB as keyof typeof data] -
								data[keyA as keyof typeof data],
						)
						.map(([key, value]) => {
							const radius = widthScale(value);
							return (
								<Arc
									key={key}
									innerRadius={0}
									outerRadius={radius}
									startAngle={-Math.PI / 2}
									endAngle={Math.PI / 2}
									fill={`url(#${GRADIENTS.find((g) => g.id === key)?.id})`}
									stroke={colors.black}
									strokeWidth={STROKE_WIDTH}
									transform={"scale(1, 1.5)"}
								/>
							);
						})}
				</g>
			</Group>
		</svg>
	);
};

const ConcentricChartMarker = ({
	title,
	width,
	height = 0,
	data,
	maxValue,
	position,
	stations,
}: ConcentricChartProps & {
	position: [number, number];
	stations: string[];
}) => {
	const [open, setOpen] = useState(false);
	const map = useMap();

	const maxEllipseHeight = (width / 2) * 1.5;
	const svgHeight = Math.max(height, maxEllipseHeight);

	return (
		<Marker
			position={position}
			icon={
				<button
					onClick={(e) => {
						e.preventDefault();
						setOpen(!open);
						map.setView([position[0], position[1] + 0.015], 14);
					}}
				>
					<ConcentricChart
						className="absolute bottom-0 left-[50%] translate-x-[-50%] hover:z-[9999]"
						title={title}
						width={width}
						height={svgHeight}
						data={data}
						maxValue={maxValue}
					/>
					{open && (
						<div className="absolute bottom-0 left-0 w-fit rounded-t-xl border border-2 border-black bg-white/60 backdrop-blur-sm p-4 px-8 text-black">
							<h2 className="z-50 text-nowrap text-left font-extrabold text-xl">
								{title}
							</h2>
							<div className="flex flex-row gap-1">
								{stations.map((station) => (
									<span
										style={{
											backgroundColor: stationToColor(station),
										}}
										className="flex size-4 items-center justify-center rounded-full p-0 text-center align-center text-white text-xs"
									>
										{station.slice(0, 1)}
									</span>
								))}
							</div>
							<div className="flex flex-row gap-2">
								<ConcentricChart
									title={title}
									width={225}
									height={180}
									data={data}
									maxValue={Object.values(data).reduce((a, b) =>
										Math.max(a, b),
									)}
								/>
								<ul className="flex-col gap-2 align-start font-semibold text-black">
									{Object.entries(data)
										.sort((a, b) => b[1] - a[1])
										.map(([key, value]) => (
											<li key={key} className="text-nowrap text-left">
												<span className="mr-2 text-black text-lg">{value}</span>
												{LABELS[key as keyof typeof LABELS]}
											</li>
										))}
								</ul>
							</div>
						</div>
					)}
				</button>
			}
		/>
	);
};

const ExampleChartVisx = ({
	title,
	position,
	stations,
}: { title: string; position: [number, number]; stations: string[] }) => {
	// Generate some random data
	const data = {
		"avg-exits": Math.floor(Math.random() * 100),
		"avg-entries": Math.floor(Math.random() * 100),
		exits: Math.floor(Math.random() * 100),
		entries: Math.floor(Math.random() * 100),
	};
	console.log(stations);

	return (
		<ConcentricChartMarker
			title={title}
			stations={stations}
			maxValue={100}
			width={60}
			height={45}
			data={data}
			position={position}
		/>
	);
};

export default ExampleChartVisx;
