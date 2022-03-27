const Scale = require("./Scale.ts");


let scale;
beforeAll( () => {
 scale = new Scale(10, -5, 1);
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

  let min;
  let max;

  test("Should be throw Error. Min and max values should not change",
  () => {
    expect(() => scale.setMinValue(10) ).toThrow();
    min = scale.getMinValue();
    max = scale.getMaxValue();
    expect(min).toBe(-5);
    expect(max).toBe(10);
  });

  let scale;
  beforeEach( () => {
    scale = new Scale(10, -5, 1);
  });

  test("The min value should be 0. The max value should not change", () => {
    scale.setMinValue(0);
    min = scale.getMinValue();
    max = scale.getMaxValue();
    expect(min).toBe(0);
    expect(max).toBe(10);
  });

  test("The mim value should be -5. The max value should be 20", () => {
    scale.setMinValue(20);
    min = scale.getMinValue();
    max = scale.getMaxValue();
    expect(min).toBe(-5);
    expect(max).toBe(20);
  });
});


describe("Scale: setMaxValue", () => {
  test("Should be defined", () => {
    expect(scale.setMaxValue).toBeDefined()
  });

});


describe("Scale: setStep", () => {
  test("Should be defined", () => {
    expect(scale.setStep).toBeDefined()
  });

});


describe("Scale: isValidStep", () => {
  test("Should be defined", () => {
    expect(scale.isValidStep).toBeDefined()
  });

});
