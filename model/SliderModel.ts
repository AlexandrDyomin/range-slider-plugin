import type { IRoller } from "./Roller";
import type { IScale } from "./typingForScale";

interface ISliderModel extends IScale{
  getValue(): [number, number] | number;
  setValue(value: number, descriptor: 0 | 1): void;
};

class SliderModel implements ISliderModel {
  constructor(
    private rollers:[IRoller, IRoller] | [IRoller],
    private scale: IScale
  ) {
      this.rollers.forEach( (roller, i) => {
        let isValid: boolean = this.checkValue(roller.getValue(), i)
        if (!isValid) {
          throw Error("Некорректное значение бегунка")
        }
      });
  }

  getValue(): [number, number] | number  {
    return this.rollers.length === 2 ?
      [this.rollers[0].getValue(), this.rollers[1].getValue()] :
      this.rollers[0].getValue();
  }

  setValue(value: number, descriptor: 0 | 1) {
    let isIntoRange: boolean =
      this.checkValue(value, descriptor);

    if (isIntoRange ) {
      this.rollers[descriptor]?.setValue(value);
    } else {
      throw Error("Некорректное значение бегунка");
    }
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

  private checkValue(value:number, descriptor: number): boolean {
    let min: number;
    let max: number;

    if (this.rollers[1]) {
      if (descriptor === 0) {
        min = this.scale.getMinValue();
        max = this.rollers[1].getValue();
      } else {
        min = this.rollers[0].getValue();
        max = this.scale.getMaxValue();
      }
    } else {
      min = this.scale.getMinValue();
      max = this.scale.getMaxValue();
    }

    let isNotLess: boolean = value >= min;
    let isNotMore: boolean = value <= max;
    return isNotLess && isNotMore;
  }
}

export default SliderModel;
export type { ISliderModel };