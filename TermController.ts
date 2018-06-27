class TermController {
  public read(char: string): void {
    if (this.inSequence) {
      this.accumulator = this.accumulator + char;
      
      if (this.match(this.accumulator)) {
        this.inSequence = false;
        this.accumulator = '';
        return;
      }
      
      return;
    } else if (char === TermController.TOKEN_NEW_LINE) {
      this.termInstance.newLine();
      return;
    } else if (char === TermController.TOKEN_ESCAPE) {
      this.inSequence = true;
      return;
    }

    this.termInstance.put(char);
    return;
  }

  public static TOKEN_ESCAPE: string = String.fromCharCode(27);
  public static TOKEN_NEW_LINE: string = String.fromCharCode(10);
  public static EXP_COLOR_FORMATTING: RegExp = /^\[(\d\d);(\d\d)m$/;
  public static EXP_COLOR: RegExp = /^\[(\d\d)m$/;

  constructor(private termInstance: NoriTerm) { }

  private match(escapeSequence): boolean {
    // clear screen (I think?)
    if (escapeSequence === 'c') {
      this.termInstance.clear();
      this.termInstance.moveCursor(0, 0);

      return true
    }

    // colour
    if (TermController.EXP_COLOR.test(escapeSequence)) {
      const [, foreground] = escapeSequence.match(TermController.EXP_COLOR);

      this.termInstance.setColor(this.getColorIndex(foreground));

      return true;
    }

    // colour + formatting
    if (TermController.EXP_COLOR_FORMATTING.test(escapeSequence)) {
      const [, attributes, foreground] = escapeSequence.match(TermController.EXP_COLOR_FORMATTING);

      if (attributes === '01') {
        this.termInstance.setBold();
      }

      this.termInstance.setColor(this.getColorIndex(foreground));

      return true;
    }

    // reset colour
    if (escapeSequence === '[0m' || escapeSequence === '[00m') {
      this.termInstance.resetColor();

      return true;
    }

    // bell?
    if (escapeSequence === ']0;') {
      return true;
    }

    return false;
  }

  private getColorIndex(color: string): number {
    const parsedColor = parseInt(color, 10);

    if (parsedColor >= 90) {
      return parsedColor - 90 + 8;
    }

    return parsedColor - 30;
  }

  private accumulator: string = '';
  private inSequence: boolean = false;
}