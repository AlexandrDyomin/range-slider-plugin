import type { sliderSettings } from "../Slider";


interface ISliderView {
  setValue(
    value: number | PointerEvent,
    descriptor?: 0 | 1
  ): {value: number, descriptor: number} | null;
  getRollers(): NodeList;
  getContainer(): HTMLElement;
  getSettings(): sliderSettings;
  takeRoller(roller: HTMLElement): void;
  throwRoller(roller: HTMLElement): void
}


class SliderView implements ISliderView {
  private step: number;                                  // размер шага, px
  private minLimit: number;                              // минимально допустимое смещение бегунка,px
  private maxLimit: number;                              // максимально допустимое смещение бегунка, px
  private template: string;                              // html-код слайдера
  private sizeScale: number;                             // ширина(высота) шкалы, px
  private rollers: NodeList;                             // бегунки
  private scale: HTMLElement;                            // шкала
  private zeroOffset: number;                            // смещение нуля на шкале, px
  private range: HTMLElement;                            // закрашиваемая часть шкалы
  private sizeRoller: number;                            // ширина(высота) бегунка, px
  private offsetScale: number;                           // смещение шкалы относительно окна, px
  private container: HTMLElement;                        // контейнер, в котором будет расположен слайдер
  private settings: sliderSettings;                      // настройки слайдера
  private inputs: NodeList | null = null;                // текстовые поля для значений слайдера с двумя бегунками
  private previousPos: number | null = null;             // позиция последнего смещенного ролика на шкале, px
  private indexOfRoller: 0 | 1 | null = null;            // индекс ролика, на котором совершен клик
  private defaultSlider: HTMLInputElement | null = null; // стандартный слайдер

  constructor(container: HTMLElement, settings: sliderSettings) {
    this.settings = settings;
    this.container = container;
    this.template = this.getTemplate();

    // отобразим слайдер на странице
    this.container.innerHTML = this.template;

    this.scale = this.container.querySelector(".slider__scale")!;
    this.range = this.container.querySelector(".slider__range")!;
    this.rollers = this.container.querySelectorAll(".slider__roller");
    this.sizeRoller = this.getSizeElement(this.rollers[0] as HTMLElement);
    this.sizeScale = this.getSizeElement(this.scale) - this.sizeRoller;
    this.minLimit = 0;
    this.maxLimit = this.sizeScale;
    this.step = this.settings.step /
                (this.settings.max - this.settings.min) * this.sizeScale;

    this.zeroOffset = (this.settings.min - 0) /
                (this.settings.max - this.settings.min) * this.sizeScale;

    if (settings.type === "horizontal") {
      this.offsetScale = this.scale.getBoundingClientRect().left;
    } else {
      this.offsetScale = this.scale.getBoundingClientRect().top;
    }

    if (this.settings.range) {
      this.inputs = document.querySelectorAll(`#${ this.container.id } .slider > input`);
    } else {

      this.defaultSlider = document.querySelector(`#${ this.container.id } .slider > .slider-default_hidden`);
    }

    // добавим объекту window обработчик на событие resize
    this.handleDocumentResize = this.handleDocumentResize.bind(this);
    window.addEventListener("resize", this.handleDocumentResize);

    // обновим положение бегунков в соответствие с переданными настройками
    if (this.settings.range) {
      this.settings.values!.forEach( (value, i) => this.setValue(value, <0 | 1>i) );
    } else {
      this.setValue(this.settings.value!, 0);
    }
  }

  // передвигает бегунок и обновляет input
  public setValue(
    value: number | PointerEvent,
    descriptor: 0 | 1 = 0
  ): { value: number, descriptor: number } | null {
    // вычислим смещение бегунка относительно шкалы
    let position: number = this.calcPosition(value);

    // вычислим значение ролика и его номер
    if (position !== this.previousPos) {
      // let indexOfRoller: 0 | 1;
      let inputValue: number;
      if (typeof value === "number") {
        this. indexOfRoller = descriptor;
        inputValue = value;
      } else {
        inputValue = this.calcValue(position);
      }

      // переместим бегунок
      this.slide(position, this.indexOfRoller!);

      // обновим значение инпута
      this.updateInput(inputValue, this.indexOfRoller!);

      // закрасим диапазон
      this.paintRange();

      return {
        value: inputValue,
        descriptor: this.indexOfRoller!
      };
    } else {
      return null;
    }
  }

  public takeRoller(roller: HTMLElement): void {
    // сохраним индекс ролика
    if (roller === this.rollers[0]) {
      this.indexOfRoller = 0;
    } else {
      this. indexOfRoller = 1;
    }

    // вычислим смещение ролика относительно окна
    this.previousPos = this.getRollerPosition(this.indexOfRoller);

    // вычислим максимально и минимально допустимые смещения относительно шкалы для ролика
    if (this.settings.range) {
      this.calcLimits(roller);
    }

  }

  public throwRoller(roller: HTMLElement): void {

  }

  public getRollers(): NodeList {
    return this.rollers;
  }

  public getContainer(): HTMLElement {
    return this.container;
  }

  public getSettings(): sliderSettings {
    return this.settings;
  }

  private getRollerPosition(descriptor: number): number {
    let roller: HTMLElement = <HTMLElement>this.rollers[descriptor];
    let position: number;

    if (this.settings.type === "horizontal") {
      position = +roller.style.left.replace("px", "");
    } else {
      position = +roller.style.top.replace("px", "");

    }

    return position;
  }

