import Roller from "../model/Roller";
import Scale from"../model/Scale";
import Slider from "../model/Slider";

// тип настроек слайдера
type sliderSettings = {
  min?: number,
  max?: number,
  step?: number,
  type?: "horizontal" | "vertical",
  range?: boolean,
  value?: number,
  values? :[number, number],
  create?(event: Event, ui: SliderController): void,
  start?(event: Event, ui: SliderController): void,
  slide?(event: Event, ui: SliderController): void,
  stop?(event: Event, ui: SliderController): void,
  change?(event: Event, ui: SliderController): void
};

function slider(container: string, settings: sliderSettings) {
  // дефолтные настройки слайдера
  let defaultSettings: sliderSettings = {
    min: 0,
    max: 100,
    step: 1,
    type: "horizontal",
    range: false,
    value: 50,
    create(event: Event, ui: SliderController): void{},
    start(event: Event, ui: SliderController): void{},
    slide(event: Event, ui: SliderController): void{},
    stop(event: Event, ui: SliderController): void{},
    change(event: Event, ui: SliderController): void{}
  };

  // если слайдер с диапазоном зададим значения для бегунков
  if (settings.range === true) {
    defaultSettings.values = [defaultSettings.min!, defaultSettings.max!];
  }

  // объединим дефолтные настройки с пользовательскими
  settings = { ...defaultSettings, ...settings };

  let rollers: [Roller, Roller?]; // массив с бегунками
  // если слайдер с диапазоном создадим два бегунка, иначе один
  settings.range ?
    rollers = [new Roller(settings.values![0]), new Roller(settings.values![1]) ] :
    rollers = [new Roller(settings.value)];

  // создадим шкалу
  let scale: Scale = new Scale(settings.max!, settings.min!, settings.step!);

  // создадим слайдер
  let slider: Slider = new Slider(rollers, scale);

  // создадим view слайдера

  // создадим контроллер слайдера

  // возвратим контроллер





}


export type { sliderSettings };