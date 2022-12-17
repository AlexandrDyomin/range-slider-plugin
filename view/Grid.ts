class Grid {
  private grid: HTMLElement;

  constructor(range: [number, number]) {
    let grid: HTMLElement = document.createElement("div");
    grid.className = "grid";
     
    let numberOfMarks: number = 21;
    for(let i = 0; i < numberOfMarks; i++) {
      let mark: HTMLElement = document.createElement("span");
      mark.className = "grid__mark";
      grid.append(mark);
    }

    let step: number = (range[1] - range[0]) * 0.25;
    let value: number = range[0];
    let marks: HTMLCollection = grid.children;
    for(let i = 0; i < numberOfMarks; i += 5) {
      let valueOfMark: HTMLElement = document.createElement("span");
      valueOfMark.textContent = `${value}`;
      valueOfMark.className = "grid__text";
      marks[i].append(valueOfMark);
      value += step;
    }

    this.grid = grid;
  }

  public getGridTemplate(): HTMLElement {
    return this.grid;
  }
}

export default Grid;