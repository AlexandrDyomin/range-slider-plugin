import type { IRoller } from "./Roller";
import type { IScale } from "./Scale";


interface ISlider extends IScale{
  // геттер и сеттер
  value: [number, number] | number;
  setValue(value: number, descriptor: number): void;
};


class Slider implements ISlider {
  constructor(
    private rollers:[IRoller, IRoller?],
    private scale: IScale
  ) {}

  get value(): [number, number] | number  {
    return this.rollers.length === 2 ?
      [this.rollers[0].value, this.rollers[1]!.value] :
      this.rollers[0].value;
  }

  setValue(value: number, descriptor: number): void {
    let isIntoRange: boolean =
      this._checkValue(value, this.scale.minValue, this.scale.maxValue);

    if (isIntoRange) this.rollers[descriptor]!.value = value;
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

  private _checkValue(
    value:number,
    lowerValue:number,
    upperValue: number
  ): boolean {
    let isNotLess: boolean = value >= lowerValue;
    let isNotMore: boolean = value <= upperValue;
    return isNotLess && isNotMore;
  }
}


export default Slider;