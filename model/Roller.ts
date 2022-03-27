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


module.exports = Roller;
export type { IRoller };
