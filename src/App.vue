<template>
  <img alt="Vinyle logo" src="../src/assets/vinylelogo.png" />
  <router-view />
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Raleway&display=swap");
body {
  color: #ffffff;
  background-color: #1f1f20;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
img {
  width: 600px;
  image-rendering: high-quality;
}
@media (max-width: 768px) {
  img {
    width: 250px;
  }
}

button {
  width: 100px;
  height: 50px;
  font-size: 20px;
  border: 2px solid white;
  border-radius: 20px;
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
</style>
