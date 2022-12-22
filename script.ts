import Slider from "./Slider";
import "./view/SliderView.scss";


let h: Slider = new Slider("h", {
  min: -50,
  max: 100,
  values: [25],
  names: ["qwe"],
  prefix: "$",
  grid: true,
  step: 1
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
  max: 1000,
  type: "vertical",
  grid: true

});

let vr: Slider = new Slider("vr", {
  range: true,
  min: 0,
  max: 250,
  values: [0, 30],
  step: 16.5,
  type: "vertical",
  prefix: "$",
  grid: true
});



// let ids = Array(1000).fill(0);
// let boxes = [];
// ids.forEach((el, i, array) => {
//   array[i] = +Math.random();
//   let box = document.createElement('div');
//   box.id = array[i];
//   box.style.marginBottom = '80px'
//   boxes.push(box)
// });

// document.body.append(...boxes);
// boxes.forEach((box) => new Slider(box.id, {
//   min: -50,
//   max: 100,
//   values: [25],
//   names: ["qwe"],
//   prefix: "$",
//   grid: true,
//   step: 1
// }))