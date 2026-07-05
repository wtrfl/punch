import { formattedDate, type Data } from "../App";
import { getAllShiftsInPayPeriod } from "../utils";
import SlideableLine from "./SlideableLine";

interface Props {
    data: Data,
    handleDelete: (id: string) => void,
    referenceDate: Date
}

const HistoryPeriod: React.FC<Props> = ({ data, handleDelete, referenceDate }) => {

    const shifts = getAllShiftsInPayPeriod(data, referenceDate).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (shifts.length == 0) return (<></>);

    const hours = shifts.reduce((accumulator, currentValue) => accumulator+currentValue.hoursWorked, 0);
    const pay = hours*17.87;

    return (
        <div className="flex flex-col">
            <span className="text-xs font-mono">PAY PERIOD ENDING {formattedDate(referenceDate)}</span>
            <span className="text-xs font-mono">{hours} HOURS - ${Math.floor(pay)}</span>
            <div className="flex flex-col border border-b-2 mt-2">
                {shifts.map(shift => (
                    <SlideableLine shift={shift} handleDelete={handleDelete} key={shift.id} />
                ))}
            </div>
        </div>
    )
}

export default HistoryPeriod;