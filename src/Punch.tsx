import { useState } from "react"
import { useNavigate } from "react-router";
import { getDataFromStorage, dateToClockString } from "./App";

const calculateHours = (actualStart: Date, actualEnd: Date) => {
    const start = new Date(actualStart);
    const end =  new Date(actualEnd);

    start.setMinutes( start.getMinutes() - (start.getMinutes() % 6) );
    end.setMinutes( end.getMinutes() - (end.getMinutes() % 6) );

    const diff = end.valueOf() - start.valueOf();
    const mins = diff / 60000; // to minutes
    const hours = mins / 60;

    return hours;
}

export default function Punch() {

    const navigate = useNavigate();

    const [data,] = useState(getDataFromStorage());

    const [hours, setHours] = useState(new Date().getHours());
    const [minutes, setMinutes] = useState(new Date().getMinutes());

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
        const target = new Date();
        target.setHours(hours, minutes, 0, 0);

        const today = new Date();
        today.setHours(0,0,0,0);

        var newData;
        if (data.active) {
            if (target < data.active) return;

            newData = { 
                active: null, 
                history: [
                    { 
                        date: today,
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
        <div className="w-full h-full m-0 flex flex-col">
            <span>{hours<10 ? "0"+hours : hours}:{minutes<10 ? "0"+minutes : minutes}</span>
            <button onClick={handleIncrease}>+</button>
            <button onClick={handleDecrease}>-</button>
            <button onClick={handlePunch}>Punch {data.active ? "Out" : "In"}</button>
        </div>
    )
}