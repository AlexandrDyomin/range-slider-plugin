import SliderController from "./controller/SliderController";
import Slider from "./Slider";


let sl: Slider = new Slider("sl", {
  range: true,
  min: 0,
  max: 100,
  values: [50, 100],
  step: 1,
  type: "vertical"
});

// sl.setValue(95, 0);
// sl.setValue(94, 1);

// let value = sl.getValue();
// console.log(value)