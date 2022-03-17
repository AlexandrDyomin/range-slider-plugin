import type { ISliderModel } from "../model/SliderModel";
import type { ISliderView } from "../view/SliderView";


interface ISliderController {
  getValue(): [number, number] | number;
  setValue(value: number, descriptor: 0 | 1): void;
}


class SliderController implements ISliderController {
  private view: ISliderView; // view слайдера
  private slider: ISliderModel; // модель слайдера
  private classesOfRollers: [string, string?]; // классы бегунков
  private currentRoller: HTMLElement | null = null;

  constructor(view: ISliderView, slider: ISliderModel) {
    this.view = view;
    this.slider = slider;

    // укажем контекст выполнения для обработчиков
    this.handleContainerPointerdown = this.handleContainerPointerdown.bind(this);
    this.handleDocumentPointermove = this.handleDocumentPointermove.bind(this);
    this.handleContainerPointerup = this.handleContainerPointerup.bind(this);

    // добавим обработчики на события pointerdown, pointermove, pointerup
    this.view.getContainer().addEventListener("pointerdown", this.handleContainerPointerdown);
    document.addEventListener("pointerup", this.handleContainerPointerup);

    // сохраним значения атрибута class бегунков в кортеж
    this.view.getSettings().range ?
      this.classesOfRollers = [
        (<HTMLElement>this.view.getRollers()[0]).className,
        (<HTMLElement>this.view.getRollers()[1]).className,
      ] :
      this.classesOfRollers = [(<HTMLElement>this.view.getRollers()[0]).className];
  }

  // возвращает значения бегунков
  public getValue(): [number, number] | number {
    return this.slider.getValue();
  }

  // устанавливает значния бегунков
  public setValue(value: number, descriptor: 0 | 1 = 0): void {
    try {
      this.slider.setValue(value, descriptor);
      this.view.setValue(value, descriptor);
    } catch(e) {
        console.error(e);
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
    // обновим view
    let props = this.view.setValue(e);

    // если бегунок перемещен обновим модель
    if (props) {
      let { value, descriptor } = props;
      this.slider.setValue(value, descriptor);
    }
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
export type { ISliderController };