interface ITemplate {
  getSlider(): HTMLElement;
  getScale(): HTMLElement;
  getRange(): HTMLElement;
  getRollers(): NodeList;
  getInputs(): NodeList;
  getOutputs(): Node[];
}


type templateSettings = {
  min: number,
  max: number,
  step: number,
  type: "horizontal" | "vertical",
  range: boolean,
  values: [number, number] | [number]
  names?: [string, string?]
  prefix?: string,
  grid?: boolean
}


class Template implements ITemplate {
  private slider: HTMLElement;
  private scale: HTMLElement;
  private range: HTMLElement;
  private rollers: NodeList;
  private inputs: NodeList;
  private outputs: Node [];

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
    
    let outputs : Node [] =
      [...container.querySelectorAll(".slider__roller .slider__display"), 
      (container.querySelector(".slider__display_common") as Node)];

    if (
      slider && scale &&
      range && outputs.length &&
      rollers.length > 0 && inputs.length > 0
    ) {
      this.slider = slider;
      this.scale = scale;
      this.range = range;
      this.rollers = rollers;
      this.inputs = inputs;
      this.outputs = outputs;
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

  public getOutputs(): Node [] {
    return this.outputs;
  }

  private getTemplate(settings: templateSettings): string {
    let { range, type, min, max, values, step, names, prefix } = settings;

    return `
      <div class="slider">
        ${ range ?
          `<input class="slider__min-val" value="${values[0]}" name = "${names ? names[0] : ``}">
          <input class="slider__max-val" value="${values[1]}" name = "${names ? names[1] : ``}">` :
          `<input class="slider-default_hidden"
                  type="range" min="${ min }"
                  max="${ max }"
                  value="${values[0]}"
                  name = "${names ? names[0] : ``}">` }

        <div class="slider__scale slider__scale_${ type }">
          <div class="slider__range">
          ${ range ? 
            `<output class="slider__display slider__display_common slider__display_hidden">
                <span class="slider__value"></span> - <span class="slider__value"></span>
            </output>` : ``}
          </div>
          ${ range ?
            `<div class="slider__roller slider__roller_first"><output class="slider__display"></output></div>
            <div class="slider__roller slider__roller_second"><output class="slider__display"></output></div>`:
            `<div class="slider__roller slider__roller_first"><output class="slider__display"></output></div>` }
        </div>
      </div>`;
  }
}


export default Template;
export type { ITemplate, templateSettings };
