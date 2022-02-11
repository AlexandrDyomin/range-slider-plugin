import ASlider from "./ASlider";
import type  { IRoller } from "./Roller";
import type { IScale } from "./Scale";

interface IRangeSlider {
  // геттеры и сеттеры
  lowerValue: number;
  upperValue: number;
}


class RangeSlider extends ASlider implements IRangeSlider {
  private firstRoller: IRoller;
  private secondRoller: IRoller;

  constructor(
    firstRoller: IRoller,
    secondRoller: IRoller,
    scale: IScale
  ) {
      super(scale);
      this.firstRoller = firstRoller;
      this.secondRoller = secondRoller;
    }

  get lowerValue(): number {
    return this.firstRoller.value;
  }

  get upperValue(): number{
    return this.secondRoller.value;
  }

  set lowerValue(value: number) {
    // обновляем значение если новое значение бегунка не меньше минимально
    // допустимого значения и не больше значения второго бегунка
    let isIntoRange: boolean = super._checkValue(value, this.minValue, this.upperValue);

    if(isIntoRange) this.firstRoller.value = value;
  }

  set upperValue(value: number) {
    // обновляем значение если новое значение бегунка не больше максимально
    // допустимого значения и не меньше значения первого бегунка
    let isIntoRange: boolean = super._checkValue(value, this.lowerValue, this.maxValue);

    if(isIntoRange) this.secondRoller.value = value;
  }
}


export default RangeSlider;
export type { IRangeSlider };