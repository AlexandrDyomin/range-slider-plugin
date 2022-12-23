interface IFillableRange {
  paint(startPos: number, endPos: number): void;
}

class FillableRange implements IFillableRange {
  private range: HTMLElement;
  private type: 'horizontal' | 'vertical';

  constructor(range: HTMLElement, type: 'horizontal' | 'vertical') {
    this.range = range;
    this.type = type;
  }

  paint(startPos: number, endPos: number): void {
    if (this.type === 'horizontal'){
      this.range.style.left = `${ startPos }px`;
      this.range.style.right = `${ endPos }px`;
    } else {
      this.range.style.bottom = `${ startPos }px`;
      this.range.style.top = `${ endPos }px`;
    }
  }
}

export { FillableRange, IFillableRange } ;