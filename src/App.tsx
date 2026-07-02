import { useState } from "react";
import { Link } from "react-router";
import Stats from "./components/Stats";
import HistoryLine from "./components/HistoryLine";
import Hero from "./components/Hero";

export type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

export interface LoggedShift {
    id: string,
    date: Date,
    in: string,
    out: string,
    hoursWorked: number
}

export interface Data {
    active: Date | null,
    history: LoggedShift[]
}

export const getDataFromStorage: () => Data = () => {
    const stored = localStorage.getItem('data');
    
    if (!stored) return { active: null, history: [] }

    const parsed = JSON.parse(stored);
    
    if (parsed.active) return { ...parsed, active: new Date(parsed.active) }
    return parsed;
}

export const dateToClockString = (d: Date) => {
    const hours = d.getHours();
    const minutes = d.getMinutes()
    return hours +":"+ ( minutes<10 ? "0"+minutes : minutes );
}

export const formattedDate = (d: Date) => {
    return (d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear();
}

export default function App() {
    const [data,] = useState(getDataFromStorage());

    return (
        <div className="relative w-full h-full m-0 flex flex-col px-5 py-4">
            <Hero />

            <span className="text-lg font-bold">PUNCH</span>

            <Stats data={data} />

            <div className="w-full border border-b-3 flex flex-col">
                <div className="px-4 py-3 flex flex-col">
                    <span>Active Shift</span>
                    {data.active && <span className="text-lg font-semibold">In at {dateToClockString(data.active)}</span>}
                    {!data.active && <span className="text-lg font-semibold">None</span>}
                </div>
                <Link to="/punch"><button className="border-t px-3 py-3 w-full">Punch</button></Link>
            </div>
            
            <span className="mt-6 mb-3">History:</span>
            <div className="flex flex-col border border-b-2 mb-8">
                {data.history.length > 0 && data.history.slice(0,3).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(shift => (
                    <HistoryLine key={shift.id} shift={shift} />
                ))}
                {data.history.length > 0 && (
                    <Link to="/history"><button className="w-full text-center my-4">View All History</button></Link>
                )}
                {data.history.length == 0 && (
                    <span className="text-center my-4 text-gray-500">No history.</span>
                )}
            </div>

        </div>
    )
}