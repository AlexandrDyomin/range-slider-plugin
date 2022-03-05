import Slider from "../model/Slider";
import SliderView from "../view/SliderView";
import type ISliderView from "../view/SliderView";
import type ISlider from "../model/Slider";


interface ISliderContriller {
  value: [number, number] | number; // геттер
  setValue(value: number, descriptor: number): void; //сеттер
}


class SliderController implements ISliderContriller {
  private view: ISliderView; // view слайдера
  private slider: ISlider; // модель слайдера
  private classesOfRollers: [string, string?]; // классы бегунков
  private currentRoller: HTMLElement | null = null;

  constructor(view: SliderView, slider: Slider) {
    this.view = view;
    this.slider = slider;

    // укажем контекст выполнения для обработчиков
    this.handleContainerPointerdown = this.handleContainerPointerdown.bind(this);
    this.handleDocumentPointermove = this.handleDocumentPointermove.bind(this);
    this.handleContainerPointerup = this.handleContainerPointerup.bind(this);

    // добавим обработчики на события pointerdown, pointermove, pointerup
    this.view.container.addEventListener("pointerdown", this.handleContainerPointerdown);
    document.addEventListener("pointerup", this.handleContainerPointerup);

    // сохраним значения атрибута class бегунков в кортеж
    this.view.settings.range ?
      this.classesOfRollers = [
        (<HTMLElement>this.view.rollers[0]).className,
        (<HTMLElement>this.view.rollers[1]).className,
      ] :
      this.classesOfRollers = [(<HTMLElement>this.view.rollers[0]).className];
  }

  // возвращает значения бегунков
  get value(): [number, number] | number {
    return this.slider.value;
  }

  // устанавливает значния бегунков
  setValue(value: number, descriptor: number = 0): void {
    let isUpdateModel: boolean = this.slider.setValue(value, descriptor);
    if (isUpdateModel) {
      this.view.updateValue(null, value, descriptor);
    }
  }

  // обработчики событий указателя
  private handleContainerPointerdown(e: PointerEvent): void {
    // добавим обработчик на событие pointermove если оно произошло на бегунке
    let target: HTMLElement = e.target as HTMLElement;
    if (this.isRoller(target)) {
      document.addEventListener("pointermove", this.handleDocumentPointermove);
      this.currentRoller = target;
      this.view.takeRoller(target);
    }
  }

  private handleDocumentPointermove(e: PointerEvent): void {
    // let coordinate: number; // координаты по оси X или Y в зависимости от типа слайдера
    // let isHorizontal = this.view.settings.type === "horizontal";
    // isHorizontal ? coordinate = e.clientX : coordinate = e.clientY;

    // let width: number = +getComputedStyle(this.view.container).width.replace("px", ""); // длина слайдера
    // console.log(width)


    // isHorizontal ?
    //   this.currentRoller!.style.left = `${ (coordinate / width) * 100 - (24/ width)*100 }%` :
    //   this.currentRoller!.style.top = `${ coordinate }px`;
    // console.log(e)
    this.view.updateValue(e);
  }

  private handleContainerPointerup(e: PointerEvent): void {
    // удалим обработчик на событие pointermove есди оно произашло на бегунке
    document.removeEventListener("pointermove", this.handleDocumentPointermove);
    this.view.throwRoller(this.currentRoller!);
  }

  private isRoller(target: HTMLElement): boolean {
    let isFirstRoller = target.className === this.classesOfRollers[0];
    let isSecondRoller = target.className === this.classesOfRollers[1];
    return isFirstRoller || isSecondRoller;
  }
}


export default SliderController;