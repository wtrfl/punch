import { useRef } from "react";
import type { Setter } from "../App";

interface Props {
    disabled: boolean,
    date: string,
    setDate: Setter<string>
}

const PunchDate: React.FC<Props> = ({ disabled, date, setDate }) => {

    const inputRef = useRef<HTMLInputElement>(null);

    const formatted = new Date(date + "T00:00:00").toLocaleDateString("en-US", {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
    })

    const isMobile = /iPhone|iPad|iPod|Android/.test(navigator.userAgent);

    if (disabled) return (
        <span className="text-xl mb-8">{formatted}</span>
    )

    return (
        <div className="relative inline-block mb-8">
            <span className="cursor-pointer text-xl" onClick={() => inputRef.current?.showPicker()}>
                {formatted}
            </span>

            <input
                type="date"
                ref={inputRef}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="absolute top-0 left-0 w-full h-full opacity-[0.01] inset-0"
                style={{ pointerEvents: isMobile ? "auto" : "none" }}
            />
        </div>
    )
}

export default PunchDate;