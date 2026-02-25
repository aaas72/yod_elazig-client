interface DateBadgeProps {
    date: string;
    className?: string;
}

const DateBadge = ({ date, className = "" }: DateBadgeProps) => {
    let displayDate = date;
    try {
        const d = new Date(date);
        if (!isNaN(d.getTime())) {
            const day = String(d.getDate()).padStart(2, "0");
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const year = d.getFullYear();
            displayDate = `${day}-${month}-${year}`;
        }
    } catch {}
    return (
        <span
            className={`bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full shadow-lg ${className}`}
        >
            {displayDate}
        </span>
    );
};

export default DateBadge;
