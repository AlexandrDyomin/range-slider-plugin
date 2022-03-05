import type { IRoller } from "./Roller";
import type { IScale } from "./Scale";


interface ISlider extends IScale{
  getValue(): [number, number] | number;
  setValue(value: number, descriptor: number): void;
};


class Slider implements ISlider {
  constructor(
    private rollers:[IRoller, IRoller?],
    private scale: IScale
  ) {
      this.rollers.forEach(roller => {
        let isValid: boolean = this.checkValue(roller!.getValue(), this.scale.getMinValue(), this.scale.getMaxValue() )
        if (!isValid) {
          throw Error("Некорректное значение бегунка")
        }
      });
  }

  getValue(): [number, number] | number  {
    return this.rollers.length === 2 ?
      [this.rollers[0].getValue(), this.rollers[1]!.getValue()] :
      this.rollers[0].getValue();
  }

  setValue(value: number, descriptor: number): boolean {
    let isIntoRange: boolean =
      this.checkValue(value, this.scale.getMinValue(), this.scale.getMaxValue() );

    if (isIntoRange) {
      this.rollers[descriptor]!.setValue(value);
      return true;
    }

    return false;
  }

  getMinValue(): number {
    return this.scale.getMinValue();
  }

  getMaxValue(): number {
    return this.scale.getMaxValue();
  }

  getStep(): number {
    return this.scale.getStep();
  }

  setMinValue(value:number) {
    this.scale.setMinValue(value);
  }

  setMaxValue(value: number) {
    this.scale.setMaxValue(value);
  }

  setStep(value: number) {
    this.scale.setStep(value);
  }

  private checkValue(
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
export type { ISlider };