<template>
  <h1 class="header" id="gradient">Vinyle.</h1>
  <router-view />
</template>
<script>
import $ from "jquery";
let colors = new Array(
  [62, 35, 255],
  [60, 255, 60],
  [255, 35, 98],
  [45, 175, 230],
  [255, 0, 255],
  [255, 128, 0]
);

let step = 0;
//color table indices for:
// current color left
// next color left
// current color right
// next color right
let colorIndices = [0, 1, 2, 3];

//transition speed
let gradientSpeed = 0.002;

function updateGradient() {
  if ($ === undefined) return;

  let c0_0 = colors[colorIndices[0]];
  let c0_1 = colors[colorIndices[1]];
  let c1_0 = colors[colorIndices[2]];
  let c1_1 = colors[colorIndices[3]];

  let istep = 1 - step;
  let r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
  let g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
  let b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
  let color1 = "rgb(" + r1 + "," + g1 + "," + b1 + ")";

  let r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
  let g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
  let b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
  let color2 = "rgb(" + r2 + "," + g2 + "," + b2 + ")";

  $("#gradient")
    .css({
      background:
        "-webkit-gradient(linear, left top, right top, from(" +
        color1 +
        "), to(" +
        color2 +
        "))",
    })
    .css({
      background:
        "-moz-linear-gradient(left, " + color1 + " 0%, " + color2 + " 100%)",
      "-webkit-background-clip": "text",
      "-webkit-text-fill-color": "transparent",
    });

  step += gradientSpeed;
  if (step >= 1) {
    step %= 1;
    colorIndices[0] = colorIndices[1];
    colorIndices[2] = colorIndices[3];

    //pick two new target color indices
    //do not pick the same as the current one
    colorIndices[1] =
      (colorIndices[1] + Math.floor(1 + Math.random() * (colors.length - 1))) %
      colors.length;
    colorIndices[3] =
      (colorIndices[3] + Math.floor(1 + Math.random() * (colors.length - 1))) %
      colors.length;
  }
}

setInterval(updateGradient, 10);
export default {};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Raleway&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap");
body {
  color: #ffffff;
  background-color: #1f1f20;
}
h1.header {
  padding: 0;
  margin: 0;
  font-family: "Dancing Script", cursive;
  font-size: 200px;
  cursor: default;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  font-family: "Raleway", sans-serif;
}
img {
  width: 600px;
  image-rendering: high-quality;
}
@media (max-width: 768px) {
  img {
    width: 250px;
  }
  h1.header {
    font-size: 100px;
  }
}

button {
  width: 100px;
  height: 50px;
  font-size: 20px;
  border: 2px solid white;
  border-radius: 25px;
  cursor: pointer;
  margin: 10px;
  font-family: "Raleway", sans-serif;
  background-color: rgb(0, 206, 0);
  font-size: 20px;
  font-weight: 600;
  color: white;
  transition: background-color 0.2s;
}
button:enabled:hover {
  transition: background-color 0.2s;
  background-color: rgb(0, 126, 0);
}
button:disabled {
  transition: background-color 0.2s;
  background-color: crimson;
}
button.how-to-play {
  background-color: purple;
}
button.how-to-play:hover {
  background-color: black;
}
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
  animation: modalopen 0.5s;
}
@keyframes modalopen {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
/* Modal Content/Box */
.modal-content {
  background-color: #1f1f20;
  margin: 15% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 2px solid #111111;
  border-radius: 15px;
  width: 80%; /* Could be more or less, depending on screen size */
  max-width: 600px;
}

/* The Close Button */
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
