import type { sliderSettings } from "../Slider";
import FormElements, { IFormElements } from "./FormElements";
import Rollers, { IRollers } from "./Rollers";
import Scale, { IScale } from "./Scale";
import Template, { ITemplate } from "./Template";


interface ISliderView {
  update(
    value: number | PointerEvent,
    descriptor?: 0 | 1
  ): {value: number, descriptor: 0 | 1} | null;
  getRollers(): NodeList;
  getSlider(): HTMLElement;
  getSettings(): sliderSettings;
  takeRoller(roller: HTMLElement | PointerEvent): void;
  throwRoller(roller: HTMLElement): void;
  getScale(): HTMLElement;
  getRange(): HTMLElement;
  getInputs(): NodeList;
  getOutputs(): Node [];
}


class SliderView implements ISliderView {
  private scale: IScale;
  private minLimit: number; // минимально допустимое смещение бегунка,px
  private maxLimit: number; // максимально допустимое смещение бегунка, px
  private rollers: IRollers;
  private template: ITemplate;
  private inputs: IFormElements;
  private settings: sliderSettings;

  constructor(container: HTMLElement, settings: sliderSettings) {
    this.settings = settings;
    this.template = new Template(container, settings);
    this.inputs = new FormElements(this.getInputs() );
    this.rollers = new Rollers(this.getRollers(), settings.type);
    this.scale = new Scale(
      this.getScale(),
      this.getRange(),
      this.rollers.getSize(),
      settings
    );
    this.minLimit = 0;
    this.maxLimit = this.scale.getScaleSize();

    // добавим объекту window обработчик на событие resize
    this.handleDocumentResize = this.handleDocumentResize.bind(this);
    window.addEventListener("resize", this.handleDocumentResize);

    // обновим положение бегунков в соответствие с переданными настройками
    this.settings.values.forEach( (value, i) => this.update(value, <0 | 1>i) );
  }

  public getOutputs(): Node[] {
    return this.template.getOutputs();
  }

  public getInputs(): NodeList {
    return this.template.getInputs();
  }

  public update(
    value: number | PointerEvent,
    descriptor?: 0 | 1
  ): { value: number, descriptor: 0 | 1 } | null {
    // вычислим смещение бегунка относительно шкалы
    let position: number = this.calcPosition(value);

    // вычислим значение ролика и его номер
    if (position !== this.rollers.getLastUpdatedPosition() ||
        this.getSettings().values[0] === this.getSettings().values[1]
       ) {
      let inputValue: number;

      if (typeof value === "number" && descriptor !== undefined) {
        // переместим бегунок
        this.rollers.slide(position, descriptor);
        inputValue = value;
      } else {
        inputValue = this.scale.calcValue(position);
        descriptor = this.rollers.getDescriptor();
      }

      // переместим бегунок
      this.rollers.slide(position, descriptor);

      // обновим значение инпута
      this.inputs.update(inputValue.toString(), descriptor);

      // закрасим диапазон
      let { startPos, endPos } = this.calcStartEndPositionsOfRange();
      this.scale.paint(startPos, endPos);

      this.updateOutputs(descriptor);

      if (this.getSettings().range) {
        let [outputFirst, outputSecond ] = this.getOutputs();
        let coordinatesOutputs: DOMRect[]= this.getElementsCoordinates(<HTMLElement>outputFirst, <HTMLElement>outputSecond);
        if (this.getSettings().type === "horizontal") {
          if (coordinatesOutputs[0].right >= coordinatesOutputs[1].left) {
           this.showOutputCommon();
          } else {
           this.hiddeOutputCommon();
          }
        }

        if (this.getSettings().type === "vertical") {
          if (coordinatesOutputs[1].bottom >= coordinatesOutputs[0].top) {
           this.showOutputCommon();
          } else {
           this.hiddeOutputCommon();
          }
        }
      }

      return {
        value: inputValue,
        descriptor: descriptor
      };
    } else {
      if (descriptor !== undefined) {
        this.updateOutputs(descriptor);
      }

      return null;
    }
  }

  public takeRoller(roller: HTMLElement | PointerEvent): void {
    if (roller instanceof HTMLElement) {
      this.rollers.determineDescriptor(roller);
      
      if (this.getSettings().range) {
        roller.style.zIndex = "1";
        
        if (this.rollers.getDescriptor() === 0)
        (<HTMLElement>this.getRollers()[1]).style.zIndex = "auto";
      } else {
        (<HTMLElement>this.getRollers()[0]).style.zIndex = "auto";
      }

      // вычислим максимально и минимально допустимые смещения для ролика
      if (this.settings.range) {
        this.calcLimits(roller);
      }

      return;
    }

    if (!this.settings.range) return;

    let posFirstRoller: number = this.rollers.getPosition(0);
    let posSecondRolller = this.rollers.getPosition(1);
    let posCursor: number;

    if (this.settings.type === "horizontal") {
      posCursor = roller.clientX - this.scale.getScaleOffset();
    } else {
      posCursor = roller.clientY - this.scale.getScaleOffset();
    }

    let isNearestFirstRoller: boolean =
      Math.abs(posCursor - posFirstRoller) < Math.abs(posCursor - posSecondRolller);

    if (isNearestFirstRoller){
      this.rollers.setDescriptor(0);
    } else {
      this.rollers.setDescriptor(1);
    }

    let descriptor = this.rollers.getDescriptor();
    this.calcLimits(this.template.getRollers()[descriptor] as HTMLElement);
  }

  public throwRoller(roller: HTMLElement): void {

  }

