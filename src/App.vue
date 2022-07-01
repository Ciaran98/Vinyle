<template>
<img alt="Vue logo" src="../src/assets/vinylelogo.png"/>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <router-view/>
</template>

<style>
body{
  color: #cce0f3;
  background-color: rgb(28, 29, 41);
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  
}

nav {
  padding: 30px;
}

nav a {
  font-size: 25px;
  color: #cce0f3;
  text-decoration: none;
}

nav a.router-link-exact-active {
  text-decoration: underline;
  font-weight: bold;
}
img{
  width: 600px;
}
@media(max-width: 768px){
  img{
  width: 300px;
}
}
</style>
