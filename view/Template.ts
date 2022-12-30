import type { ITemplate, templateSettings } from './typingForTemplate';

class Template implements ITemplate {
  private slider: HTMLElement;
  private scale: HTMLElement;
  private range: HTMLElement;
  private rollers: NodeList;
  private inputs: NodeList;
  private outputs: Node [];
  private settings: templateSettings;

  constructor(container: HTMLElement, settings: templateSettings) {
    this.settings = settings;
    container.innerHTML = this.getTemplateForSlider();

    let slider : HTMLElement | null =
      container.querySelector('.slider');

    let scale : HTMLElement | null =
      container.querySelector('.slider__scale');

    let range : HTMLElement | null =
      container.querySelector('.slider__range');

    let rollers : NodeList =
      container.querySelectorAll('.slider__roller');

    let inputs : NodeList =
      container.querySelectorAll('input');
    
    let outputs : Node [] =
      [...container.querySelectorAll('.slider__roller .slider__display'), 
      (container.querySelector('.slider__display_common') as Node)];

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
      throw Error('Не удалось отобразить слайдер на странице');
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

  private getTemplateForSlider(): string {    
    const classNames = this.settings.type === 'vertical' ? 
      'slider slider_vertical' : 'slider';
      
    return `
      <div class='${classNames}'>
        ${this.getTemplateForInputs()}
        <div class='slider__scale slider__scale_${ this.settings.type }'>
          ${this.settings.grid && this.getTemplateForGrid()}
          ${this.getTemplateForRange()}
          ${this.getTemplateForRollers()}
        </div>
      </div>`;
  }

  private getTemplateForInputs(): string {
    const { range, min, max, values, names } = this.settings;
    
    let template: string;
    if (range) {
      template = `
        <input 
          class='slider__min-val' 
          value='${values[0]}' 
          name = '${names ? names[0] : ``}'
        >
        <input 
          class='slider__max-val' 
          value='${values[1]}' 
          name = '${names ? names[1] : ``}'
        >`;
    } else {
      template = `
        <input 
          class='slider-default_hidden'
          type='range' 
          min='${ min }'
          max='${ max }'
          value='${values[0]}'
          name = '${names ? names[0] : ``}'
        >`;
    }

    return template;
  }

  private getTemplateForRange(): string {  
    let template: string;
    if (this.settings.range) {
      template = `
        <div class='slider__range'>
          <output class='slider__display slider__display_common slider__display_hidden'>
              <span class='slider__value'></span> 
              - 
              <span class='slider__value'></span>
          </output>
        </div>`;
    } else {
      template = `<div class='slider__range'></div>`;
    }

    return template;
  }

  private getTemplateForRollers(): string {
    let template: string;
    if (this.settings.range) {
      template = `
        <div class='slider__roller slider__roller_first'>
          <output class='slider__display'></output>
        </div>
        <div class='slider__roller slider__roller_second'>
          <output class='slider__display'></output>
        </div>`;
    } else {
      template =  `
        <div class='slider__roller slider__roller_first'>
          <output class='slider__display'></output>
        </div>`;
    }

    return template;
  }

  private getTemplateForGrid(): string {
    let { min, max } = this.settings;
    let grid: HTMLElement = document.createElement('div');
    grid.className = 'grid';
     
    let numberOfMarks: number = 21;
    for (let i = 0; i < numberOfMarks; i++) {
      let mark: HTMLElement = document.createElement('span');
      mark.className = 'grid__mark';
      grid.append(mark);
    }

    let step: number = (max - min) * 0.25;
    let value: number = min;
    let marks: HTMLCollection = grid.children;
    for(let i = 0; i < numberOfMarks; i += 5) {
      let valueOfMark: HTMLElement = document.createElement('span');
      valueOfMark.textContent = `${value}`;
      valueOfMark.className = 'grid__text';
      marks[i].append(valueOfMark);
      value += step;
    }

    return grid.outerHTML;
  }
}

export default Template;