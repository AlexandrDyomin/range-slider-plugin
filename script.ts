import Slider from "./Slider";
import "./view/SliderView.scss";


let h: Slider = new Slider("h", {
  min: -50,
  max: 100,
});

let hr: Slider = new Slider("hr", {
  range: true,
  step: 0.5,
  min: -50,
  max: 50,
});

let v: Slider = new Slider("v", {
  min: 0,
  max: 100,
  step: 50,
  type: "vertical"
});

let vr: Slider = new Slider("vr", {
  range: true,
  min: 0,
  max: 100,
  step: 1,
  values: [1.5, 90.5],
  type: "vertical"
});
