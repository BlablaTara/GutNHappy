export function getWeek(date) {
    const weekDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNumber = weekDate.getUTCDay() || 7;
    weekDate.setUTCDate(weekDate.getUTCDate() + 4 - dayNumber);

    const yearStart = new Date(Date.UTC(weekDate.getUTCFullYear(), 0, 1));
    const weekNumber = Math.ceil((((weekDate - yearStart) / 86400000) + 1) / 7);
    return `${weekDate.getUTCFullYear()}-${String(weekNumber).padStart(2, "0")}`;
}

export function getLastNumberOfWeeks (num = 10) {
    const weeks = [];
    const today = new Date();

    for (let i = num - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i * 7);
        
        const weekString = getWeek(date);
        weeks.push(weekString);
    }
    return weeks;
}


