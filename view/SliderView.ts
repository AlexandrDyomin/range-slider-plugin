import type { sliderSettings } from "../factory/slider";


interface ISliderView {
  updateValue(e:PointerEvent | null, value?: number, descriptor?: number): void;
  // геттеры
  rollers: NodeList;
  container: HTMLElement;
  settings: sliderSettings;
}


class SliderView implements ISliderView {
  private minLimit: number;                           // минимально допустимое смешение бегунка относительно шкалы, %
  private maxLimit: number;                           // максимально допустимое смешение бегунка относительно шкалы, %
  private _template: string;                          // html-код слайдера
  private sizeScale: number;                          // ширина(высота) шкалы, px
  private sizeRoller: number;                         // ширина(высота) бегунка, px
  private _rollers: NodeList;                         // хранит бегунки
  private offsetScale: number;                        // смещение шкалы относительно окна, px
  private shareOfRoller: number;                      // часть, которую  занимаемает бегунок на шкале
  private inputs: NodeList | null;                    // текстовые поля для значений слайдера с двумя бегунками
  private _container: HTMLElement;                    // контейнер, в котором будет расположен слайдер
  private _settings: sliderSettings;                  // настройки слайдера
  private indexOfRoller: 0 | 1 | null = null;         // индекс ролика, на котором совершен клик
  private offsetRoller: number | null = null;         // смещение выбранного ролика относительно окна, px
  private defaultSlider: HTMLInputElement | null;     // стандартный слайдер

  constructor(container: HTMLElement, settings: sliderSettings) {
    this._settings = settings;
    this._container = container;
    this._template = this._getTemplate();

    // отобразим слайдер на странице
    this._render();

    this._rollers = this._container.querySelectorAll(".slider__roller");
    this.sizeRoller = this.getSizeElement(this._rollers[0] as HTMLElement);
    let scale: HTMLElement = document.querySelector(".slider__scale")!;
    this.offsetScale = scale.getBoundingClientRect().left;
    this.sizeScale = this.getSizeElement(this._container);
    this.shareOfRoller = this.sizeRoller / this.sizeScale;
    this.minLimit = 0;
    this.maxLimit = 100 * (1 - this.shareOfRoller);

    if (this._settings.range) {
      this.defaultSlider = null;
      this.inputs = document.querySelectorAll(".slider > input");
    } else {
      this.inputs = null;
      this.defaultSlider = document.querySelector(".slider-default_hidden");
    }

    // добавим объекту window обработчик на событие resize
    this.handleDocumentResize = this.handleDocumentResize.bind(this);
    window.addEventListener("resize", this.handleDocumentResize);

    // обновим положение бегунков в соответствие с переданными настройками
    let rollers: NodeList = document.querySelectorAll(".slider__roller");
    if (this.settings.range) {
      this.settings.values!.forEach((value, i) => this.updateValue(null, value, i) );
    } else {
      this.updateValue(null, this.settings.value, 0);
    }
  }



  // обновляет отображение слайдера
  public updateValue(e: PointerEvent | null, value?: number, descriptor?: number): void {
    // блок выполнится в случае программной установки значения
    if (value && descriptor !== undefined) {
      // let roller = <HTMLElement>this._rollers[descriptor];
      // let sizeRoller: number = this.getSizeElement(roller);
      // descriptor === 1 ? value = value - (sizeRoller / sizeScale) * 100 : value;
      // switch (this.settings.type) {
      //   case "horizontal":
      //     roller.style.left = `${ value }%`;
      //     return;
      //   case "vertical":
      //     roller.style.top = `${ value }%`;
      //     return;
      // }
    }

    // блок выполнится при перемещении бегунка
    if (e) {
      let roller: HTMLElement = this._rollers[this.indexOfRoller!] as HTMLElement;
      let value: number;

      if (this._settings.type === "horizontal") {
        value = this.getValue(e.clientX - this.offsetScale);
      }

      if (this._settings.type === "vertical") {
        value = this.getValue(e.clientY);
      }

      this.slide(roller, value!);
      this.updateInput(value!);
    }
  }



  public takeRoller(roller: HTMLElement): void {
    // сохраним индекс ролика
    if (roller === this._rollers[0]) {
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
    if (this._settings.range && roller === this._rollers[0]) {
      this.minLimit = 0;
      this.maxLimit = Math.round((+(<HTMLInputElement>this.inputs![1]).value / this.settings.max!) * 100  * (1 - this.shareOfRoller));
    }

    if (this._settings.range && roller === this._rollers[1]) {
      this.minLimit = Math.round((+(<HTMLInputElement>this.inputs![0]).value / this.settings.max!) * 100 * (1 - this.shareOfRoller));
      this.maxLimit = Math.round(100  * (1 - this.shareOfRoller));
    }
  }

  public throwRoller(roller: HTMLElement): void {

  }

  private updateInput(value: number): void {
    // if (this.indexOfRoller === 1) {
      //   (<HTMLInputElement>this.inputs![this.indexOfRoller!]).value = value.toString();
      //   return;
      // }

    value = Math.round(value/100 * this.settings.max! * (1 + this.shareOfRoller));
    (<HTMLInputElement>this.inputs![this.indexOfRoller!]).value = value.toString();

  }

  private slide(roller: HTMLElement, value: number): void {
    if (this._settings.type === "horizontal") {
      roller.style.left = `${ value }%`;
    }

    if (this._settings.type === "vertical") {
      roller.style.top = `${ value }%`;
    }
  }

  private getValue(value: number): number {
    let step = this.settings.step! / this.sizeScale * 100;
    // переведем координаты из пикселей в проценты
    let percent = Math.round((value / this.sizeScale - this.sizeRoller / 2 / this.sizeScale ) * 100);


    // если значение в диапазоне шкалы вернем его
    // if (percent >= this.min && percent <= this.max ) {
    //   return percent;
    // }


    if (percent > this.maxLimit) {
      return this.maxLimit;
    }

    if (percent < this.minLimit) {
      return this.minLimit;
    }

    return percent;



    // если значение выходит за пределы шкалы вернём ближайшее крайнее значение
    // if (this.max - percent <= percent - this.min) {
    //   return this.max;
    // } else {
    //   return this.min;
    // }

  }

  // возвращает бегунки
  get rollers(): NodeList {
    return this._rollers;
  }

  // возвращает контейнер
  get container(): HTMLElement {
    return this._container;
  }

  // возвращает объект настроек
  get settings(): sliderSettings {
    return this._settings;
  }

  private getSizeElement(element: HTMLElement): number {
    if (this._settings.type === "vertical") {
      return element.offsetHeight;
    }

    return element.offsetWidth;
  }


  private handleDocumentResize(): void {
    this.sizeScale = this.getSizeElement(this._container);
  }

  // вставляет шаблон слайдера в контейнер
  private _render(): void {
    this._container.innerHTML = this._template;
  }

  // возвращает шаблон слайдера
  private _getTemplate(): string {
    let { min, max, step, value, values, type, range } = this._settings;

    return (
      `<div class="slider">
        ${
          range ?
            `<input class="slider__min-val" value="${values![0]}">
            <input class="slider__max-val" value="${values![1]}">` :
            `<input class="slider-default_hidden" type="range" min="${ min }" max="${ max }" step="${ step }" value="${ value }">`
        }
        <output class="slider__display"></output>
        <div class="slider__scale slider__scale_${ type }">
          <div class="slider__range"></div>
          <div class="slider__roller slider__roller_first"></div>
          ${ range ? '<div class="slider__roller slider__roller_second"></div>': "" }
        </div>
      </div>`
    )
  }
}

export default SliderView;
export type { ISliderView };