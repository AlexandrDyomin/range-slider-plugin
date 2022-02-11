import type { IScale } from "./Scale";

abstract class ASlider implements IScale  {
  constructor(protected scale: IScale) {}

  protected _checkValue(
    value:number,
    lowerValue:number,
    upperValue: number
  ): boolean {
    let isNotLess: boolean = value >= lowerValue;
    let isNotMore: boolean = value <= upperValue;
    return isNotLess && isNotMore;
  }

  get minValue(): number {
    return this.scale.minValue;
  }

  get maxValue(): number {
    return this.scale.maxValue;
  }

  get step(): number {
    return this.scale.step;
  }

  set minValue(value:number) {
    this.scale.minValue = value;
  }

  set maxValue(value: number) {
    this.scale.maxValue = value
  }

  set step(value: number) {
    this.scale.step = value;
  }
}

export default ASlider;