  // вычисляет максимально и минимально допустимые смещения ролика
  private calcLimits(roller: HTMLElement): void {
    if (this.settings.type === "horizontal") {
      if (roller === this.rollers[0]) {
        this.minLimit = 0;
        this.maxLimit= this.getRollerPosition(1);
      }

      if (roller === this.rollers[1]) {
        this.minLimit = this.getRollerPosition(0);
        this.maxLimit = this.sizeScale;
      }
    } else {
      if (roller === this.rollers[0]) {
        this.minLimit =this.getRollerPosition(1);
        this.maxLimit = this.sizeScale;
      }

      if (roller === this.rollers[1]) {
        this.minLimit = 0;
        this.maxLimit = this.getRollerPosition(0);
      }
    }
  }

  private updateInput(value: number, descriptor: 0 | 1): void {
    if (this.settings.range) {
      (<HTMLInputElement>this.inputs![descriptor]).value = value.toString();
    } else {
      this.defaultSlider!.value = value.toString();
    }
  }

  // вычисляет значение бегунка
  private calcValue(position: number): number {
    // вычислим значение ролика
    let value: number = position / this.sizeScale;
    value = value * (this.settings.max - this.settings.min);

    let offset = this.settings.min - 0;
    value += offset;

    if (this.settings.type === "vertical") {
      value = this.settings.max - value + offset;
    }

    return value;
  }

  private slide(position: number, descriptor: 0 | 1): void {
    // переместим бегунок
    if (this.settings.type === "horizontal") {
      (<HTMLElement>this.rollers[descriptor]).style.left = `${ position }px`;
    } else {
      (<HTMLElement>this.rollers[descriptor]).style.top = `${ position }px`;
    }

    this.previousPos = position;
  }

  private getSizeElement(element: HTMLElement): number {
    if (this.settings.type === "vertical") {
      return element.offsetHeight;
    }

    return element.offsetWidth;
  }

  private handleDocumentResize(): void {
    // пересчитаем поля
    this.sizeScale = this.getSizeElement(this.scale) - this.sizeRoller;
    this.step = this.settings.step /
                (this.settings.max - this.settings.min) * this.sizeScale;

    // обновим позиции бегунков
    let inputValue: number;
    let position: number;
    if (this.settings.range) {
      this.inputs!.forEach( (input, i) => {
        inputValue = +(<HTMLInputElement>input).value;
        position  = this.calcPosition(inputValue);
        this.slide(position, <0 | 1>i);
        this.paintRange();
      });
    } else {
      inputValue = +this.defaultSlider!.value;
      position = this.calcPosition(inputValue);
      this.slide(position, 0);
      this.paintRange();
    }
  }

  // расчитывает смещение бегунка относительно шкалы
  private calcPosition(value: number | PointerEvent): number {
    // вычислим смещение бегунка относительно шкалы
    let position: number;

    if (typeof value === "number") {

      position = value / (this.settings.max - this.settings.min);
      position *= this.sizeScale;
      position -= this.zeroOffset;

      if (this.settings.type ==="vertical") {
        position = this.sizeScale - position
      }

      return position;
    }

    if (this.settings.type === "vertical") {
      position = value.clientY - this.offsetScale;
    } else {
      position = value.clientX - this.offsetScale;
    }

    position -= this.sizeRoller/2;

    // если расчитаная позиция не в допустимом диапазоне вернем ближайшее допустимое значение
    let validValue = this.getNearestValidValue(position);
    if (validValue !== position) return validValue;

    // вычислим на какое количество шагов необходимо сдвинуть бегунок
    let steps = this.calcCountSteps(position);

    position = this.previousPos! + steps * this.step;

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
    let offset: number = position - this.previousPos!;

    // вычислим на какое количество шагов необходимо сдвинуть бегунок
    let steps: number = Math.round(offset / this.step);
    return steps;
  }

  // возвращает html-код слайдера
  private getTemplate(): string {
    let { min, max, step, value, values, type, range } = this.settings;

    return (
      `<div class="slider">
        ${
          range ?
            `<input class="slider__min-val" value="${values![0]}">
            <input class="slider__max-val" value="${values![1]}">` :
            `<input class="slider-default_hidden"
                    type="range" min="${ min }"
                    max="${ max }"
                    step="${ step }"
                    value="${ value }">`
        }

        <output class="slider__display"></output>
        <div class="slider__scale slider__scale_${ type }">
          <div class="slider__range"></div>
          ${
            range ?
              `<div class="slider__roller slider__roller_first"></div>
              <div class="slider__roller slider__roller_second"></div>`:
              `<div class="slider__roller slider__roller_first"></div>`
          }
        </div>
      </div>`
    );
  }

  private paintRange(): void {
    let start: number;
    let end: number;
    if (this.settings.range) {
      start = this.getRollerPosition(0);
      end = this.getRollerPosition(1);
    } else {
      start = 0;
      end = this.getRollerPosition(0);
    }

    if (this.settings.type === "horizontal"){
      end = this.sizeScale - end;
      this.range.style.left = `${ start }px`;
      this.range.style.right = `${ end }px`;
    } else {
      if (this.settings.range) {
        start = this.sizeScale - start;
      }

      this.range.style.bottom = `${ start }px`;
      this.range.style.top = `${ end }px`;
    }
  }
}


export default SliderView;
export type { ISliderView };
