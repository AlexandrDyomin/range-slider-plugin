import Slider from "./Slider";


let h: Slider = new Slider("h", {
  min: 0,
  max: 100,
  step: 55,
});

let hr: Slider = new Slider("hr", {
  range: true,
  min: 0,
  max: 100,
  step: 110,
  values: [0, 60],
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
  step: 50,
  values: [1.5, 90.5],
  type: "vertical"
});
