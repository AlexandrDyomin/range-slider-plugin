import type { sliderSettings } from '../sliderSettings';

interface IOutputs {
  updateOutputs(descriptor: 0 | 1, value: number): void;
  rerenderOutputs(): void;
}

type outputSettings = Pick<sliderSettings, 'range' | 'type' | 'prefix'>;

export { IOutputs, outputSettings };