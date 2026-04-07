import { useRef, useEffect } from "react";

const BASE_FONT = 11;
const MAX_FONT = 18;

export default function FitName({ children }) {
    const outerRef = useRef(null);
    const innerRef = useRef(null);

    useEffect(() => {
        const outer = outerRef.current;
        const inner = innerRef.current;
        if (!outer || !inner) return;

        inner.style.fontSize = `${BASE_FONT}px`;
        inner.style.transform = 'none';

        const containerW = outer.clientWidth;
        const textW = inner.scrollWidth;

        if (textW === 0 || containerW === 0) return;

        const scale = Math.min(containerW / textW, MAX_FONT / BASE_FONT);
        if (scale < 1) {
            inner.style.fontSize = `${BASE_FONT}px`;
            inner.style.transform = `scaleX(${scale})`;
        } else {
            inner.style.fontSize = `${Math.min(BASE_FONT * scale, MAX_FONT)}px`;
            inner.style.transform = 'none';
        }
    }, [children]);

    return (
        <div className="pname" ref={outerRef}>
            <span className="pname-fit" ref={innerRef}>{children}</span>
        </div>
    );
}
