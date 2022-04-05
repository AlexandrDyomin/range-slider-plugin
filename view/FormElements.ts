interface IFormElements {
  update(value: string, descriptor: 0 | 1): void;
  getInputs(): NodeList;
}


class FormElements implements IFormElements {
  private inputs: NodeList; // контейнер для инпутов

  constructor(container: HTMLElement) {
    this.inputs = document.querySelectorAll(`#${ container.id } .slider > input`);
  }

  public update(value: string, descriptor: 0 | 1 = 0): void {
    (<HTMLInputElement>this.inputs[descriptor]).value = value;
  }

  public getInputs(): NodeList {
    return this.inputs;
  }
}


export type { IFormElements };
export default FormElements;