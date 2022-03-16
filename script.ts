import SliderController from "./controller/SliderController";
import Slider from "./Slider";


let sl: Slider = new Slider("sl", {
  range: true,
  min: 0,
  max: 100,
  values: [0, 100],
  step: 20,
});

// type: "vertical"


// setTimeout( () => {
//   console.log(sl.getValue());
// }, 3000)