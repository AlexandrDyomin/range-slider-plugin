interface IFormElements {
  update(value: string, descriptor: 0 | 1): void;
}

class FormElements implements IFormElements {
  private inputs: NodeList;

  constructor(inputs: NodeList) {
    this.inputs = inputs;
  }

  public update(value: string, descriptor: 0 | 1 = 0): void {
    (<HTMLInputElement>this.inputs[descriptor]).value = value;
  }
}


export  { FormElements, IFormElements };