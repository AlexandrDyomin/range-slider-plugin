interface ITemplate {
  getSlider(): HTMLElement;
  getScale(): HTMLElement;
  getRange(): HTMLElement;
  getRollers(): NodeList;
  getInputs(): NodeList;
  getOutput(): HTMLElement;
}


type templateSettings = {
  min: number,
  max: number,
  step: number,
  type: "horizontal" | "vertical",
  range: boolean,
  values: [number, number] | [number]
}


class Template implements ITemplate {
  private slider: HTMLElement;
  private scale: HTMLElement;
  private range: HTMLElement;
  private rollers: NodeList;
  private inputs: NodeList;
  private output: HTMLElement;

  constructor(container: HTMLElement, settings: templateSettings) {
    container.innerHTML = this.getTemplate(settings);

    let slider : HTMLElement | null =
      container.querySelector(".slider");

    let scale : HTMLElement | null =
      container.querySelector(".slider__scale");

    let range : HTMLElement | null =
      container.querySelector(".slider__range");

    let rollers : NodeList =
      container.querySelectorAll(".slider__roller");

    let inputs : NodeList =
      container.querySelectorAll("input");

    let output : HTMLElement | null =
      container.querySelector(".slider__display");

    if (
      slider && scale &&
      range && output &&
      rollers.length > 0 && inputs.length > 0
    ) {
      this.slider = slider;
      this.scale = scale;
      this.range = range;
      this.rollers = rollers;
      this.inputs = inputs;
      this.output = output;
    } else {
      throw Error("Не удалось отобразить слайдер на странице");
    }

  }

  public getSlider(): HTMLElement {
    return this.slider;
  }

  public getScale(): HTMLElement {
    return this.scale;
  }

  public getRange(): HTMLElement {
    return this.range;
  }

  public getRollers(): NodeList {
    return this.rollers;
  }

  public getInputs(): NodeList {
    return this.inputs;
  }

  public getOutput(): HTMLElement {
    return this.output;
  }

  private getTemplate(settings: templateSettings): string {
    let { range, type, min, max, values, step } = settings;

    return `
      <div class="slider">
        ${ range ?
          `<input class="slider__min-val" value="${values[0]}">
          <input class="slider__max-val" value="${values[1]}">` :
          `<input class="slider-default_hidden"
                  type="range" min="${ min }"
                  max="${ max }"
                  step="${ step }"
                  value="${ values[0] }">` }

        <output class="slider__display"></output>
        <div class="slider__scale slider__scale_${ type }">
          <div class="slider__range"></div>
          ${ range ?
            `<div class="slider__roller slider__roller_first"></div>
            <div class="slider__roller slider__roller_second"></div>`:
            `<div class="slider__roller slider__roller_first"></div>` }
        </div>
      </div>`;
  }
}


export default Template;
export type { ITemplate };