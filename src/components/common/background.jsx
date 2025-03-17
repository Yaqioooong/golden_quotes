export default function Background() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* Irregular gradient shapes */}
            <div className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] rotate-12 bg-gradient-to-br from-white via-amber-300/40 to-white blur-[100px] opacity-70"></div>
            <div className="absolute -bottom-1/4 -right-1/4 w-[150%] h-[150%] -rotate-12 bg-gradient-to-tl from-white via-amber-300/40 to-white blur-[100px] opacity-70"></div>
            {/* Center glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vh] h-[120vh] bg-gradient-radial from-amber-100/50 via-amber-50/30 to-transparent blur-[60px]"></div>
            {/* Edge fade overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white opacity-80"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white opacity-80"></div>
        </div>
    )
}