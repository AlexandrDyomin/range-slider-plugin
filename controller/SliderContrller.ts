import Slider from "../model/Slider";
import SliderView from "../view/SliderView";

interface ISliderContriller {
  // геттер и сеттер
  value: [number, number] | number;
  setValue(value: number, descriptor: number): void;
}


class SliderController implements ISliderContriller {
  private _view: SliderView; // view слайдера
  private _slider: Slider; // модель слайдера

  constructor(rollers: SliderView, slider: Slider) {
    this._view = rollers;
    this._slider = slider;

    // добавим обработчик на событие touchstart на бегунках
    this._view.rollers.forEach( (item: Node) => {
      item.addEventListener("pointerdown", () => this._view.updateValue.apply(this._view) );
    });
  }

  // возвращает значения бегунков
  get value(): [number, number] | number {
    return this._slider.value;
  }

  // устанавливает значния бегунков
  setValue(value: number, descriptor: number): void {
    this._view.updateValue();
    this._slider.setValue(value, descriptor);
  }



}


export default SliderController;