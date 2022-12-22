const Scale = require("./Scale.ts");

describe("Scale: constructor", () => {
  test("Should be throw error", () => {
    expect( () => new Scale({ max:10, min:0, step: -4 }) ).toThrow();
    expect( () => new Scale({ max:10, min:10, step: -1 }) ).toThrow();
  });
});


let scale;
beforeAll( () => {
 scale = new Scale({ max:10, min:-5, step: 1 });
});


describe("Scale: getMinValue ", () => {
  test("Should be defined", () => {
    expect(scale.getMinValue).toBeDefined()
  });

  test("Should  be return -5", () => {
    expect(scale.getMinValue() ).toBe(-5);
  });
});


describe("Scale: getMaxValue", () => {
  test("Should be defined", () => {
    expect(scale.getMaxValue).toBeDefined()
  });

  test("Should  be return 10", () => {
    expect(scale.getMaxValue() ).toBe(10);
  });
});


describe("Scale: getStep", () => {
  test("Should be defined", () => {
    expect(scale.getStep).toBeDefined()
  });

  test("Should  be return 1", () => {
    expect(scale.getStep() ).toBe(1);
  });
});


describe("Scale: setMinValue", () => {
  test("Should be defined", () => {
    expect(scale.setMinValue).toBeDefined()
  });

  test("Should be throw Error. Min and max values should not change", () => {
    expect(() => scale.setMinValue(10) ).toThrow();
    expect(scale.getMinValue() ).toBe(-5);
    expect(scale.getMaxValue() ).toBe(10);
  });

  let scale;
  beforeEach( () => {
    scale = new Scale({ max:10, min:-5,step:  1 });
  });

  test("The min value should be 0. The max value should not change", () => {
    scale.setMinValue(0);
    expect(scale.getMinValue() ).toBe(0);
    expect(scale.getMaxValue() ).toBe(10);
  });

  test("The mim value should be -5. The max value should be 20", () => {
    scale.setMinValue(20);
    expect(scale.getMinValue() ).toBe(-5);
    expect(scale.getMaxValue() ).toBe(20);
  });
});


describe("Scale: setMaxValue", () => {
  test("Should be defined", () => {
    expect(scale.setMaxValue).toBeDefined()
  });

  test("Should be throw Error. Min and max values should not change",
  () => {
    expect( () => scale.setMaxValue(-5) ).toThrow();
    expect(scale.getMinValue() ).toBe(-5);
    expect(scale.getMaxValue() ).toBe(10);
  });

  let scale;
  beforeEach( () => {
    scale = new Scale({ max:10, min:-5,step:  1 });
  });

  test("The max value should be 0. The min value should not change", () => {
    scale.setMaxValue(0);
    expect(scale.getMinValue() ).toBe(-5);
    expect(scale.getMaxValue() ).toBe(0);
  });

  test("The max value should be -9. The min value should be 20", () => {
    scale.setMaxValue(-9);
    expect(scale.getMinValue() ).toBe(-9);
    expect(scale.getMaxValue() ).toBe(-5);
  });
});


describe("Scale: setStep", () => {
  test("Should be defined", () => {
    expect(scale.setStep).toBeDefined()
  });

  test("The step should be 0.5", () => {
    scale.setStep(0.5);
    expect(scale.getStep() ).toBe(0.5);
  });

  test("The step should be 0.1", () => {
    scale.setStep(0.1);
    expect(scale.getStep() ).toBe(0.1);
  });

  test("The step should be 15", () => {
    scale.setStep(15);
    expect(scale.getStep() ).toBe(15);
  });

  test("Should be throw error. The step should be 0.5", () => {
    expect( () => scale.setStep(-2) ).toThrow();
    expect( () => scale.setStep(-1) ).toThrow();
    expect( () => scale.setStep(-0.5) ).toThrow();
    expect(scale.getStep() ).toBe(15);
  });
});