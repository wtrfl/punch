import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router";
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

    const [data, setData] = useState(getDataFromStorage());

    const [hours, setHours] = useState(new Date().getHours());
    const [minutes, setMinutes] = useState(new Date().getMinutes());

    const [editModalOpen, setEditModalOpen] = useState(false);

    const today = new Date().toISOString().split("T")[0];
    const [date, setDate] = useState<string>(data.active ? data.active.toISOString().split("T")[0] : today);

    useEffect(() => {
        localStorage.setItem("data", JSON.stringify(data));
    }, [data])

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
        const punchTime = new Date(date + "T00:00:00");
        punchTime.setHours(hours, minutes, 0, 0);

        console.log(punchTime.toISOString());

        if (data.active) { // punch out
            if (punchTime < data.active) return;

            const dateOfShift = new Date(date + "T00:00:00");

            console.log(dateOfShift.toISOString());

            const newItem = { 
                id: crypto.randomUUID(),
                date: dateOfShift,
                in: dateToClockString(data.active), 
                out: dateToClockString(punchTime), 
                hoursWorked: calculateHours(data.active, punchTime)
            }

            setData(d => ({ ...d, active: null, history: [ newItem, ...d.history ] }))

            if (data.earliest == null || dateOfShift < new Date(data.earliest)) {
                setData(d => ({ ...d, earliest: dateOfShift }))
            }

            if (data.latest == null || dateOfShift > new Date(data.latest)) {
                setData(d => ({ ...d, latest: dateOfShift }))
            }

        } else { // punch in
            setData(d => ({ ...d, active: punchTime }));
        }

        navigate("/");
    }

    return (
        <div className="relative w-full h-full m-0 flex flex-col justify-between px-5 py-4">
            {editModalOpen && <EditModal setTime={setTime} setOpen={setEditModalOpen} />}
            <Link to="/"><span className="text-lg font-bold">PUNCH</span></Link>
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