import './stylesheets/sortcanvas.css'
import { useEffect, useRef, useState } from 'react';
import { CanvasRenderer } from './CanvasRenderer';

function SortCanvas () {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rendererRef = useRef<CanvasRenderer | null>(null);
    const [arr, setArr] = useState([
        42, 17, 89, 23, 76, 5, 64, 31, 58, 12,
        95, 38, 71, 2, 84, 27, 49, 66, 14, 53,
        91, 7, 36, 80, 19, 62, 44, 28, 73, 10
    ]);

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

    const bubble = () => {
        rendererRef.current?.dispatchSort('BUBBLE', arr);
    }

    return (
        <div>
            <canvas id="sort-canvas" ref={canvasRef}></canvas>
            <button onClick={bubble}>Randomize</button>
        </div>
    )
}

export default SortCanvas;