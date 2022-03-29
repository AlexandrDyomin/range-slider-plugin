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

      if (maxValue === minValue) throw Error("Некорректный размер шкалы");

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
    if (value === this.maxValue) throw Error("Минимальное значение не должно быть равно максимальному");

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
    if (value === this.minValue) throw Error("Максиимальное значение не должно быть равно минимальному");

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
    if (value < 0) throw Error("Некорректное значение шага");
    this.step = value;
  }
}


module.exports = Scale;
export default Scale;
export type { IScale };