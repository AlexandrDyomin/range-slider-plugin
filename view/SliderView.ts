interface ISliderView {
  updateValue(value: number): void;
}


class SliderView implements ISliderView {
  private _template: string ;
  private _roller: HTMLElement;

  constructor(private _type:string, private _container: HTMLElement){
    this._template = this._getTemplate();
    this._render();
    this._roller! = _container.querySelector(".roller")!;
  }

  private _render(): void {
    this._container.innerHTML = this._template;
  }

  private _getTemplate(): string {
    let modifier: string;
    switch (this._type) {
      case "vertical":
        modifier = "slider__scale_vertical";
        break;
      case "circle":
        modifier = "slider__scale_circle";
        break;
      default: modifier = "slider__scale_horizontal";
    }

    return `<div class="slider">
      <div class="slider__scale ${modifier}">
        <div class="slider__range"></div>
        <div class="slider__roller"></div>
      </div>
      <output class="slider__display"></output>
      </div>`;
  }

  updateValue(value: number): void {

  }
}