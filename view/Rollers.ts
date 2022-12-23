import type { IRollers } from './typingForRollers';

class Rollers implements IRollers {
  private rollers: NodeList;
  private directionOfSlide: 'horizontal' | 'vertical';
  private descriptor: 0 | 1 = 0;
  private size: number;

  constructor(
    rollers: NodeList,
    directionOfSlide: 'horizontal' | 'vertical'
    ) {
    this.rollers = rollers;
    this.directionOfSlide = directionOfSlide;
    this.size = (<HTMLElement>this.rollers[0] ).offsetWidth;
  }

  determineDescriptor(roller: HTMLElement): void {
    if (roller === this.rollers[0]) {
      this.descriptor = 0;
    } else {
      this. descriptor = 1;
    }
  }

  setDescriptor(descriptor: 0 | 1): void {
    this.descriptor = descriptor;
  }

  slide(position: number, descriptor: 0 | 1): void {
    // переместим бегунок
    if (this.directionOfSlide === 'horizontal') {
      (<HTMLElement>this.rollers[descriptor]).style.left = `${ position }px`;
    } else {
      (<HTMLElement>this.rollers[descriptor]).style.top = `${ position }px`;
    }
  }

  getSize(): number {
    return this.size;
  }

  getDescriptor(): 0 | 1 {
    return this.descriptor;
  }

  getLastUpdatedPosition(): number {
    return this.getPosition(this.descriptor);
  }

  getPosition(descriptor: number): number {
    let roller: HTMLElement = <HTMLElement>this.rollers[descriptor];
    let position: number;

    if (this.directionOfSlide === 'horizontal') {
      position = +roller.style.left.replace('px', '');
    } else {
      position = +roller.style.top.replace('px', '');
    }

    return position;
  }
}

export default Rollers;