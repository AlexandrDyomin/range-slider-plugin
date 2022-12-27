import type { IScale } from './typingForScale';
import type { sliderSettings } from '../sliderSettings';
import type { ITemplate } from './typingForTemplate';
import type { IRollers } from './typingForRollers';
import type{ ISliderView } from './typingForSliderView';
import { FormElements, IFormElements } from './FormElements';
import { FillableRange, IFillableRange } from './FillableRange';
import { Outputs, IOutputs } from './Outputs';
import Rollers from './Rollers';
import Scale from './Scale';
import Template from './Template';

class SliderView implements ISliderView {
  private scale: IScale;
  private minLimit: number; // минимально допустимое смещение бегунка,px
  private maxLimit: number; // максимально допустимое смещение бегунка, px
  private rollers: IRollers;
  private template: ITemplate;
  private inputs: IFormElements;
  private range: IFillableRange;
  private outputs: IOutputs;
  private settings: sliderSettings;

  constructor(container: HTMLElement, settings: sliderSettings) {
    this.settings = settings;
    this.template = new Template(container, settings);
    this.inputs = new FormElements(this.getInputs());
    this.rollers = new Rollers(this.getRollers(), settings.type);
    this.range = new FillableRange(this.getRange(), settings.type);
    this.outputs = new Outputs(this.getOutputs(), settings);
    this.scale = new Scale(
      this.getScale(),
      this.rollers.getSize(),
      settings
    );

    this.minLimit = 0;
    this.maxLimit = this.scale.getScaleSize();

    // добавим объекту window обработчик на событие resize
    this.handleDocumentResize = this.handleDocumentResize.bind(this);
    window.addEventListener('resize', this.handleDocumentResize);

    // обновим положение бегунков в соответствие с переданными настройками
    this.settings.values.forEach( (value, i) => this.update(value, <0 | 1>i) );
  }
  
  getDescriptor(): 0 | 1 {
    return this.rollers.getDescriptor();
  }

  getRollersPositions(): [number, number?] {
    let positions: [number, number?] | [] = [0];
    for (let i = 0; i < this.getRollers().length; i++) {
      positions[i] = this.rollers.getPosition(i);
    }
    return positions;
  }

  getOutputs(): Node[] {
    return this.template.getOutputs();
  }

  getInputs(): NodeList {
    return this.template.getInputs();
  }

  update(
    value: number | PointerEvent | TouchEvent,
    descriptor?: 0 | 1
  ): { value: number, descriptor: 0 | 1 } | null {
    // вычислим смещение бегунка относительно шкалы
    let position: number = this.calcPosition(value);

    // вычислим значение ролика и его номер
    if (typeof value === 'number' || position !== this.rollers.getLastUpdatedPosition()) {
      let inputValue: number;
      
      if (typeof value === 'number' && descriptor !== undefined) {
        // переместим бегунок
        this.rollers.slide(position, descriptor);
        inputValue = value;
      } else {
        inputValue = this.scale.calcValue(position);
        descriptor = this.rollers.getDescriptor();
      }

      if (value instanceof Event && (value.type === 'pointerdown' || value.type === 'touchstart')) {
        this.addSmoothTransition(descriptor);
      }

      // переместим бегунок
      this.rollers.slide(position, descriptor);
      
      if (value instanceof Event && (value.type === 'pointerdown' || value.type === 'touchstart')) {
        setTimeout(this.removeSmoothTransition, 300, descriptor)
      }
      
      if (value instanceof Event && (value.type === 'pointermove' || value.type === 'touchmove')) {
       this.removeSmoothTransition(descriptor);
      }
      
      // обновим значение инпута
      this.inputs.update(inputValue.toString(), descriptor);

      // закрасим диапазон
      let { startPos, endPos } = this.calcStartEndPositionsOfRange();
      this.range.paint(startPos, endPos);

      this.outputs.updateOutputs(descriptor, inputValue);

      this.outputs.rerenderOutputs();

      return {
        value: inputValue,
        descriptor: descriptor
      };
    } else {
      if (descriptor !== undefined) {
        this.outputs.updateOutputs(descriptor, this.scale.calcValue(position));
      }

      return null;
    }
  }

  takeRoller(roller: HTMLElement | PointerEvent | TouchEvent): void {
    if (roller instanceof HTMLElement) {
      this.rollers.determineDescriptor(roller);
      
      if (this.getSettings().range) {
        roller.style.zIndex = '1';
        
        if (this.rollers.getDescriptor() === 0)
        (<HTMLElement>this.getRollers()[1]).style.zIndex = 'auto';
      } else {
        (<HTMLElement>this.getRollers()[0]).style.zIndex = 'auto';
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
    let posCursor: number = this.calcPosCursor(roller);

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

  throwRoller(roller: HTMLElement): void {

  }

  getRollers(): NodeList {
    return this.template.getRollers();
  }

  getSlider(): HTMLElement {
    return this.template.getSlider();
  }

  getScale(): HTMLElement {
    return this.template.getScale();
  }

  getRange(): HTMLElement {
    return this.template.getRange();
  }

  getSettings(): sliderSettings {
    return this.settings;
  }

  private calcPosCursor(event: PointerEvent | TouchEvent): number {
    if (this.settings.type === 'horizontal') {
      return (
        event instanceof PointerEvent ? event.clientX: event.targetTouches[0].clientX
      ) - this.scale.getScaleOffset();
    } 

    return (
      event instanceof PointerEvent ? event.clientY: event.targetTouches[0].clientY
    ) - this.scale.getScaleOffset();
    
  }

  // вычисляет максимально и минимально допустимые смещения ролика
  private calcLimits(roller: HTMLElement): void {
    if (this.settings.type === 'horizontal') {
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
    this.range.paint(startPos, endPos);

    this.outputs.rerenderOutputs();
  }

  // расчитывает смещение бегунка относительно шкалы
  private calcPosition(value: number | PointerEvent | TouchEvent): number {
    let position: number;

    if (typeof value === 'number') {
      position = value / (this.settings.max - this.settings.min);
      position *= this.scale.getScaleSize();
      position -= this.scale.getZeroOffset();

      if (this.settings.type ==='vertical') {
        position = this.scale.getScaleSize() - position
      }

      return position;
    }

    position = this.calcPosCursor(value);
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

    if (this.settings.type === 'horizontal'){
      endPos = this.scale.getScaleSize() - endPos;
    } else {
      if (this.settings.range) {
        startPos = this.scale.getScaleSize() - startPos;
      }
    }

    return { startPos, endPos };
  }

  private addSmoothTransition(descriptor: 0 | 1): void {
    this.getRange().classList.add('slider__range_smooth');
    (<HTMLElement>this.getRollers()[descriptor]).classList.add('slider__roller_smooth');
  }

  private removeSmoothTransition = (descriptor: 0 |1): void => {
    this.getRange().classList.remove('slider__range_smooth');
    (<HTMLElement>this.getRollers()[descriptor]).classList.remove('slider__roller_smooth');
  }
}

export default SliderView;
export type { ISliderView };