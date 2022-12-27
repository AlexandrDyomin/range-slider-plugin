import type { sliderSettings } from '../sliderSettings';

interface ISliderView {
  update(
    value: number | PointerEvent | TouchEvent,
    descriptor?: 0 | 1
  ): {value: number, descriptor: 0 | 1} | null;
  getRollers(): NodeList;
  getSlider(): HTMLElement;
  getSettings(): sliderSettings;
  takeRoller(roller: HTMLElement | PointerEvent | TouchEvent): void;
  throwRoller(roller: HTMLElement): void;
  getScale(): HTMLElement;
  getRange(): HTMLElement;
  getInputs(): NodeList;
  getOutputs(): Node [];
  getRollersPositions(): [number, number?];
  getDescriptor(): 0 | 1;
}

export type { ISliderView };