interface IFormElements {
  update(value: string, descriptor: 0 | 1): void;
}


class FormElements implements IFormElements {
  private inputs: NodeList; // контейнер для инпутов

  constructor(inputs: NodeList) {
    this.inputs = inputs;
  }

  public update(value: string, descriptor: 0 | 1 = 0): void {
    (<HTMLInputElement>this.inputs[descriptor]).value = value;
  }
}


export type { IFormElements };
export default FormElements;