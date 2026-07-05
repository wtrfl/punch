import type { Data } from "./App";

export const getCurrentPayPeriodRange = () => {
    const today = new Date();
    today.setHours(0,0,0,0);

    const anchor = new Date("2026-06-19");
    anchor.setHours(0,0,0,0);

    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    const TWO_WEEKS_MS = ONE_DAY_MS * 14;

    const diffMs = today.getTime() - anchor.getTime();
    const remainderMs = ( ( diffMs % TWO_WEEKS_MS ) + TWO_WEEKS_MS ) % TWO_WEEKS_MS;

    const adjustedRemainder = remainderMs == 0 ? TWO_WEEKS_MS : remainderMs;

    const lastPayPeriodEnd = new Date(today.getTime() - adjustedRemainder);
    const nextPayPeriodEnd = new Date(lastPayPeriodEnd.getTime() + TWO_WEEKS_MS);

    return {
        today: today,
        lastPayPeriodEnd: lastPayPeriodEnd,
        nextPayPeriodEnd: nextPayPeriodEnd
    }
}

export const getAllShiftsInPayPeriod = (data: Data) => {
    const dates = getCurrentPayPeriodRange();

    return data.history.filter(shift => {
        const shiftMs = new Date(shift.date).getTime();
        const startTime = dates.lastPayPeriodEnd.getTime();
        const endTime = dates.nextPayPeriodEnd.getTime();
        return shiftMs > startTime && shiftMs <= endTime;
    })
}

export const getTotalHours = (data: Data) => {
    const shifts = getAllShiftsInPayPeriod(data);
    return shifts.reduce((accumulator, currentValue) => accumulator+currentValue.hoursWorked, 0);
}