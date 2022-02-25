import type { sliderSettings } from "../factory/slider";


interface ISliderView {
  updateValue(value: number, descriptor: number): void;
  // геттеры
  rollers: NodeList;
  container: HTMLElement;
  settings: sliderSettings;
}


class SliderView implements ISliderView {
  private _template: string; // html-шаблон слайдера
  private _rollers: NodeList; // хранит бегунки

  constructor(
    private _container: HTMLElement, // контейнер, в котором будет расположен слайдер
    private _settings: sliderSettings // настройки слайдера
    ) {
      this._template = this._getTemplate();
      this._render();
      this._rollers = this._container.querySelectorAll(".slider__roller");
  }

  // вставляет шаблон слайдера в контейнер
  private _render(): void {
    this._container.innerHTML = this._template;
  }

  // возвращает шаблон слайдера
  private _getTemplate(): string {
    let { min, max, step, value, type, range } = this._settings;

    return `<div class="slider">
      <input class="slider-default_hidden" type="range" min="${ min }" max="${ max }" step="${ step }" value="${ value }">
      <output class="slider__display"></output>
      <div class="slider__scale slider__scale_${type}">
        <div class="slider__range"></div>
        <div class="slider__roller slider__roller_first"></div>
        ${ range ? '<div class="slider__roller slider__roller_second"></div>': "" }
      </div>
    </div>`
  }

  // обновляет отображение слайдера
  updateValue(value: number, descriptor: number): void {
    let isHorizontal = this._settings.type === "horizontal";
    (<HTMLElement>this._rollers[descriptor])
      .style.transform = `translate${ isHorizontal ? "X" : "Y" }(${ value }px)`;
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
}

export default SliderView;
export type { ISliderView };