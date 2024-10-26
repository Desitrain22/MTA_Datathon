import rawStations from "@/assets/stations.json";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ChevronDown, Search, Sun } from "lucide-react";

type Station = (typeof rawStations)[0];

const ALL_UNIQUE_LINES = [
	...new Set<string>(
		rawStations.flatMap((station) =>
			new String(station["Daytime Routes"]).split(" "),
		),
	),
];

interface FilterWindowProps {
	stations: Station[];
}

export default function FilterWindow({ stations = [] }: FilterWindowProps) {
	return (
		<Card className="w-[300px] space-y-1 rounded-xl border border-2 border-black bg-light-grey/75 backdrop-blur-sm p-4 text-black">
			<div className="">
				<label className="font-medium font-semibold text-lg">Time</label>
				<div className="flex items-center space-x-1">
					<Sun className="h-5 w-5" />
					<Button variant="outline" className="w-full justify-between">
						3 - 7 PM
						<ChevronDown className="h-4 w-4 opacity-50" />
					</Button>
				</div>
			</div>
			<div className="">
				<label className="font-medium font-semibold text-lg">Line</label>
				<Select>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="A Line" />
					</SelectTrigger>
					<SelectContent>
						{ALL_UNIQUE_LINES.map((line) => {
							return (
								<SelectItem key={line} value={line}>
									{line} Line
								</SelectItem>
							);
						})}
					</SelectContent>
				</Select>
			</div>
			<div className="">
				<label className="font-medium font-semibold text-lg">Borough</label>
				<Select>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Manhattan" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="manhattan">Manhattan</SelectItem>
						<SelectItem value="brooklyn">Brooklyn</SelectItem>
						<SelectItem value="queens">Queens</SelectItem>
						<SelectItem value="bronx">Bronx</SelectItem>
						<SelectItem value="staten-island">Staten Island</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div className="">
				<label className="font-medium font-semibold text-lg">
					Station Lookup
				</label>
				<div className="relative">
					<Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
					<Input placeholder="Search stations" className="pl-8" />
				</div>
			</div>
			<div className="">
				<label className="font-medium font-semibold text-lg">Stations</label>
				<div className="max-h-[150px] overflow-auto rounded-md border border-input bg-background p-2">
					{stations.map((station, index) => (
						<div key={index} className="flex items-center space-x-2">
							<div className="h-2 w-2 rounded-full bg-[#4a3728]" />
							<span className="font-semibold text-lg">
								{station["Stop Name"]}
							</span>
						</div>
					))}
				</div>
			</div>
		</Card>
	);
}
