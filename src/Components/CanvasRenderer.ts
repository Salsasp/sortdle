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
        this.ctx.fillRect(xPos, 0, width, value);
        this.ctx.strokeStyle = colorOutline;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(xPos, 0, width, value);
    }

    drawArray(numbers: number[]) {
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
}