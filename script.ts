import Slider from "./Slider";
import "./view/SliderView.scss";


let h: Slider = new Slider("h", {
  min: -50,
  max: 100,
  values: [10],
  names: ["qwe"],
  prefix: "$",
  grid: true,
  step: 10
});

let hr: Slider = new Slider("hr", {
  range: true,
  step: 5,
  min: -50,
  max: 50,
  values: [-20, 0],
  names: ["ddd", "sssdsd"],
  prefix: "$",
  grid: true,
});

let v: Slider = new Slider("v", {
  min: 0,
  max: 100,
  type: "vertical",
  grid: true

});

let vr: Slider = new Slider("vr", {
  range: true,
  min: 0,
  max: 100,
  values: [0, 30],
  type: "vertical",
  prefix: "$",
});
