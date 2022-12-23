import { IOutputs, outputSettings } from './typingForOutputs';

class Outputs implements IOutputs{
  private outputs: Node[];
  private settings: outputSettings;

  constructor(outputs: Node[], settings: outputSettings) {
    this.settings = settings;
    this.outputs = outputs;
  }

  updateOutputs(descriptor: 0 | 1, value: number): void {
    let output: HTMLElement = this.outputs[descriptor] as HTMLElement;
    output.innerText = `${value}${this.settings.prefix ? ' ' + this.settings.prefix : ''}`;

    if (this.settings.range) {
      output = (this.outputs[2] as HTMLElement).children[descriptor] as HTMLElement;
      output.innerText = `${value}${this.settings.prefix ? ' ' + this.settings.prefix : ''}`;
    }
  }

  rerenderOutputs(): void {
    if (this.settings.range) {
      let [outputFirst, outputSecond ] = this.outputs;
      let coordinatesOutputs: DOMRect[]= this.getElementsCoordinates(<HTMLElement>outputFirst, <HTMLElement>outputSecond);
      if (this.settings.type === 'horizontal') {
        if (coordinatesOutputs[0].right >= coordinatesOutputs[1].left) {
          this.showOutputCommon();
        } else {
          this.hiddeOutputCommon();
        }
      }

      if (this.settings.type === 'vertical') {
        if (coordinatesOutputs[1].bottom >= coordinatesOutputs[0].top) {
          this.showOutputCommon();
        } else {
          this.hiddeOutputCommon();
        }
      }
    } 
  }

  private showOutputCommon() {
    let [outputFirst, outputSecond, outputCommon ] = this.outputs;
    (<HTMLElement>outputCommon).classList.remove('slider__display_hidden');
    (<HTMLElement>outputFirst).classList.add('slider__display_hidden');
    (<HTMLElement>outputSecond).classList.add('slider__display_hidden');
  }

  private hiddeOutputCommon() {
    let [outputFirst, outputSecond, outputCommon ] = this.outputs;
    (<HTMLElement>outputCommon).classList.add('slider__display_hidden');
    (<HTMLElement>outputFirst).classList.remove('slider__display_hidden');
    (<HTMLElement>outputSecond).classList.remove('slider__display_hidden');
  }

  private getElementsCoordinates(...elements: HTMLElement []): DOMRect[] {
    return elements.map(el => el.getBoundingClientRect());
  }
}

export { Outputs, IOutputs };