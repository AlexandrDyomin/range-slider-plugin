import ASlider from "./ASlider";
import type { IRoller } from "./Roller";
import type { IScale } from "./Scale";


interface ISimpleSlider extends ASlider, IRoller {};


class SimpleSlider extends ASlider implements ISimpleSlider {
  constructor(
    private roller:IRoller,
    scale: IScale
  ) {
      super(scale);
    }

  get value(): number {
    return this.roller.value;
  }

  set value(value:number) {
    let isIntoRange: boolean =
      super._checkValue(value, this.scale.minValue, this.scale.maxValue);

    if (isIntoRange) this.roller.value = value;
  }
}


export default SimpleSlider;
export type { ISimpleSlider };