import SliderController from "./controller/SliderContrller";
import slider from "./factory/slider";


let sl: SliderController = slider("sl", {
  range: true,
  min: 50,
  max: 0,
  values: [40,10],
  step:10,
  type: "vertical"
});