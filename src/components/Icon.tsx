
const icons = {
    pencil: (
        <>
            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
            <path d="m15 5 4 4" />
        </>
    ),
    x: (
        <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>
    ),
    check: (
        <path d="M20 6 9 17l-5-5"/>
    ),
    plus: (
        <>
            <path d="M5 12h14"/><path d="M12 5v14"/>
        </>
    ),
    minus: (
        <path d="M5 12h14"/>
    ),
    trash: (
        <>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </>
    )
}

export default function Icon({ type, stroke = "black" }: { type: keyof typeof icons, stroke?: string }) {
    
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {icons[type]}
        </svg>
    )
}
