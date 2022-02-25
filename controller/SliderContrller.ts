import Slider from "../model/Slider";
import SliderView from "../view/SliderView";
import type ISliderView from "../view/SliderView";
import type ISlider from "../model/Slider";


interface ISliderContriller {
  // геттер и сеттер
  value: [number, number] | number;
  setValue(value: number, descriptor: number): void;
}


class SliderController implements ISliderContriller {
  private _view: ISliderView; // view слайдера
  private _slider: ISlider; // модель слайдера
  private _classesOfRollers: [string, string?]; // классы бегунков

  constructor(view: SliderView, slider: Slider) {
    this._view = view;
    this._slider = slider;

    // укажем контекст выполнения для обработчиков
    this._handleContainerPointerdown = this._handleContainerPointerdown.bind(this);
    this._handleDocumentPointermove = this._handleDocumentPointermove.bind(this);
    this._handleContainerPointerup = this._handleContainerPointerup.bind(this);

    // добавим обработчики на события pointerdown, pointermove, pointerup
    this._view.container.addEventListener("pointerdown", this._handleContainerPointerdown);
    this._view.container.addEventListener("pointerup", this._handleContainerPointerup);

    // сохраним значения атрибута class бегунков в кортеж
    this._view.settings.range ?
      this._classesOfRollers = [
        (<HTMLElement>this._view.rollers[0]).className,
        (<HTMLElement>this._view.rollers[1])?.className,
      ] :
      this._classesOfRollers = [(<HTMLElement>this._view.rollers[0]).className];
  }

  // возвращает значения бегунков
  get value(): [number, number] | number {
    return this._slider.value;
  }

  // устанавливает значния бегунков
  setValue(value: number, descriptor: number = 0): void {
    this._view.updateValue(value, descriptor);
    this._slider.setValue(value, descriptor);
  }

  // обработчики событий указателя
  _handleContainerPointerdown(e: Event): void {
    document.addEventListener("pointermove", this._handleDocumentPointermove);

    let target: HTMLElement = e.target as HTMLElement;
    if (target.className === this._classesOfRollers[0]) {
      console.log(this._classesOfRollers);
    }

    if (target.className === this._classesOfRollers[1]) {
      console.log(2)
    }

  }
  _handleDocumentPointermove(e: Event): void {
    console.log("move");
  }
  _handleContainerPointerup(e: Event): void {
    document.removeEventListener("pointermove", this._handleDocumentPointermove);
    console.log("remove");
  }
}


export default SliderController;