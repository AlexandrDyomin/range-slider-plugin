// import type { Slider } from './Slider';


type sliderSettings = {
  min: number,
  max: number,
  step: number,
  type: 'horizontal' | 'vertical',
  range: boolean,
  values:[number, number] | [number],
  names?:  [string, string?],
  prefix?: string,
  grid?: boolean
  // create?(data: {
  //   inputs: HTMLInputElement[],
  //   container: HTMLElement,
  //   slider: Slider,
  //   positions: [number, number?]

  // }): void,
  // start(event: Event, ui: SliderController): void,
  // slide(event: Event, ui: SliderController): void,
  // stop(event: Event, ui: SliderController): void,
  // change(event: Event, ui: SliderController): void
};

export type { sliderSettings };