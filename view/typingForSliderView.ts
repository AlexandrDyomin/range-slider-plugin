import type { sliderSettings } from '../sliderSettings';

interface ISliderView {
  update(
    value: number | PointerEvent,
    descriptor?: 0 | 1
  ): {value: number, descriptor: 0 | 1} | null;
  getRollers(): NodeList;
  getSlider(): HTMLElement;
  getSettings(): sliderSettings;
  takeRoller(roller: HTMLElement | PointerEvent): void;
  throwRoller(roller: HTMLElement): void;
  getScale(): HTMLElement;
  getRange(): HTMLElement;
  getInputs(): NodeList;
  getOutputs(): Node [];
}

export type { ISliderView };