import { useEffect, useState } from "react";
import { getDataFromStorage } from "./App"
import { Link } from "react-router";
import { anchor, TWO_WEEKS_MS } from "./utils";
import HistoryPeriod from "./components/HistoryPeriod";

export default function History() {

    const [data, setData] = useState(getDataFromStorage());

    useEffect(() => {
        localStorage.setItem("data", JSON.stringify(data));
        console.log("new earliest:", data.earliest)
        console.log("new latest:", data.latest)
    }, [data])

    const handleDelete = (id: string) => {
        const deletedItem = data.history.find(shift => shift.id == id);
        if (deletedItem === undefined) return;

        setData(d => ({ ...d, history: d.history.filter(i => i.id !== id) }));

        if (!data.earliest || !data.latest) return;

        if (data.history.length == 1) {
            setData(d => ({ ...d, earliest: null, latest: null }));
            return;
        }

        const deletedDate = new Date(deletedItem.date);
        const earliestDate = new Date(data.earliest);
        const latestDate = new Date(data.latest);

        if (deletedDate <= earliestDate) {
            let newEarliest = new Date("2100-01-01");

            for (let i = 0; i < data.history.length; i++) {
                let current = new Date(data.history[i].date)

                if (current < newEarliest && data.history[i].id !== id) {
                    newEarliest = current;
                }
            }
            setData(d => ({ ...d, earliest: newEarliest }))
        }

        if (deletedDate >= latestDate) {
            let newLatest = new Date("2000-01-01");

            for (let i = 1; i < data.history.length; i++) {
                let current = new Date(data.history[i].date) 

                if (current > newLatest && data.history[i].id !== id) {
                    newLatest = current;
                }
            }
            setData(d => ({ ...d, latest: newLatest }))
        }
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