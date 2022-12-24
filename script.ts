import Slider from "./Slider";

let h: Slider = new Slider("h", {
  min: -50,
  max: 100,
  values: [25],
  names: ["qwe"],
  prefix: "$",
  grid: true,
  step: 1,
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
  change: (data: any) => {
    console.log("change", data.values)
  },
  slide: (data: any) => {
    console.log("slide", data.values)
  },
  create: (data: any) => {
    console.log('create', data.values)
  }
});

let v: Slider = new Slider("v", {
  min: 0,
  max: 1000,
  type: "vertical",
  grid: true,

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

hr.setValue(33, 1)