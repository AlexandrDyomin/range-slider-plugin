interface IRoller {
  // геттер и сеттер
  value: number;
}


class Roller implements IRoller {
  constructor(
    private _value: number = 0
  ) {}

  public get value(): number {
    return this._value
  }

  public set value(value: number) {
    this._value = value;
  }
}


export default Roller;
export type { IRoller };