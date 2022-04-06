import { sliderSettings } from "../Slider";

interface IScale {
  paint(startPos: number, endPos: number): void;
  calcValue(position: number): number;
  calcSizes(): void;
  getScaleOffset(): number;
  getZeroOffset(): number;
  getStep(): number;
  getScaleSize(): number;
}


type sacleSettings = {
  min: number,
  max: number,
  type: "vertical" | "horizontal"
}


class Scale implements IScale {
  private step: number;                  // размер шага, px
  private scaleSize: number;             // ширина(высота) шкалы, px
  private scale: HTMLElement;
  private range: HTMLElement;            // закрашиваемая часть шкалы
  private rollerSize: number;
  private zeroOffset: number;            // смещение нуля на шкале, px
  private scaleOffset: number;           // смещение шкалы относительно окна, px
  private settings: sliderSettings;
  private numberOfDecimalPlaces: number; // максимальное количество знаков, отображаемых после запятой

  constructor(
    scale: HTMLElement,
    range: HTMLElement,
    rollerSize: number,
    settings: sliderSettings
  ) {
    this.settings = settings;
    this.scale = scale;
    this.range = range;
    this.rollerSize = rollerSize;
    this.scaleSize = this.calcScaleSize();
    this.zeroOffset = this.caclZeroOffset();
    this.scaleOffset = this.calcScaleOffset();
    this.step = this.calcStep();
    this.numberOfDecimalPlaces = this.countDecimalPlaces(settings.step);
  }

  public paint(startPos: number, endPos: number): void {
    if (this.settings.type === "horizontal"){
      this.range.style.left = `${ startPos }px`;
      this.range.style.right = `${ endPos }px`;
    } else {
      this.range.style.bottom = `${ startPos }px`;
      this.range.style.top = `${ endPos }px`;
    }
  }

  public calcValue(position: number): number {
    // вычислим значение ролика
    let value: number = position / this.scaleSize;
    value = value * (this.settings.max - this.settings.min);

    let offset = this.settings.min - 0;
    value += offset;

    if (this.settings.type === "vertical") {
      value = this.settings.max - value + offset;
    }

    return this.roundValue(value);
 }

  public calcSizes(): void {
    this.scaleSize = this.calcScaleSize();
    this.zeroOffset = this.caclZeroOffset();
    this.scaleOffset = this.calcScaleOffset();
  }

  public getScaleOffset(): number {
    return this.scaleOffset;
  }

  public getZeroOffset(): number {
    return this.zeroOffset;
  }

  public getStep(): number {
    return this.step;
  }

  public getScaleSize(): number {
    return this.scaleSize;
  }

  private calcStep(): number {
    return this.settings.step /
      (this.settings.max - this.settings.min) * this.scaleSize;
  }

  private caclZeroOffset(): number {
    return (this.settings.min - 0) /
      (this.settings.max - this.settings.min) * this.scaleSize;
  }

  private calcScaleOffset(): number {
    if (this.settings.type === "horizontal") {
      return this.scale.getBoundingClientRect().left;
    }

    return this.scale.getBoundingClientRect().top;
  }

  private calcScaleSize(): number {
    if (this.settings.type === "vertical") {
      return this.scale.offsetHeight - this.rollerSize;
    }

    return this.scale.offsetWidth - this.rollerSize;
  }

  private countDecimalPlaces(value: number): number {
    let integerAndDecimal: string[] = value.toString().split(".");
    if (integerAndDecimal.length === 1) return 1;
    return value.toString().split(".")[1].length;
  }

  private roundValue(value: number): number {
    let x = Math.pow(10, this.numberOfDecimalPlaces);
    return Math.round(value * x) /x;
  }
}


export type { IScale, sacleSettings };
export default Scale;