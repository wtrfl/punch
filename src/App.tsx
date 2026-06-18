import { useEffect, useState } from "react";
import { Link } from "react-router";
import Stats from "./components/Stats";

export interface LoggedShift {
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

export default function App() {
    const [data,] = useState(getDataFromStorage());

    return (
        <div className="w-full h-full m-0 flex flex-col">
            <Stats data={data} />
            <hr />
            <span>Active Shift:</span>
            {data.active && <span>Clocked in at {dateToClockString(data.active)}</span>}
            {!data.active && <span>None</span>}
            <hr />
            <span>History:</span>
            {data.history.map(shift => <span>In: {shift.in} - Out: {shift.out} - Hours: {shift.hoursWorked}</span>)}
            <hr />
            <Link to="/punch"><button>Punch</button></Link>
        </div>
    )
}