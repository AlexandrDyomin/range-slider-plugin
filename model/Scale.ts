interface IScale{
  getMinValue(): number;
  setMinValue(value: number): void;
  getMaxValue(): number;
  setMaxValue(value: number): void;
  getStep(): number;
  setStep(value: number): void
}


class Scale implements IScale {
  private minValue: number = 0;
  private maxValue: number;
  private step: number = 1;
  private scaleSize: number;

  constructor(
    maxValue: number,
    minValue: number,
    step: number
  ) {
      if (maxValue - minValue === 0) {
        throw Error("Некорректный размер шкалы");
      }

      if (maxValue === minValue) minValue = this.minValue;

      if (maxValue < minValue) {
        [this.minValue, this.maxValue] = [maxValue, minValue];
      } else {
        this.minValue = minValue;
        this.maxValue = maxValue;
      }

        this.scaleSize = this.maxValue - this.minValue;
        this.setStep(step);
    };

  public getMinValue(): number {
    return this.minValue;
  }

  public setMinValue(value: number) {
    if (value === this.maxValue) return;

    if (value > this.maxValue) {
      [this.minValue, this.maxValue] = [this.minValue, value];
    } else {
      this.minValue = value;
    }
  }

  public getMaxValue(): number {
    return this.maxValue;
  }

  public setMaxValue(value: number) {
    if (value === this.minValue) return;

    if (value < this.minValue) {
      [this.minValue, this.maxValue] = [value, this.minValue];
    } else {
      this.maxValue = value;
    }
  }

  public getStep(): number {
    return this.step;
  }

  public setStep(value: number): void {
    let isValid = this.isValidStep(value, this.scaleSize);
    if (!isValid) throw Error("Некорректное значение шага");
    this.step = value;
  }

  private isValidStep(step: number, scaleSize: number): boolean {
    let isPositive: boolean = step > 0;
    let isDivided = this.maxValue - (+(this.maxValue  / step).toFixed(1) * step) === 0;
    return isPositive && isDivided;
  }
}

export default Scale;
export type { IScale };