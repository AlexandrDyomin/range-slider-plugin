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
  private minLimit: number;                              // минимально допустимое смешение бегунка относительно шкалы,px
  private maxLimit: number;                              // максимально допустимое смешение бегунка относительно шкалы, px
  private template: string;                              // html-код слайдера
  private sizeScale: number;                             // ширина(высота) шкалы, px
  private rollers: NodeList;                             // хранит бегунки
  private scale: HTMLElement;                            // шкала
  private range: HTMLElement;                            // закрашиваемая часть шкалы
  private sizeRoller: number;                            // ширина(высота) бегунка, px
  private offsetScale: number;                           // смещение шкалы относительно окна, px
  private shareOfRoller: number;                         // часть, которую  занимаемает бегунок на шкале
  private container: HTMLElement;                        // контейнер, в котором будет расположен слайдер
  private settings: sliderSettings;                      // настройки слайдера
  private inputs: NodeList | null = null;                // текстовые поля для значений слайдера с двумя бегунками
  private indexOfRoller: 0 | 1 | null = null;            // индекс ролика, на котором совершен клик
  private offsetRoller: number | null = null;            // смещение выбранного ролика относительно окна, px
  private defaultSlider: HTMLInputElement | null = null; // стандартный слайдер
  private previousPos: number | null = null;

  constructor(container: HTMLElement, settings: sliderSettings) {
    this.settings = settings;
    this.container = container;
    this.template = this.getTemplate();

    // отобразим слайдер на странице
    this.render();

    this.scale = this.container.querySelector(".slider__scale")!;
    this.range = this.container.querySelector(".slider__range")!;
    this.rollers = this.container.querySelectorAll(".slider__roller");
    this.sizeScale = this.getSizeElement(this.scale);
    this.sizeRoller = this.getSizeElement(this.rollers[0] as HTMLElement);
    this.shareOfRoller = this.sizeRoller / this.sizeScale;
    this.minLimit = 0;
    this.maxLimit = this.sizeScale - this.sizeRoller;

    if (settings.type === "horizontal") {
      this.offsetScale = this.scale.getBoundingClientRect().left;
    } else {
      this.offsetScale = this.scale.getBoundingClientRect().top;
    }

    if (this.settings.range) {
      this.inputs = document.querySelectorAll(".slider > input");
    } else {
      this.defaultSlider = document.querySelector(".slider-default_hidden");
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
        // indexOfRoller = this.indexOfRoller!;
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
    if (this.settings.type === "horizontal") {
      // this.offsetRoller = roller.getBoundingClientRect().left;
      this.previousPos = +roller.style.left.replace("px", "");
    }

    if (this.settings.type === "vertical") {
      // this.offsetRoller = roller.getBoundingClientRect().top;
      this.previousPos = +roller.style.top.replace("px", "");
    }


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

  // вычисляет максимально и минимально допустимые смещения ролика
  private calcLimits(roller: HTMLElement): void {
    if (this.settings.type === "horizontal") {
      if (roller === this.rollers[0]) {
        this.minLimit = 0;
        this.maxLimit = +(<HTMLElement>this.rollers[1]).style.left.replace("px", "");
      }

      if (roller === this.rollers[1]) {
        this.minLimit = +(<HTMLElement>this.rollers[0]).style.left.replace("px", "");
        this.maxLimit = this.sizeScale - this.sizeRoller;
      }
    } else {
      if (roller === this.rollers[0]) {
        this.minLimit = +(<HTMLElement>this.rollers[1]).style.top.replace("px", "");
        this.maxLimit = this.sizeScale - this.sizeRoller;
      }

      if (roller === this.rollers[1]) {
        this.minLimit = 0;
        this.maxLimit = +(<HTMLElement>this.rollers[0]).style.top.replace("px", "");
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
    // вычислим и вернем значение ролика
    let value: number = position / (this.sizeScale - this.sizeRoller);
    value = value * (this.settings.max - this.settings.min);
    return value;
  }

  private slide(position: number, descriptor: 0 | 1): void {
    // переместим бегунок
    if (this.settings.type === "horizontal") {
      (<HTMLElement>this.rollers[descriptor]).style.left = `${ position }px`;
    }

    if (this.settings.type === "vertical") {
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
    this.sizeScale = this.getSizeElement(this.scale);
    this.shareOfRoller = this.sizeRoller / this.sizeScale;

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

  private render(): void {
    this.container.innerHTML = this.template;
  }

  // расчитывает смещение бегунка относительно шкалы
  private calcPosition(value: number | PointerEvent): number {
    // вычислим смещение бегунка относительно шкалы
    let position: number;
    if (typeof value === "number") {
      position = value / (this.settings.max - this.settings.min);
      position *= this.sizeScale -this.sizeRoller;
      if (this.settings.type ==="vertical") {
        position = this.sizeScale - this.sizeRoller - position
      }
      return position;
    }

    if (this.settings.type === "vertical") {
      position = value.clientY - this.offsetScale;
    } else {
      position = value.clientX - this.offsetScale;
    }

    position -= this.sizeRoller/2;

    // если курсор не в допустимом диапазоне вернем ближайшее допустимое значение
    if (position > this.maxLimit) {
      return this.maxLimit;
    }
    if (position < this.minLimit) {
      return this.minLimit;
    }

    // вычислим размер шага в пикселях
    let step: number = this.settings.step / (this.settings.max - this.settings.min);
    step =  step * (this.sizeScale - this.sizeRoller);
    let halfStep: number = step / 2;

    if (position > this.previousPos!) {

      let nextValue: number = this.previousPos! + step;
      if (position >= nextValue - halfStep) {
        position = nextValue;
      } else {
        position = this.previousPos!;
      }

    } else {

      let nextValue: number = this.previousPos! - step;
      if (position <= nextValue + halfStep) {
        position = nextValue;
      } else {
        position = this.previousPos!;
      }
    }

    return position;
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
    if (this.settings.type === "horizontal"){
      let start: number = +(<HTMLElement>this.rollers[0]).style.left.replace("px", "");
      let end: number = +(<HTMLElement>this.rollers[1]).style.left.replace("px", "");
      end = this.sizeScale - this.sizeRoller - end;
      this.range.style.left = `${ start }px`;
      this.range.style.right = `${ end }px`;
    } else {
      let start: number = +(<HTMLElement>this.rollers[0]).style.top.replace("px", "");
      let end: number = +(<HTMLElement>this.rollers[1]).style.top.replace("px", "");
      start = this.sizeScale - this.sizeRoller - start;
      this.range.style.bottom = `${ start }px`;
      this.range.style.top = `${ end }px`;
    }
  }
}


export default SliderView;
export type { ISliderView };