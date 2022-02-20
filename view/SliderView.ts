import type { sliderSettings } from "../factory/slider";


interface ISliderView {
  updateValue(value: number): void;
}


class SliderView implements ISliderView {
  private _template: string; // html-шаблон слайдера
  private _rollers: NodeList; // хранит бегунки

  constructor(
    private _container: Element, // контейнер, в котором будет расположен слайдер
    private _settings: sliderSettings // настройки слайдера
    ) {
      this._template = this._getTemplate();
      this._render();
      this._rollers = _container.querySelectorAll(".slider__roller");
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
  updateValue(): void {
    console.log("yoyoyo");
  }
}

export default SliderView;