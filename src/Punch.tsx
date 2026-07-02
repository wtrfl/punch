import { useState } from "react"
import { useNavigate } from "react-router";
import { getDataFromStorage, dateToClockString } from "./App";
import Icon from "./components/Icon";
import PunchDate from "./components/PunchDate";
import EditModal from "./components/EditModal";

const calculateHours = (actualStart: Date, actualEnd: Date) => {
    const start = new Date(actualStart);
    const end =  new Date(actualEnd);

    start.setMinutes( start.getMinutes() - (start.getMinutes() % 6) );
    end.setMinutes( end.getMinutes() - (end.getMinutes() % 6) );

    const diff = end.valueOf() - start.valueOf();
    const mins = diff / 60000; // to minutes
    const hours = mins / 60;

    if (hours >= 6.5) return hours-0.5;

    return hours;
}

export default function Punch() {

    const navigate = useNavigate();

    const [data,] = useState(getDataFromStorage());

    const [hours, setHours] = useState(new Date().getHours());
    const [minutes, setMinutes] = useState(new Date().getMinutes());

    const [editModalOpen, setEditModalOpen] = useState(false);

    const today = new Date().toISOString().split("T")[0];
    const [date, setDate] = useState<string>(data.active ? data.active.toISOString().split("T")[0] : today);

    const setTime = (hours: number, minutes: number) => {
        setHours(hours);
        setMinutes(minutes);
        setEditModalOpen(false);
    }

    const handleIncrease = () => {
        if (hours == 23 && minutes == 59) return;

        const newMins = (minutes+1) % 60;
        setMinutes(newMins);
        if (newMins == 0) setHours(h => h+1);
    }

    const handleDecrease = () => {
        if (hours == 0 && minutes == 0) return;

        const newMins = (minutes-1+60) % 60;
        setMinutes(newMins);
        if (newMins == 59) setHours(h => h-1);
    }

    const handlePunch = () => {
        const target = new Date(date + "T00:00:00");
        target.setHours(hours, minutes, 0, 0);

        var newData;
        if (data.active) {
            if (target < data.active) return;

            newData = { 
                active: null, 
                history: [
                    { 
                        id: crypto.randomUUID(),
                        date: new Date(date + "T00:00:00"),
                        in: dateToClockString(data.active), 
                        out: dateToClockString(target), 
                        hoursWorked: calculateHours(data.active, target)
                    },
                    ...data.history
                ] 
            }
        } else {
            newData = { ...data, active: target }
        }

        localStorage.setItem('data', JSON.stringify(newData));
        navigate("/");
    }

    return (
        <div className="relative w-full h-full m-0 flex flex-col justify-between px-5 py-4">
            {editModalOpen && <EditModal setTime={setTime} setOpen={setEditModalOpen} />}
            <span className="text-lg font-bold">PUNCH</span>
            <div className="flex flex-col items-center gap-3">
                <PunchDate disabled={data.active ? true : false} date={date} setDate={setDate} />
                <span className="text-8xl">{hours<10 ? "0"+hours : hours}:{minutes<10 ? "0"+minutes : minutes}</span>
                <div className="flex gap-1">
                    <button className="border p-2" onClick={handleIncrease}><Icon type="plus" /></button>
                    <button className="border p-2" onClick={handleDecrease}><Icon type="minus" /></button>
                    <button className="border p-2" onClick={() => setEditModalOpen(true)}><Icon type="pencil" /></button>
                </div>
                <button onClick={handlePunch} className="border border-black border-b-4 w-full py-3.5 font-bold text-lg text-white bg-purple-400 mt-8 active:border-b-0 active:border-t-4 active:border-t-gray-700">Punch {data.active ? "Out" : "In"}</button>
            </div>
        </div>
    )
}