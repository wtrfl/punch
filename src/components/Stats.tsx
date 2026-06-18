import { useMemo } from "react";
import type { Data } from "../App";


const getCurrentPayPeriodRange = () => {
    const today = new Date();
    today.setHours(0,0,0,0);

    const anchor = new Date("2026-06-19");
    anchor.setHours(0,0,0,0);

    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    const TWO_WEEKS_MS = ONE_DAY_MS * 14;

    const diffMs = today.getTime() - anchor.getTime();
    const remainderMs = ( ( diffMs % TWO_WEEKS_MS ) + TWO_WEEKS_MS ) % TWO_WEEKS_MS;

    const lastPayPeriodEnd = new Date(today.getTime() - remainderMs);
    const nextPayPeriodEnd = new Date(lastPayPeriodEnd.getTime() + TWO_WEEKS_MS);

    return {
        today: today,
        lastPayPeriodEnd: lastPayPeriodEnd,
        nextPayPeriodEnd: nextPayPeriodEnd
    }
}

const getAllShiftsInPayPeriod = (data: Data) => {
    const dates = getCurrentPayPeriodRange();

    return data.history.filter(shift => {
        const shiftMs = new Date(shift.date).getTime();
        const startTime = dates.lastPayPeriodEnd.getTime();
        const endTime = dates.nextPayPeriodEnd.getTime();
        return shiftMs > startTime && shiftMs <= endTime;
    })
}

const getTotalHours = (data: Data) => {
    const shifts = getAllShiftsInPayPeriod(data);
    return shifts.reduce((accumulator, currentValue) => accumulator+currentValue.hoursWorked, 0);
}

export default function Stats({ data }: { data: Data }) {

    const { hoursWorked, totalPay } = useMemo(() => {
        const hoursWorked = getTotalHours(data);
        const totalPay = hoursWorked * 17.97;

        return { hoursWorked: hoursWorked, totalPay: totalPay };
    }, [data])

    return (
        <div className="w-full flex flex-col">
            <span>Pay Period Hours Worked:</span>
            <span>{hoursWorked}</span>
            <span>Est. Pay Check:</span>
            <span>${Math.floor(totalPay)}</span>
        </div>
    )
}