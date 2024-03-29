import type { ISliderModel } from '../model/SliderModel';
import type { ISliderView } from '../view/SliderView';

interface ISliderController {
  getValue(): [number, number] | number;
  setValue(value: number, descriptor: 0 | 1): void;
}

class SliderController implements ISliderController {
  private view: ISliderView; // view слайдера
  private slider: ISliderModel; // модель слайдера
  private currentRoller: HTMLElement | null = null;
  private isFirstSlideOfroller: boolean = true;

  constructor(view: ISliderView, slider: ISliderModel) {
    this.view = view;
    this.slider = slider;

    // добавим обработчики на события pointerdown, pointermove, pointerup
    this.view.getSlider().addEventListener('pointerdown', this.handleDocumentPointerdown);
    document.addEventListener('pointerup', this.handleDocumentPointerup);
    this.view.getSlider().addEventListener('touchstart', this.handleDocumentPointerdown);
    document.addEventListener('touchend', this.handleDocumentPointerup);
    this.view.getSlider().addEventListener('keydown', this.handleSliderKeydown);
  }

  // возвращает значения бегунков
  getValue(): [number, number] | number {
    return this.slider.getValue();
  }

  // устанавливает значния бегунков
  setValue(value: number, descriptor: 0 | 1 = 0): void {
    try {
      this.slider.setValue(value, descriptor);
      this.view.update(value, descriptor);
      
      this.dispatchCustomEvent('change');
    } catch(e) {
        console.error(e);
    }
  }

  private handleSliderKeydown = (e: KeyboardEvent): void => {
    const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

    if (keys.includes(e.key)) {
      const step = this.slider.getStep();
      const inputs = [...this.view.getInputs()];
      const descriptor = inputs.indexOf(
        inputs.filter((el) => el === document.activeElement)[0]);
      let currentValue = typeof this.getValue() === 'number' ? 
        <number>this.getValue() : (<[number, number]>this.getValue())[descriptor];     
        let newValue = currentValue;
      const [min, max] = this.slider.getLimits(descriptor);
      
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        newValue = this.slider.checkValue(currentValue - step, descriptor) ? currentValue - step : min;
          
        // currentValue !== newValue && this.setValue(newValue, <0 | 1>descriptor);
      }
  
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        newValue = this.slider.checkValue(currentValue + step, descriptor) ?
          currentValue + step : max;
      }
        
      currentValue !== newValue && this.setValue(newValue, <0 | 1>descriptor);
    }  
  }

  // обработчики событий указателя
  private handleDocumentPointerdown = (e: PointerEvent | TouchEvent): void => {
    if (e instanceof TouchEvent) {
      e.preventDefault();
    }

    if (e instanceof TouchEvent || (e instanceof PointerEvent && e.button === 0)) {
      let target: HTMLElement = e.target as HTMLElement;
      let scale: HTMLElement = this.view.getScale();
      let range: HTMLElement = this.view.getRange();
           
      // добавим обработчик на событие pointermove если оно произошло на бегунке
      if (this.isRoller(target) || target === scale || target === range) {
        document.addEventListener('pointermove', this.handleDocumentPointermove);
        document.addEventListener('touchmove', this.handleDocumentPointermove);
      }

      if (target === scale || target === range) {
        // найдём ближаший ролик от позиции клика
        this.view.takeRoller(e);
        let props: { value: number, descriptor: 0 | 1 } | null = this.view.update(e);

        // если бегунок перемещен обновим модель
        if (props) {
          let { value, descriptor } = props;
          this.slider.setValue(value, descriptor);
          this.dispatchCustomEvent('slide');
          this.dispatchCustomEvent('change');
        }
      }

      if (this.isRoller(target) ) {
        this.currentRoller = target;
        this.view.takeRoller(target);
      }

      this.view.setFocusOnRoller();
    }
  }

  private dispatchCustomEvent(eventName: string): void {
    const event = new CustomEvent(eventName, {
      detail: {
        values: this.getValue(),
        positions: this.view.getRollersPositions()
      }    
    });
    this.view.getSlider().dispatchEvent(event);
  }


  private handleDocumentPointermove = (e: PointerEvent | TouchEvent): void => {
    // обновим view
    let props: { value: number, descriptor: 0 | 1 } | null = this.view.update(e);

    // если бегунок перемещен обновим модель
    if (props) {
      let { value, descriptor } = props;
      this.slider.setValue(value, descriptor);

      if (this.isFirstSlideOfroller) {
        this.dispatchCustomEvent('start');
        this.isFirstSlideOfroller = false;
      }
      this.dispatchCustomEvent('slide');
      this.dispatchCustomEvent('change');
    }
  }

  private handleDocumentPointerup = (e: PointerEvent | TouchEvent): void => {
    if (!this.isFirstSlideOfroller) {
      this.dispatchCustomEvent('stop');
      this.isFirstSlideOfroller = true;
    }

    // удалим обработчик на событие pointermove
    document.removeEventListener('pointermove', this.handleDocumentPointermove);
    document.removeEventListener('touchmove', this.handleDocumentPointermove);
    this.view.throwRoller(this.currentRoller!);
  }

  private isRoller(target: HTMLElement): boolean {
    let isFirstRoller = target === this.view.getRollers()[0];
    let isSecondRoller = target === this.view.getRollers()[1];

    return isFirstRoller || isSecondRoller;
  }
}

export default SliderController;
export type { ISliderController };