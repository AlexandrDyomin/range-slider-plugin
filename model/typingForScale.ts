import type { sliderSettings } from '../sliderSettings';

interface IScale{
  getMinValue(): number;
  setMinValue(value: number): void;
  getMaxValue(): number;
  setMaxValue(value: number): void;
  getStep(): number;
  setStep(value: number): void
}

type scaleSettings = Pick<sliderSettings, 'min' | 'max' | 'step'>;

export type { IScale , scaleSettings };