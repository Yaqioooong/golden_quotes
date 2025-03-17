const Logo = ({ onClick }) => {
    return (
        <svg 
            className={"z-10 cursor-pointer"} 
            width="50" 
            height="40" 
            viewBox="0 0 50 40" 
            xmlns="http://www.w3.org/2000/svg"
            onClick={onClick}
        >
            <line x1="15" y1="10" x2="35" y2="10" className="stroke-amber-300" strokeWidth="7" strokeLinecap="round"/>
            <line x1="10" y1="20" x2="23" y2="20" className="stroke-amber-400" strokeWidth="7" strokeLinecap="round"/>
            <line x1="33" y1="20" x2="35" y2="20" className="stroke-amber-500" strokeWidth="7" strokeLinecap="round"/>
            <line x1="10" y1="30" x2="27" y2="30" className="stroke-amber-600" strokeWidth="7" strokeLinecap="round"/>
        </svg>
    );
};

export default Logo;