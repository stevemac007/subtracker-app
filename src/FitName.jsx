import { useRef, useEffect } from "react";

export default function FitName({ children }) {
    const outerRef = useRef(null);
    const innerRef = useRef(null);

    useEffect(() => {
        const outer = outerRef.current;
        const inner = innerRef.current;
        if (!outer || !inner) return;

        // Reset any previous scaling
        inner.style.transform = 'none';

        const containerW = outer.clientWidth;
        const textW = inner.scrollWidth;

        if (textW === 0 || containerW === 0) return;

        // Only scale down if text overflows
        if (textW > containerW) {
            inner.style.transform = `scaleX(${containerW / textW})`;
        }
    }, [children]);

    return (
        <div className="pname" ref={outerRef}>
            <span className="pname-fit" ref={innerRef}>{children}</span>
        </div>
    );
}
