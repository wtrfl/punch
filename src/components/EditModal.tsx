import { useState } from "react";
import type { Setter } from "../App";
import Icon from "./Icon";

interface Props { setTime: (hours: number, minutes: number) => void, setOpen: Setter<boolean>}

const renderStringWithColon = (str: string) => {
    return str.substring(0,2) + ":" + str.substring(2);
}

const EditModal: React.FC<Props> = ({ setTime, setOpen }) => {

    const [value, setValue] = useState("0000");

    const handleInput = (str: string) => {
        setValue(old => old.substring(1) + str);
    }

    const handleSubmit = () => {
        const hours = parseInt(value.substring(0,2));
        const minutes = parseInt(value.substring(2));
        if (
            hours > 23 ||
            hours < 0 ||
            minutes > 59 ||
            minutes < 0
        ) return;
        setTime(hours, minutes);
    }
    
    const handleCancel = () => {
        setValue("0000");
        setOpen(false);
    }

    return (
        <div className="absolute top-0 left-0 w-full h-full bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white w-[90%] flex flex-col border">
                <span className="text-6xl mt-12 text-center">{renderStringWithColon(value)}</span>
                <div className="grid grid-cols-3 m-8 gap-2">
                    {["1","2","3","4","5","6","7","8","9"].map(num => <button key={num} className="border py-6 text-" onClick={() => handleInput(num)}>{num}</button>)}
                    <button className="p-6 border flex justify-center items-center" onClick={handleCancel}><Icon type="x" /></button>
                    <button className="p-2 border" onClick={() => handleInput("0")}>0</button>
                    <button className="p-2 border bg-purple-400 flex justify-center items-center" onClick={handleSubmit}><Icon type="check" stroke="white" /></button>
                </div>
            </div>
        </div>
    )
}

export default EditModal;