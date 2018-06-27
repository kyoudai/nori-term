class ConsoleController {
  constructor(private termInstance: NoriTerm) {
    this.bindHandlers();
    this.showPrompt();
  }

  private runCommand() {
    if (this.command.length === 0) {
      return;
    }

    this.termInstance.newLine();

    try {
      const result = Function(`"use strict";return (${this.command})`)();

      switch (typeof result) {
        case "object":
          JSON.stringify(result, undefined, 2)
            .split(/\n/g)
            .forEach(line => {
              this.termInstance.put(line);
              this.termInstance.newLine();
            });
          break;
        case "number":
          this.termInstance.setColor(1);
          this.termInstance.put(result);
          this.termInstance.resetColor();
          break;
        case "string":
          this.termInstance.setColor(2);
          this.termInstance.put(result);
          this.termInstance.resetColor();
          break;
        default:
          this.termInstance.put(result);
      }

    } catch (error) {
      console.log(error);
      this.termInstance.put(error.message);
    }

    this.termInstance.newLine();
    this.termInstance.newLine();

    this.command = '';
    this.showPrompt();
  }

  private addCharacter(char: string): void {
    this.command += char;
    this.termInstance.put(char);
  }

  private removeCharacter(): void {
    if (this.command.length === 0) {
      return;
    }

    this.command = this.command.slice(0, -1);
    this.termInstance.remove();
  }

  private bindHandlers() {
    this.termInstance.getCanvas().tabIndex = -1;

    this.termInstance.getCanvas().addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        this.runCommand();
      } else if (event.key === 'Backspace') {
        this.removeCharacter();
      } else if (event.key.length === 1) {
        this.addCharacter(event.key);
      }

      event.preventDefault();
    });
  }

  private showPrompt() {
    this.termInstance.setBold();
    this.termInstance.put("nori//");
    this.termInstance.resetColor();
    this.termInstance.put(' ');
  }

  private command: string = '';
}