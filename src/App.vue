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
  padding: 0;
  margin: 0;
  overflow-x: hidden;
}
h1.header {
  padding: 0;
  margin: 0;
  font-family: "Dancing Script", cursive;
  font-size: 150px;
  cursor: default;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  font-family: "Raleway", sans-serif;
}

@media (max-width: 768px) {
  h1.header {
    font-size: 100px;
  }
}

button {
  width: 120px;
  height: 40px;
  font-size: 16px;
  border:none;
  border-radius: 15px;
  cursor: pointer;
  margin: 10px;
  font-family: "Raleway", sans-serif;
  background-color: rgb(0, 206, 0);
  font-weight: 600;
  color: white;
  transition: all 0.2s;
}
button:disabled {
  background-color: red;
}
button:enabled:hover {
  background-color: rgb(0, 126, 0);
}
button.how-to-play {
  background-color: rgb(71, 137, 199);
  border-radius: 25px;
}
button.how-to-play:hover {
  background-color: rgb(55, 99, 141);
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
  animation: modalfade 0.5s;
}

/* Modal Content/Box */
.modal-content {
  position: relative;
  background-color: #1f1f20;
  margin: 15% auto; /* 15% from the top and centered */
  padding: 20px;
  border-radius: 15px;
  width: 70%; /* Could be more or less, depending on screen size */
  max-width: 600px;
}
@keyframes modalopen {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes modalfade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
/* The Close Button */
.close {
  position: absolute;
  color: #aaa;
  aspect-ratio: 1;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 15px;
  border-radius: 25px;
  border: 2px solid #aaa;
  transition: all 300ms;
  right: 10px;
  top:10px;
}

.close:hover,
.close:focus {
  color: red;
  text-decoration: none;
  cursor: pointer;
  border-color: red;
  transition: all 300ms;
}
hr{
  border-top: 1px solid white;
}
</style>
