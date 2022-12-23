import type { sliderSettings } from "../sliderSettings";

interface IScale {
  calcValue(position: number): number;
  calcSizes(): void;
  getScaleOffset(): number;
  getZeroOffset(): number;
  getStep(): number;
  getScaleSize(): number;
}

type scaleSettings = Pick<sliderSettings, 'min' | 'max' | 'type' | 'step'>;

export type { IScale, scaleSettings };