  public getRollers(): NodeList {
    return this.template.getRollers();
  }

  public getSlider(): HTMLElement {
    return this.template.getSlider();
  }

  public getScale(): HTMLElement {
    return this.template.getScale();
  }

  public getRange(): HTMLElement {
    return this.template.getRange();
  }

  public getSettings(): sliderSettings {
    return this.settings;
  }

  private updateOutputs(descriptor: 0 | 1) {
    let output: HTMLElement = this.getOutputs()[descriptor] as HTMLElement;
    let input: HTMLInputElement = this.getInputs()[descriptor] as HTMLInputElement;
    output.innerText = input.value;
    if (this.getSettings().range) {
      output = (this.getOutputs()[2] as HTMLElement).children[descriptor] as HTMLElement;
      output.innerText = input.value;
    }
  }

  private showOutputCommon() {
    let [outputFirst, outputSecond, outputCommon ] = this.getOutputs();
    (<HTMLElement>outputCommon).classList.remove("slider__display_hidden");
    (<HTMLElement>outputFirst).classList.add("slider__display_hidden");
    (<HTMLElement>outputSecond).classList.add("slider__display_hidden");
  }

  private hiddeOutputCommon() {
    let [outputFirst, outputSecond, outputCommon ] = this.getOutputs();
    (<HTMLElement>outputCommon).classList.add("slider__display_hidden");
    (<HTMLElement>outputFirst).classList.remove("slider__display_hidden");
    (<HTMLElement>outputSecond).classList.remove("slider__display_hidden");
  }

  private getElementsCoordinates(...elements: HTMLElement []): DOMRect[] {
    return elements.map(el => el.getBoundingClientRect());
  }

  // вычисляет максимально и минимально допустимые смещения ролика
  private calcLimits(roller: HTMLElement): void {
    if (this.settings.type === "horizontal") {
      if (roller === this.template.getRollers()[0]) {
        this.minLimit = 0;
        this.maxLimit= this.rollers.getPosition(1);
      }

      if (roller === this.template.getRollers()[1]) {
        this.minLimit = this.rollers.getPosition(0);
        this.maxLimit = this.scale.getScaleSize();
      }
    } else {
      if (roller === this.template.getRollers()[0]) {
        this.minLimit =this.rollers.getPosition(1);
        this.maxLimit = this.scale.getScaleSize();
      }

      if (roller === this.template.getRollers()[1]) {
        this.minLimit = 0;
        this.maxLimit = this.rollers.getPosition(0);
      }
    }
  }

  private handleDocumentResize(): void {
    // пересчитаем размеры шкалы
    this.scale.calcSizes();

    if (!this.settings.range) {
      this.maxLimit = this.scale.getScaleSize();
    }

    // обновим позиции бегунков
    let inputValue: number;
    let position: number;

    this.getInputs().forEach( (input, i) => {
      inputValue = +(<HTMLInputElement>input).value;
      position  = this.calcPosition(inputValue);
      this.rollers.slide(position, <0 | 1>i);
    });

    let { startPos, endPos } = this.calcStartEndPositionsOfRange();
    this.scale.paint(startPos, endPos);
  }

  // расчитывает смещение бегунка относительно шкалы
  private calcPosition(value: number | PointerEvent): number {
    let position: number;

    if (typeof value === "number") {

      position = value / (this.settings.max - this.settings.min);
      position *= this.scale.getScaleSize();
      position -= this.scale.getZeroOffset();

      if (this.settings.type ==="vertical") {
        position = this.scale.getScaleSize() - position
      }

      return position;
    }

    if (this.settings.type === "vertical") {
      position = value.clientY - this.scale.getScaleOffset();
    } else {
      position = value.clientX - this.scale.getScaleOffset();
    }

    position -= this.rollers.getSize()/2;

    // если расчитаная позиция не в допустимом диапазоне вернем ближайшее допустимое значение
    let validValue = this.getNearestValidValue(position);
    if (validValue !== position) return validValue;

    // вычислим на какое количество шагов необходимо сдвинуть бегунок
    let steps = this.calcCountSteps(position);

    position = this.rollers.getLastUpdatedPosition() + steps * this.scale.getStep();

    // если расчитаная позиция не в допустимом диапазоне вернем ближайшее допустимое значение
    validValue = this.getNearestValidValue(position);
    if (validValue !== position) return validValue;

    return +position.toFixed(3);
  }

  private getNearestValidValue(value: number): number {
    if (value > this.maxLimit) {
      return this.maxLimit;
    }

    if (value < this.minLimit) {
      return this.minLimit;
    }

    return value;
  }

  private calcCountSteps(position: number): number {
    // вычислим смещение курсора в пикселях
    let offset: number = position - this.rollers.getLastUpdatedPosition();

    // вычислим на какое количество шагов необходимо сдвинуть бегунок
    let steps: number = Math.round(offset / this.scale.getStep() );
    return steps;
  }

  // возвращает позиции начала и конца закрашиваемого диапазона
  private calcStartEndPositionsOfRange(): { startPos: number, endPos: number } {
    let startPos: number;
    let endPos: number;
    if (this.settings.range) {
      startPos = this.rollers.getPosition(0);
      endPos = this.rollers.getPosition(1);
    } else {
      startPos = 0;
      endPos = this.rollers.getPosition(0);
    }

    if (this.settings.type === "horizontal"){
      endPos = this.scale.getScaleSize() - endPos;
    } else {
      if (this.settings.range) {
        startPos = this.scale.getScaleSize() - startPos;
      }
    }

    return { startPos, endPos };
  }
}


export default SliderView;
export type { ISliderView };