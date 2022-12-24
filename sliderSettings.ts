import type { Slider } from './Slider';

type sliderEvent = {
  values: [number, number] | number,
  positions: [number, number?] 
  slider: Slider,
}

type eventNames = 'slide' | 'change'| 'create' | 'start' | 'stop';

type sliderSettings = {
  min: number,
  max: number,
  step: number,
  type: 'horizontal' | 'vertical',
  range: boolean,
  values:[number, number] | [number],
  names?:  [string, string?],
  prefix?: string,
  grid?: boolean,
  create?(data: sliderEvent): void,
  start?(data: sliderEvent): void,
  slide?(data: sliderEvent): void,
  stop?(data: sliderEvent): void,
  change?(data: sliderEvent): void
};

export type { sliderSettings, eventNames };