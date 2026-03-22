import './stylesheets/sortcanvas.css'
import { useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { CanvasRenderer } from './CanvasRenderer';
import type { SortCanvasProps } from '../utils/types';

const SortCanvas = forwardRef((props: SortCanvasProps, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rendererRef = useRef<CanvasRenderer | null>(null);

    useImperativeHandle(ref, () => ({
        runSort(sortType: string) {
            rendererRef.current?.dispatchSort(sortType, props.numbers, props.percentUncovered);
        },
    }));

    useEffect(() => {
        if (!canvasRef.current) return;

        rendererRef.current = new CanvasRenderer(canvasRef.current);
    }, []);

    useEffect(() => {
        rendererRef.current?.drawArray(props.numbers);
        rendererRef.current?.drawCover(props.percentUncovered, "black");
    }, [props.numbers, props.percentUncovered]);

    return (
        <div>
            <canvas width={"1000px"} height={"500px"} id="sort-canvas" ref={canvasRef}></canvas>
        </div>
    )
});

export default SortCanvas;