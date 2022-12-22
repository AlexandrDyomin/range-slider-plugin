import type { IScale, scaleSettings } from './typingForScale';

class Scale implements IScale {
  private min: number = 0;
  private max: number;
  private step: number = 1;

  constructor(settings: scaleSettings) {
    let { min, max, step } = settings;

    if (max === min) throw Error("Некорректный размер шкалы");

    if (max < min) {
      [this.min, this.max] = [max, min];
    } else {
      this.min = min;
      this.max = max;
    }

    this.setStep(step);
  };

  getMinValue(): number {
    return this.min;
  }

  setMinValue(value: number) {
    if (value === this.max) throw Error("Минимальное значение не должно быть равно максимальному");

    if (value > this.max) {
      [this.min, this.max] = [this.min, value];
    } else {
      this.min = value;
    }
  }

  getMaxValue(): number {
    return this.max;
  }

  setMaxValue(value: number) {
    if (value === this.min) throw Error("Максиимальное значение не должно быть равно минимальному");

    if (value < this.min) {
      [this.min, this.max] = [value, this.min];
    } else {
      this.max = value;
    }
  }

  getStep(): number {
    return this.step;
  }

  setStep(value: number): void {
    if (value < 0) throw Error("Некорректное значение шага");
    this.step = value;
  }
}

module.exports = Scale;
export default Scale;