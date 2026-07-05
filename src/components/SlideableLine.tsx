import { useState } from "react";
import type { LoggedShift } from "../App";
import HistoryLine from "./HistoryLine";
import Icon from "./Icon";

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

export default SlideableLine;