interface IRoller {
  getValue(): number;
  setValue(value: number): void
}


class Roller implements IRoller {
  constructor(private value: number) {}

  public getValue(): number {
    return this.value;
  }

  public setValue(value: number) {
    this.value = value;
  }
}


export default Roller;
export type { IRoller };