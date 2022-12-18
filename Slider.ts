import Scale from"./model/Scale";
import Roller from "./model/Roller";
import SliderView from "./view/SliderView";
import SliderModel from "./model/SliderModel";
import SliderController from "./controller/SliderController";
import type { ISliderController  } from "./controller/SliderController";
import type { templateSettings } from "./view/Template";


// тип настроек слайдера
type sliderSettings = {
  min: number,
  max: number,
  step: number,
  type: "horizontal" | "vertical",
  range: boolean,
  values:[number, number] | [number],
  names?:  [string, string?],
  prefix?: string,
  grid?: boolean
  create?(data: {
    inputs: [HTMLInputElement, HTMLInputElement?],
    container: HTMLElement,
    slider: Slider,
    positions: [number, number?]

  }): void,
  // start(event: Event, ui: SliderController): void,
  // slide(event: Event, ui: SliderController): void,
  // stop(event: Event, ui: SliderController): void,
  // change(event: Event, ui: SliderController): void
};


class Slider implements ISliderController {
  private controller: ISliderController;

  constructor(container: string, userSettings: object) {
    let defaultSettings: sliderSettings = {
      min: 0,
      max: 100,
      step: 1,
      type: "horizontal",
      range: false,
      values: [50],
      // create(event: Event, ui: SliderController): void{},
      // start(event: Event, ui: SliderController): void{},
      // slide(event: Event, ui: SliderController): void{},
      // stop(event: Event, ui: SliderController): void{},
      // change(event: Event, ui: SliderController): void{}
    };

    let settings: sliderSettings;
    // объединим дефолтные настройки с пользовательскими
    settings = { ...defaultSettings, ...userSettings };
    
    // если пользователь перепутал поля для минимального и
    // максимального значений шкалы поменяем занчения местами
    let isWrongOrder: boolean = settings.min > settings.max;
    if (isWrongOrder) {
      [settings.min, settings.max] = [settings.max, settings.min];
    }
    
    // зададим значения слайдера
    if (settings.range && settings.values.length === 1) {
      settings.values = [settings.min, settings.max];
    }

    if (!settings.range && settings.values === defaultSettings.values){
      settings.values = [settings.max / 2  + ( (settings.min - 0) / 2)];
    }

    // если слайдер с диапазоном создадим два бегунка, иначе один
    let rollers: [Roller, Roller?];
    settings.range && settings.values.length === 2 ?
      rollers = [new Roller(settings.values[0]), new Roller(settings.values[1]) ] :
      rollers = [new Roller(settings.values[0])];

    // создадим шкалу
    let scale: Scale = new Scale(settings.max, settings.min, settings.step);

    // создадим модель слайдера
    let sliderModel: SliderModel = new SliderModel(rollers, scale);

    // контейнер для инициализации слайдера
    let $container: HTMLElement | null = document.getElementById(container);

    // создадим view и контроллер если $container существует
    if ($container) {
      let view = new SliderView($container, settings);
      this.controller = new SliderController(view, sliderModel);
    } else {
      throw Error(`не найден контейнер c id "${container}"`);
    }
  }

  public getValue(): [number, number] | number {
    return this.controller.getValue();
  }

  public setValue(value: number, descriptor: 0 | 1 = 0): void {
    this.controller.setValue(value, descriptor);
  }
}


export default Slider;
export type { sliderSettings };