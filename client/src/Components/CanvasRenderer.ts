import { dispatch, type SortInstruction } from "./sorting";
import { sleep } from "../utils/utils";

export class CanvasRenderer {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error("Could not get 2D context");
        }
        this.ctx = ctx;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBar(xPos: number, width: number, value: number, colorFill: string, colorOutline: string) {
        this.ctx.fillStyle = colorFill;
        this.ctx.fillRect(xPos, this.canvas.height, width, -value);
        this.ctx.strokeStyle = colorOutline;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(xPos, this.canvas.height, width, -value);
    }

    drawArray(numbers: number[]) {
        this.clear();
        const fillColor = 'blue';
        const outlineColor = 'black';
        const numBars = numbers.length;
        const barWidth = this.canvas.width / numBars;
        let currentXPos = 0;
        numbers.forEach(element => {
            this.drawBar(currentXPos, barWidth, element, fillColor, outlineColor);
            currentXPos += barWidth;
        });
    }

    async dispatchSort(sortType: string, numbers: number[]) {
        const workingNumbers = [...numbers];
        const instructions = dispatch(sortType, workingNumbers);

        for (const instruction of instructions) {
            this.executeInstruction(instruction, workingNumbers);
            await sleep(50);
        }
    }

    executeInstruction(instruction: SortInstruction, numbers: number[]) {
        switch(instruction.action) {
            case 'SWAP':
                let temp = numbers[instruction.indexTo];
                numbers[instruction.indexTo] = numbers[instruction.indexFrom];
                numbers[instruction.indexFrom] = temp;
                break;
            default:
                throw new Error('Invalid instruction action!');
        }
        this.drawArray(numbers);
    }
}