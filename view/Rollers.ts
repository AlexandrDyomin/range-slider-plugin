interface IRollers {
  getRollers(): NodeList;
  getPosition(descriptor: number): number;
  getDescriptor(): 0 | 1
  getLastUpdatedPosition(): number;
  setDescriptor(descriptor: 0 | 1): void;
  getSize(): number;
  determineDescriptor(roller: HTMLElement): void;
  slide(position: number, descriptor: 0 | 1): void;
}


class Rollers implements IRollers {
  private rollers: NodeList; // бегунки
  private type: "horizontal" | "vertical"; // тип слайдера
  private descriptor: 0 | 1 = 0;
  private size: number;

  constructor(container: HTMLElement, type: "horizontal" | "vertical") {
    this.rollers = container.querySelectorAll(".slider__roller");
    this.type = type;
    this.size = (<HTMLElement>this.rollers[0] ).offsetWidth;
  }

  public getRollers(): NodeList {
    return this.rollers;
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

    if (this.type === "horizontal") {
      position = +roller.style.left.replace("px", "");
    } else {
      position = +roller.style.top.replace("px", "");
    }

    return position;
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
     if (this.type === "horizontal") {
      (<HTMLElement>this.rollers[descriptor]).style.left = `${ position }px`;
    } else {
      (<HTMLElement>this.rollers[descriptor]).style.top = `${ position }px`;
    }
  }
}


export type { IRollers };
export default Rollers;