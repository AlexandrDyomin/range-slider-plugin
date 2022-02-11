interface IScale{
  // сеттеры и геттеры
  minValue: number;
  maxValue: number;
  step: number;
}


class Scale implements IScale {
  private _minValue: number = 0;
  private _maxValue: number;
  private _step: number = 1;
  private _scaleSize: number;

  constructor(
    maxValue: number,
    minValue: number = 0,
    step: number = 1
  ) {
    if (maxValue === minValue) minValue = this._minValue;

    if (maxValue < minValue) {
      [this._minValue, this._maxValue] = [maxValue, minValue];
    } else {
      this._minValue = minValue;
      this._maxValue = maxValue;
    }

      this._scaleSize = this._maxValue - this._minValue;
      this.step = step;
    };

  get minValue(): number {
    return this._minValue;
  }

  get maxValue(): number {
    return this._maxValue;
  }

  get step(): number {
    return this._step;
  }

  set minValue(value: number) {
    if (value === this._maxValue) return;

    if (value > this._maxValue) {
      [this._minValue, this._maxValue] = [this._minValue, value];
    } else {
      this._minValue = value;
    }

  }

  set maxValue(value: number) {
    if (value === this._minValue) return;

    if (value < this._minValue) {
      [this._minValue, this._maxValue] = [value, this._minValue];
    } else {
      this._maxValue = value;
    }
  }

  set step(value: number) {
    let isValid = this._checkStep(value, this._scaleSize)
    if (isValid) this._step = value;
  }

  private _checkStep(step: number, scaleSize: number): boolean {
    let isPositive: boolean = step > 0;
    let isNoMoreScale: boolean = step <= scaleSize;
    return isPositive && isNoMoreScale;
  }

}

export default Scale;
export type { IScale };