import { formattedDate, type LoggedShift } from "../App"


export default function HistoryLine({ shift }: { shift: LoggedShift }) {

    return (
        <div className="border-b flex justify-between items-center px-4 py-3">
            <div className="flex flex-col">
                <span className="font-semibold text-lg">{parseFloat(shift.hoursWorked.toFixed(1))} hours</span>
                <span className="text-sm">{shift.in} - {shift.out}</span>
            </div>
            <span>{formattedDate(new Date(shift.date))}</span>
        </div>
    )
}