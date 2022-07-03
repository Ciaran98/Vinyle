<template>
  <div>
    <h1>Guess the album name from the artwork!</h1>
    <p>Your Score</p>
    <p>Guesses remaining: {{guessesRemaining}}</p>
    <div class="imageup" id="imel">
      <canvas id="canvas" width="300" height="300"></canvas>
    </div>
    <form>
      <input v-model="albumNameGuess">
      <button type="submit" @click="submitGuess($event)" :disabled="!albumNameGuess">Guess</button>
    </form>
    <ul class="hints" v-if="guessesRemaining <=4">
      <li v-if="guessesRemaining <=4">Release Date: {{hints[0]}}</li>
      <li v-if="guessesRemaining <=3">Song Hint 1: {{hints[1]}}</li>
      <li v-if="guessesRemaining <=2">Song Hint 2: {{hints[2]}}</li>
      <li v-if="guessesRemaining <=1">Artist: Taylor {{hints[3]}}</li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
const url = 'http://localhost:3000/getRandom';
export default {
  name: 'Vinyle-Component',
  props: {
  },
  data(){
    return{
      albumName:'',
      albumNameGuess:'',
      guessesRemaining:6,
      wins:0,
      losses:0,
      hints:[],
      imageUrl:'',
      pixelsize:0.01
    }
  },
  methods:{
    getRandomAlbum(){
        axios.get(url,{
          headers:{
            'Content-Type':'application/json'
          },
        })
        .then(res =>{
          this.albumName = res.data.name;
          this.hints = res.data.hints[0];
          this.imageUrl = res.data.image;
          this.pixelateImage(this.pixelsize);
        })
        .catch(err=>{
          console.error(err);
          });
    },
    submitGuess(event){
      event.preventDefault();
      if(this.albumNameGuess.length == 0){
        return;
      }
      if(this.albumName.toLowerCase() == this.albumNameGuess.toLowerCase()){
        this.pixelateImage(1);
        this.albumNameGuess = '';
        this.wins++;
        localStorage.setItem('wins',this.wins);
        this.guessesRemaining = 6;
      }
      else{
        this.pixelateImage(this.pixelsize+=0.05);
        this.albumNameGuess = '';
        this.guessesRemaining-=1;
      }
      if(this.guessesRemaining == 0){
        this.pixelsize = 0.01;
        this.pixelateImage(this.pixelsize);
        this.albumNameGuess = '';
        this.losses++;
        localStorage.setItem('losses',this.losses);
        this.guessesRemaining = 6;
        // Refresh image, refresh guesses
      }
    },
    loadScores(){
      this.wins = localStorage.getItem('wins');
      this.losses = localStorage.getItem('losses');
    },
    pixelateImage(pSize){
      let image = new Image();
      let canvas = document.getElementById('canvas');
          console.log(canvas.width,canvas.height);
          let ctx = canvas.getContext('2d');
          ctx.mozImageSmoothingEnabled = false;
          ctx.webkitImageSmoothingEnabled = false;
          ctx.imageSmoothingEnabled = false;
          
          image.onload = pixelate;
          image.src = this.imageUrl;
          function pixelate(){
            let size = pSize,
            w = canvas.width * size,
            h = canvas.height * size;
            ctx.drawImage(image,0,0,w,h);
            ctx.drawImage(canvas,0,0,w,h,0,0,canvas.width,canvas.height);

          }
    }
  },
  beforeMount(){
    this.loadScores();
  },
  mounted(){
    this.getRandomAlbum();
    this.pixelateImage();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas{
  height: 600px;
  width: 600px;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 0 10px;
}
a {
  color: #42b983;
}
form{
  margin-top: 20px;
}
button{
  all:unset;
  border: 2px solid white;
  border-radius: 20px;
  padding: 12px 20px;
  margin: 10px 20px;
  font-size: 22px; 
}
button:hover{
  background-color: rgb(255, 255, 255);
  color:#252629;
  cursor: pointer;
}
button:disabled{
  cursor: default;
  background-color: transparent;
  color: white;
}
input{
  background-color: transparent;
  color: white;
  height: 47px;
  margin: 10px 20px;
  text-align: center;
  font-size: 22px;
  border: 2px solid white;
  border-radius: 20px;
}
input:focus{
  background-color: white;
  color:#252629;
}
</style>
