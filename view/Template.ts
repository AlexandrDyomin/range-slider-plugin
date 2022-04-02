import type { sliderSettings } from "../Slider";


interface ITemplate {
  getTemplate(): string;
}


class Template implements ITemplate {
  private settings: sliderSettings;

  constructor(settings: sliderSettings) {
    this.settings = settings;
  }

  public getTemplate(): string {
    let { range, type, min, max, value, values, step } = this.settings;
    
    return ` 
      <div class="slider">
        ${ range ?
             `<input class="slider__min-val" value="${values![0]}">
             <input class="slider__max-val" value="${values![1]}">` :
             `<input class="slider-default_hidden"
                     type="range" min="${ min }"
                     max="${ max }"
                     step="${ step }"
                     value="${ value }">` }

        <output class="slider__display"></output>
        <div class="slider__scale slider__scale_${ type }">
          <div class="slider__range"></div>
          ${ range ?
               `<div class="slider__roller slider__roller_first"></div>
               <div class="slider__roller slider__roller_second"></div>`:
               `<div class="slider__roller slider__roller_first"></div>` }
        </div>
      </div>
    `; 
  }
}


export default Template;
export type { ITemplate };
