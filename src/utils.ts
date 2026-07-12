import type { Data } from "./App";

export const anchor = new Date("2026-06-19");
anchor.setHours(0,0,0,0);

export const ONE_DAY_MS = 24 * 60 * 60 * 1000;
export const TWO_WEEKS_MS = ONE_DAY_MS * 14;

export const getPayPeriodRange = (reference: Date) => {
    const referenceDate = new Date(reference);
    referenceDate.setHours(0,0,0,0);

    const diffMs = referenceDate.getTime() - anchor.getTime();
    const remainderMs = ( ( diffMs % TWO_WEEKS_MS ) + TWO_WEEKS_MS ) % TWO_WEEKS_MS;

    const adjustedRemainder = remainderMs == 0 ? TWO_WEEKS_MS : remainderMs;

    const lastPayPeriodEnd = new Date(referenceDate.getTime() - adjustedRemainder);
    const nextPayPeriodEnd = new Date(lastPayPeriodEnd.getTime() + TWO_WEEKS_MS);

    return {
        today: referenceDate,
        lastPayPeriodEnd: lastPayPeriodEnd,
        nextPayPeriodEnd: nextPayPeriodEnd
    }
}

export const getAllShiftsInPayPeriod = (data: Data, reference: Date) => {
    const dates = getPayPeriodRange(reference);

    return data.history.filter(shift => {
        const shiftMs = new Date(shift.date).getTime();
        const startTime = dates.lastPayPeriodEnd.getTime();
        const endTime = dates.nextPayPeriodEnd.getTime();
        return shiftMs > startTime && shiftMs <= endTime;
    })
}

export const getTotalHours = (data: Data, reference: Date) => {
    const shifts = getAllShiftsInPayPeriod(data, reference);
    return shifts.reduce((accumulator, currentValue) => accumulator+currentValue.hoursWorked, 0);
}