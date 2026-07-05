import { useEffect, useState } from "react";
import { getDataFromStorage } from "./App"
import { Link } from "react-router";
import { anchor, TWO_WEEKS_MS } from "./utils";
import HistoryPeriod from "./components/HistoryPeriod";

export default function History() {

    const [data, setData] = useState(getDataFromStorage());

    useEffect(() => {
        localStorage.setItem("data", JSON.stringify(data));
    }, [data])

    const handleDelete = (id: string) => {
        setData(d => ({ ...d, history: d.history.filter(i => i.id !== id) }))
    }

    const periods = () => {
        if (data.earliest == null || data.latest == null) return;

        let currentDate: Date = new Date(anchor);
        while (currentDate > new Date(data.earliest)) {
            currentDate = new Date(currentDate.getTime() - TWO_WEEKS_MS);
        }

        let result: Date[] = [];
        while (currentDate < new Date(data.latest)) {
            result.push(currentDate);
            currentDate = new Date(currentDate.getTime() + TWO_WEEKS_MS);
        }
        result.push(new Date(currentDate.getTime()));
        
        return result;
    }

    return (
        <div className="w-full h-full m-0 flex flex-col px-5 py-4">
            <Link to="/"><span className="text-lg font-bold">PUNCH</span></Link>
            <div className="flex flex-col-reverse mb-8 mt-8 gap-6">
                {data.history.length > 0 && periods()?.map(period => (
                    <HistoryPeriod data={data} handleDelete={handleDelete} referenceDate={period} />
                ))}
                {data.history.length == 0 && (
                    <span className="text-center my-4 text-gray-500">No history.</span>
                )}
            </div>
        </div>
    )
}