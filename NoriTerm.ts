interface INoriTheme {
  foreground: string,
  background: string,
  cursor: string,
  palette: string[]
}

class NoriTerm {
  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public clear(): void {
    this.context.fillStyle = this.colorBackground;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public clearLine(): void {
    this.clearRegion(0, this.cursorPosition[1], this.columns, 1);
    this.moveCursor(0, this.cursorPosition[1]);
  }

  public scroll(rows: number = 1): void {
    const [, charh] = this.getBlockSize();

    this.context.drawImage(this.canvas, 0, 0 - rows * charh);
    this.clearRegion(0, this.rows - rows, this.columns, rows);
    this.cursorPosition[1] = this.cursorPosition[1] - rows;
  }

  public put(char: string): void {
    if (char.length > 1) {
      char.split('').forEach(this.put.bind(this));
      return;
    }

    const [charw, charh] = this.getBlockSize();
    const [x, y] = this.cursorPosition;

    this.moveCursor(this.cursorPosition[0] + 1, this.cursorPosition[1]);

    this.context.font = this.getFont();
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillStyle = this.currentColor;
    this.context.fillText(char, x * charw + charw / 2, y * charh + charh / 2);

    if (this.cursorPosition[0] >= this.columns) {
      this.newLine();
    }
  }

  public remove(): void {
    this.moveCursor(this.cursorPosition[0] - 1, this.cursorPosition[1]);
  }

  public newLine(): void {
    if (this.cursorPosition[1] === this.rows - 1) {
      this.scroll();
    }

    this.moveCursor(0, this.cursorPosition[1] + 1);
  }

  public reset(): void {
    this.resetColor();
    this.clear();
    this.moveCursor(0, 0);
  }

  public resetColor(): void {
    this.currentColor = this.colorForeground;
    this.fontIsBold = false;
  }

  public setColor(index: number): void {
    this.currentColor = this.colorPalette[index - 1];
  }

  public isBold(): boolean {
    return this.fontIsBold;
  }

  public setBold(): void {
    this.fontIsBold = true;
  }

  public getBackgroundColor(): string {
    return this.colorBackground;
  }

  public getRows(): number {
    return this.rows;
  }

  public setRows(rows: number): void {
    this.rows = rows;

    this.repaint();
  }

  public getColumns(): number {
    return this.columns;
  }

  public setColumns(columns: number): void {
    this.columns = columns;

    this.repaint();
  }

  public setTheme(theme: INoriTheme): void {
    this.colorForeground = theme.foreground;
    this.colorBackground = theme.background;
    this.colorCursor = theme.cursor;
    this.colorPalette = theme.palette;

    this.reset();
  }

  public setFocus(hasFocus: boolean = true): void {
    this.cursorFocus = hasFocus;
    this.moveCursor();
  }

  public moveCursor(x: number = this.cursorPosition[0], y: number = this.cursorPosition[1]): void {
    const [charw, charh] = this.getBlockSize();

    this.clearRegion.apply(this, this.cursorPosition);

    this.cursorPosition = [x, y];

    this.context.fillStyle = this.colorCursor;

    this.context.fillRect(
      this.cursorPosition[0] * charw,
      this.cursorPosition[1] * charh,
      charw,
      charh
    );

    this.context.fill();

    if (!this.cursorFocus) {
      this.context.fillStyle = this.colorBackground;

      this.context.fillRect(
        (this.cursorPosition[0] * charw) + 1,
        (this.cursorPosition[1] * charh) + 1,
        charw - 2,
        charh - 2
      )
    }
  }

  public getCursor(): [number, number] {
    return this.cursorPosition;
  }

  public getFontSize(): number {
    return this.fontSize;
  }

  public setFontSize(size: number): void {
    this.fontSize = size;

    this.repaint();
  }

  public repaint(): void {
    const [charw, charh] = this.getBlockSize();

    this.canvas.width = this.columns * charw;
    this.canvas.height = this.rows * charh;

    this.reset();
  }

  constructor() {
    this.repaint();
  }

  private clearRegion(x: number, y: number, width: number = 1, height: number = 1): void {
    const [charw, charh] = this.getBlockSize();

    this.context.fillStyle = this.colorBackground;
    this.context.fillRect(
      x * charw,
      y * charh,
      width * charw,
      height * charh
    );
    this.context.fill();
  }

  private getBlockSize(): [number, number] {
    this.context.font = this.getFont(false);
    return [Math.ceil(this.context.measureText('W').width), Math.ceil(this.fontSize * this.fontLineHeight)];
  }

  private getFont(decorations: boolean = true): string {
    return `${decorations && this.fontIsBold ? 'bold ' : ''}${this.fontSize}pt ${this.fontFamily}`
  }

  private canvas: HTMLCanvasElement = document.createElement('canvas');
  private context: CanvasRenderingContext2D = this.canvas.getContext('2d')!;

  private columns: number = 90;
  private rows: number = 32;

  private cursorPosition: [number, number] = [0, 0];
  private cursorFocus: boolean = true;

  private colorBackground: string = '#0d2619';
  private colorForeground: string = '#d9e6f2';
  private colorCursor: string = '#d9e6f2';
  private colorPalette: string[] = ['#000000', '#b87a7a', '#7ab87a', '#b8b87a', '#7a7ab8', '#b87ab8', '#7ab8b8', '#d9d9d9', '#262626', '#dbbdbd', '#bddbbd', '#dbdbbd', '#bdbddb', '#dbbddb', '#bddbdb', '#ffffff']

  private currentColor: string = this.colorForeground;

  private fontSize: number = 12;
  private fontLineHeight: number = 1.45;
  private fontFamily: string = '"Noto Mono", "DejaVu Sans Mono", Monaco, Courier, monospace';
  private fontIsBold: boolean = false;
}
