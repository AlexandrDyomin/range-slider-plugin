import Scale from"../model/Scale";
import Roller from "../model/Roller";
import Slider from "../model/Slider";
import SliderView from "../view/SliderView";
import SliderController from "../controller/SliderContrller";

// тип настроек слайдера
type sliderSettings = {
  min?: number,
  max?: number,
  step?: number,
  type?: "horizontal" | "vertical",
  range?: boolean,
  value?: number,
  values? :[number, number],
  // create?(event: Event, ui: SliderController): void,
  // start?(event: Event, ui: SliderController): void,
  // slide?(event: Event, ui: SliderController): void,
  // stop?(event: Event, ui: SliderController): void,
  // change?(event: Event, ui: SliderController): void
};

function slider(container: string, settings: sliderSettings = {}) {
  // дефолтные настройки слайдера
  let defaultSettings: sliderSettings = {
    min: 0,
    max: 100,
    step: 1,
    type: "horizontal",
    range: false,
    // create(event: Event, ui: SliderController): void{},
    // start(event: Event, ui: SliderController): void{},
    // slide(event: Event, ui: SliderController): void{},
    // stop(event: Event, ui: SliderController): void{},
    // change(event: Event, ui: SliderController): void{}
  };

  // зададим  дефолтное значение слайдера
  if (settings.range) {
    defaultSettings.values = [defaultSettings.min!, defaultSettings.max!];
  } else {
    defaultSettings.value = 50;
  }

  // если пользователь перепутал поля для минимального и
  // максимального значений шкалы поменяем занчения местами
  if (settings.min && settings.max && settings.min > settings.max) {
    [settings.min, settings.max] = [settings.max, settings.min];
  }

  // если порядок занчений бегунков неверный поменяим занчения местами
  if (settings.values && settings.values[0] > settings.values[1]) {
    settings.values.reverse();
  };

  // объединим дефолтные настройки с пользовательскими
  settings = { ...defaultSettings, ...settings };

  // если слайдер с диапазоном создадим два бегунка, иначе один
  let rollers: [Roller, Roller?];
  settings.range ?
    rollers = [new Roller(settings.values![0]), new Roller(settings.values![1]) ] :
    rollers = [new Roller(settings.value!)];

  // создадим шкалу
  let scale: Scale = new Scale(settings.max!, settings.min!, settings.step!);

  // создадим слайдер
  let slider: Slider = new Slider(rollers, scale);

  // контейнер для инициализации слайдера
  let $container: HTMLElement | null = document.getElementById(container);

  // создадим view и контроллер если $container существует
  if ($container) {
    let view = new SliderView($container, settings);
    return new SliderController(view, slider);
  } else {
    throw Error(`не найден контейнер c id "${container}"`);
  }
}


export default slider;
export type { sliderSettings };