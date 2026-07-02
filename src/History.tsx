import { useEffect, useState } from "react";
import { getDataFromStorage, type LoggedShift } from "./App"
import HistoryLine from "./components/HistoryLine";
import Icon from "./components/Icon";
import { Link } from "react-router";

interface SlideableProps {
    shift: LoggedShift,
    handleDelete: (id: string) => void
}

const SlideableLine: React.FC<SlideableProps> = ({ shift, handleDelete }) => {

    const [slid, setSlid] = useState(false);

    return (
        <div className="overflow-x-hidden relative">
            <div style={{ width: "100%", transform: slid ? "translateX(-100px)" : "none" }} onClick={() => setSlid(s => !s)}>
                <HistoryLine shift={shift} />
            </div>
            {slid && (
                <button onClick={() => handleDelete(shift.id)} className="absolute top-0 right-0 h-full bg-red-400 flex flex-col items-center justify-center border-b border-l" style={{ width: 100 }}>
                    <Icon type="trash" stroke="white" />
                    <span className="text-white">Delete</span>
                </button>
            )}
        </div>
    )
}

export default function History() {

    const [data, setData] = useState(getDataFromStorage());

    useEffect(() => {
        localStorage.setItem("data", JSON.stringify(data));
    }, [data])

    const handleDelete = (id: string) => {
        setData(d => ({ ...d, history: d.history.filter(i => i.id !== id) }))
    }

    return (
        <div className="w-full h-full m-0 flex flex-col px-5 py-4">
            <Link to="/"><span className="text-lg font-bold">PUNCH</span></Link>
            <div className="flex flex-col border border-b-2 mb-8 mt-8">
                {data.history.length > 0 && data.history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(shift => (
                    <SlideableLine shift={shift} handleDelete={handleDelete} key={shift.id} />
                ))}
            </div>
        </div>
    )
}