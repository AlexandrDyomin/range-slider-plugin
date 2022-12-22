import type { sliderSettings } from '../sliderSettings';

interface ITemplate {
  getSlider(): HTMLElement;
  getScale(): HTMLElement;
  getRange(): HTMLElement;
  getRollers(): NodeList;
  getInputs(): NodeList;
  getOutputs(): Node[];
}

type templateSettings = Pick<
  sliderSettings, 'min' | 'max' | 'type' | 'values' | 'names' | 'range' | 'grid'
>;

export type { ITemplate, templateSettings };