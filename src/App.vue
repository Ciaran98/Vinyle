<template>
  <img alt="Vinyle logo" src="../src/assets/vinylelogo.png" />
  <nav>
    <router-link to="/">Home</router-link><span class="nav-divide"> | </span>
    <router-link to="/about">About</router-link>
  </nav>
  <router-view />
  <div class="footer">
    <nav>
      <a href="https://www.linkedin.com/in/ciaran-melarkey-694469194/"
        >LinkedIn</a
      ><span class="nav-divide"> | </span>
      <a href="https://github.com/Ciaran98">GitHub</a>
    </nav>
  </div>
</template>

<style>
body {
  color: #ffffff;
  background-color: #252629;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

nav span {
  font-size: 25px;
}
nav a {
  font-size: 25px;
  color: #e6ebf0;
  text-decoration: none;
}

nav a.router-link-exact-active {
  text-decoration: underline;
  font-weight: bold;
}
img {
  width: 600px;
}
@media (max-width: 768px) {
  img {
    width: 250px;
  }
}
div.footer {
  display: flex;
  justify-content: center;
  height: 100px;
  align-items: center;
  margin-top: 30px;
}
</style>
