class NoriTerm {
  public getCanvas(): HTMLCanvasElement {
    return this.canvas_;
  }

  public clear(): void {
    this.context_.fillStyle = this.colorBackground_;
    this.context_.fillRect(0, 0, this.canvas_.width, this.canvas_.height);
  }

  public clearLine(): void {
    this.clearRegion(0, this.cursorPosition_[1], this.columns_, 1);
    this.moveCursor(0, this.cursorPosition_[1]);
  }

  public put(char: string): void {
    const [charw, charh] = this.getBlockSize();
    const [x, y] = this.cursorPosition_;

    if (x + 1 >= this.columns_) {
      this.moveCursor(0, this.cursorPosition_[1] + 1);
    } else {
      this.moveCursor(this.cursorPosition_[0] + 1, this.cursorPosition_[1]);
    }

    this.context_.font = this.getFont();
    this.context_.textAlign = "center";
    this.context_.textBaseline = "middle";
    this.context_.fillStyle = this.currentColor_;
    this.context_.fillText(char, x * charw + charw / 2, y * charh + charh / 2);
  }

  public remove(): void {
    this.moveCursor(this.cursorPosition_[0] - 1, this.cursorPosition_[1]);
  }

  public newLine(): void {
    this.moveCursor(0, this.cursorPosition_[1] + 1);
  }

  public resetColor(): void {
    this.currentColor_ = this.colorForeground_;
    this.fontIsBold = false;
  }

  public setColor(index: number): void {
    this.currentColor_ = this.colorPalette_[index - 1];
  }

  public setBold(): void {
    this.fontIsBold = true;
  }

  public getBackgroundColor(): string {
    return this.colorBackground_;
  }

  public moveCursor(x: number, y: number): void {
    const [charw, charh] = this.getBlockSize();

    this.clearRegion.apply(this, this.cursorPosition_);

    this.cursorPosition_ = [x, y];

    this.context_.fillStyle = this.colorCursor_;
    this.context_.fillRect(
      this.cursorPosition_[0] * charw - 0.5,
      this.cursorPosition_[1] * charh - 0.5,
      charw,
      charh
    );
    this.context_.fill();
  }

  constructor() {
    this.context_.font = this.getFont();

    const [charw, charh] = this.getBlockSize();

    this.canvas_.width = this.columns_ * charw;
    this.canvas_.height = this.rows_ * charh;

    this.clear();
    this.moveCursor(0, 0);
  }

  private clearRegion(x: number, y: number, width: number = 1, height: number = 1): void {
    const [charw, charh] = this.getBlockSize();

    this.context_.fillStyle = this.colorBackground_;
    this.context_.fillRect(
      x * charw - 1,
      y * charh - 1,
      width * charw + 2,
      height * charh + 2
    );
    this.context_.fill();
  }

  private getBlockSize(): [number, number] {
    this.context_.font = this.getFont();
    return [this.context_.measureText('A').width, this.fontSize_ + Math.floor(this.fontSize_ * 0.45)];
  }

  private getFont(): string {
    return `${this.fontIsBold ? 'bold ' : ''}${this.fontSize_}pt ${this.fontFamily_}`
  }

  private canvas_: HTMLCanvasElement = document.createElement('canvas');
  private context_: CanvasRenderingContext2D = this.canvas_.getContext('2d')!;

  private columns_: number = 90;
  private rows_: number = 32;
  private cursorPosition_: [number, number] = [0, 0];

  private colorBackground_: string = '#0d2619';
  private colorForeground_: string = '#d9e6f2';
  private colorCursor_: string = '#d9e6f2';
  private colorPalette_: string[] = ['#000000', '#b87a7a', '#7ab87a', '#b8b87a', '#7a7ab8', '#b87ab8', '#7ab8b8', '#d9d9d9', '#262626', '#dbbdbd', '#bddbbd', '#dbdbbd', '#bdbddb', '#dbbddb', '#bddbdb', '#ffffff']

  private currentColor_: string = this.colorForeground_;

  private fontSize_: number = 12;
  private fontFamily_: string = 'Monaco, Courier, monospace';
  private fontIsBold: boolean = false;
}
