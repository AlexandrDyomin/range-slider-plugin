const Roller = require("./Roller.ts");


let roller;
beforeAll( () => {
  roller = new Roller(0);
});


describe("Roller: getValue", () => {
 test("Should be defined", () => {
   expect(roller.getValue).toBeDefined();
 });

  test("Should be return 0", () => {
    expect(roller.getValue() ).toBe(0);
  });
});


describe("Roller: setValue", () => {
  test("Should be defined", () => {
    expect(roller.setValue).toBeDefined();
  });

 test("Value should be 5", () => {
   roller.setValue(5);
   let result = roller.getValue()
   expect(result).toBe(5);
 });
})


