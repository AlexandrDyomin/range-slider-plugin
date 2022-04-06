interface IRollers {
  slide(position: number, descriptor: 0 | 1): void;
  setDescriptor(descriptor: 0 | 1): void;
  determineDescriptor(roller: HTMLElement): void;
  getSize(): number;
  getDescriptor(): 0 | 1;
  getLastUpdatedPosition(): number;
  getPosition(descriptor: number): number;
}


class Rollers implements IRollers {
  private rollers: NodeList; // бегунки
  private directionOfSlide: "horizontal" | "vertical"; // тип слайдера
  private descriptor: 0 | 1 = 0;
  private size: number;

  constructor(
    rollers: NodeList,
    directionOfSlide: "horizontal" | "vertical"
    ) {
    this.rollers = rollers;
    this.directionOfSlide = directionOfSlide;
    this.size = (<HTMLElement>this.rollers[0] ).offsetWidth;
  }

  public determineDescriptor(roller: HTMLElement): void {
    if (roller === this.rollers[0]) {
      this.descriptor = 0;
    } else {
      this. descriptor = 1;
    }
  }

  public setDescriptor(descriptor: 0 | 1): void {
    this.descriptor = descriptor;
  }

  public slide(position: number, descriptor: 0 | 1): void {
    // переместим бегунок
    if (this.directionOfSlide === "horizontal") {
      (<HTMLElement>this.rollers[descriptor]).style.left = `${ position }px`;
    } else {
      (<HTMLElement>this.rollers[descriptor]).style.top = `${ position }px`;
    }
  }

  public getSize(): number {
    return this.size;
  }

  public getDescriptor(): 0 | 1 {
    return this.descriptor;
  }

  public getLastUpdatedPosition(): number {
    return this.getPosition(this.descriptor);
  }

  public getPosition(descriptor: number): number {
    let roller: HTMLElement = <HTMLElement>this.rollers[descriptor];
    let position: number;

    if (this.directionOfSlide === "horizontal") {
      position = +roller.style.left.replace("px", "");
    } else {
      position = +roller.style.top.replace("px", "");
    }

    return position;
  }

}


export type { IRollers };
export default Rollers;