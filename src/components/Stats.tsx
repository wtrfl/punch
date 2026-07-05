import { useMemo } from "react";
import type { Data } from "../App";
import { getTotalHours } from "../utils";

export default function Stats({ data }: { data: Data }) {

    const { hoursWorked, totalPay } = useMemo(() => {
        const hoursWorked = getTotalHours(data, new Date());
        const totalPay = hoursWorked * 17.87;

        return { hoursWorked: hoursWorked, totalPay: totalPay };
    }, [data])

    return (
        <div className="mt-30 mb-20 flex flex-col">
            <span className="mb-1">Hours</span>
            <span className="mb-4 text-3xl">{parseFloat(hoursWorked.toFixed(1))}</span>
            <span className="mb-1">Est. Pay</span>
            <span className="text-3xl">${Math.floor(totalPay)}</span>
        </div>
    )
}