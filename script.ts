import SliderController from "./controller/SliderContrller";
import slider from "./factory/slider";


let sl: SliderController = slider("sl", {
  range: true,
  min: 0,
  max: 50,
  values: [0,25],
  step:10,
});
// type: "vertical"