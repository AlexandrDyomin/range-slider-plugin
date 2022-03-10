import type { sliderSettings } from "../factory/slider";
import Roller from "../model/Roller";


interface ISliderView {
  setValue(value: number | PointerEvent, descriptor?: 0 | 1): void;
  // геттеры
  getRollers(): NodeList;
  getContainer(): HTMLElement;
  getSettings(): sliderSettings;
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
  public setValue(value: number | PointerEvent, descriptor: 0 | 1 = 0): void {
    // вычислим смещение бегунка относительно шкалы в процентах
    let position: number = this.calcPosition(value);

    let indexOfRoller: 0 | 1;
    let inputValue: number;

    // вычислим значение ролика и его номер
    if (typeof value === "number") {
      indexOfRoller = descriptor;
      inputValue = value;
    } else {
      indexOfRoller = this.indexOfRoller!;
      inputValue = this.calcValue(value);
    }

    // переместим бегунок
    this.slide(position, indexOfRoller);

    // обновим значение инпута
    this.updateInput(inputValue, indexOfRoller);

    // закрасим диапазон
    this.paintRange();
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
      this.offsetRoller = roller.getBoundingClientRect().left;
    }

    if (this.settings.type === "vertical") {
      this.offsetRoller = roller.getBoundingClientRect().top;
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
  private calcValue(e: PointerEvent): number {
    let roller: HTMLElement = <HTMLElement>this.rollers[this.indexOfRoller!];

    // найдем позицию ролика на шкале
    let position: number;
    if (this.settings.type === "vertical") {
      position = +roller.style.top.replace("px", "");
    } else {
      position = +roller.style.left.replace("px", "");
    }

    // вычислим и вернем значение ролика
    return Math.round(this.settings.max * position / 100 * (1 + this.shareOfRoller) );
  }

  private slide(position: number, descriptor: 0 | 1): void {
    // переместим бегунок
    if (this.settings.type === "horizontal") {
      (<HTMLElement>this.rollers[descriptor]).style.left = `${ position }px`;
    }

    if (this.settings.type === "vertical") {
      (<HTMLElement>this.rollers[descriptor]).style.top = `${ position }px`;
    }
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

  // расчитывает смещение бегунка в процентах относительно шкалы
  private calcPosition(value: number | PointerEvent): number {
    // вычислим смещение бегунка относительно шкалы шкале
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
    let { start, end, size } = this.getPropsRange();

    // установим размер диапазона
    if (this.settings.type === "horizontal"){
      this.range.style.width = `${ size }px`;
      this.range.style.left = start + "px";
    } else {
      this.range.style.height = `${ size }px`;
      this.range.style.top = start + "px";
    }
  }

  private getPropsRange(): {start: number, end: number, size: number} {
    let start: number;
    let end: number;
    let size: number;

    if (this.settings.range) {
      if (this.settings.type === "vertical") {
        start = +(<HTMLElement>this.rollers[1]).style.top.replace("px", "");
        end = +(<HTMLElement>this.rollers[0]).style.top.replace("px", "") + this.sizeRoller;
      } else {
        start = +(<HTMLElement>this.rollers[0]).style.left.replace("px", "");
        end = +(<HTMLElement>this.rollers[1]).style.left.replace("px", "") + this.sizeRoller;
      }
    } else {
      if (this.settings.type === "vertical") {
        end = this.sizeScale;
        start = +(<HTMLElement>this.rollers[0]).style.top.replace("px", "");
      } else{
        start = 0;
        end = +(<HTMLElement>this.rollers[0]).style.left.replace("px", "") + this.sizeRoller;
      }
    }

    size = Math.abs(end - start);
    return {start, end, size};
  }
}


export default SliderView;
export type { ISliderView };