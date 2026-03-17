import './stylesheets/sortcanvas.css'
import { useEffect, useRef, useState } from 'react';
import { CanvasRenderer } from './CanvasRenderer';

function SortCanvas () {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rendererRef = useRef<CanvasRenderer | null>(null);
    const [arr, setArr] = useState([50, 30, 80, 10, 60]);

    useEffect(() => {
        if (!canvasRef.current) return;

        rendererRef.current = new CanvasRenderer(canvasRef.current);
    }, []);

    useEffect(() => {
        rendererRef.current?.drawArray(arr);
    }, [arr]);

    const randomize = () => {
        setArr(prev => prev.map(() => Math.floor(Math.random() * 100)));
    };

    return (
        <div>
            <canvas id="sort-canvas" ref={canvasRef}></canvas>
            <button onClick={randomize}>Randomize</button>
        </div>
    )
}

export default SortCanvas;