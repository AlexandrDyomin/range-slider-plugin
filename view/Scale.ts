import { sliderSettings } from "../Slider";

interface IScale {
  paint(startPos: number, endPos: number): void;
  calcValue(position: number): number;
  calcSizes(): void;
  getScale(): HTMLElement;
  getRange(): HTMLElement;
  getScaleOffset(): number;
  getZeroOffset(): number;
  getStep(): number;
  getScaleSize(): number;
}


class Scale implements IScale {
  private settings: sliderSettings;
  private scale: HTMLElement; // шкала
  private range: HTMLElement; // закрашиваемая часть шкалы
  private rollerSize: number;
  private scaleSize: number;  // ширина(высота) шкалы, px
  private zeroOffset: number; // смещение нуля на шкале, px
  private scaleOffset: number; // смещение шкалы относительно окна, px
  private step: number;     // размер шага, px

  constructor(
    settings: sliderSettings,
    scale: HTMLElement,
    range: HTMLElement,
    rollerSize: number
  ) {
    this.settings = settings;
    this.scale = scale;
    this.range = range;
    this.rollerSize = rollerSize;
    this.scaleSize = this.calcScaleSize();
    this.zeroOffset = this.caclZeroOffset();
    this.scaleOffset = this.calcScaleOffset();
    this.step = this.calcStep();
  }

  public getScaleOffset(): number {
    return this.scaleOffset;
  }

  public getScale(): HTMLElement {
    return this.scale;
  }

  public getZeroOffset(): number {
    return this.zeroOffset;
  }

  public getRange(): HTMLElement {
    return this.range;
  }

  public getStep(): number {
    return this.step;
  }

  public getScaleSize(): number {
    return this.scaleSize;
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

     return value;
  }

  public calcSizes(): void {
    this.scaleSize = this.calcScaleSize();
    this.zeroOffset = this.caclZeroOffset();
    this.scaleOffset = this.calcScaleOffset();
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
}


export type { IScale };
export default Scale;