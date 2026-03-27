import { getSortInstructions } from "./Sorting";
import { type SortInstruction } from "../utils/types";
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
        if (!numbers) return;
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

    singleRender(numbers: number[], percentUncovered: number, colorFill: string) {
        this.drawArray(numbers);
        this.drawCover(percentUncovered, colorFill);
    }

    drawCover(percentUncovered: number, colorFill: string) {
        if (percentUncovered > 100 || percentUncovered < 0) {
            throw new Error("Invalid percentage");
        }
        const uncoveredWidth = this.canvas.width * (percentUncovered/100);
        this.ctx.fillStyle = colorFill;
        this.ctx.strokeStyle = colorFill;
        this.ctx.fillRect(uncoveredWidth, this.canvas.height, this.canvas.width-uncoveredWidth, -this.canvas.height)
    }

    async dispatchSort(sortType: string, numbers: number[], percentUncovered: number) {
        const workingNumbers = [...numbers];
        const instructions = getSortInstructions(sortType, workingNumbers);

        for (const instruction of instructions) {
            this.executeInstruction(instruction, workingNumbers, percentUncovered);
            await sleep(25);
        }
    }

    executeInstruction(instruction: SortInstruction, numbers: number[], percentUncovered: number) {
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
        this.drawCover(percentUncovered, "black");
    }
}