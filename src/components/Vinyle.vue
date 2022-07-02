<template>
  <div>
    <h1>Guess the album name from the artwork!</h1>
    <p>Your Score</p>
    <ul class="scores">
      <li>Wins: {{wins}}</li>
      <li>Losses: {{losses}}</li>
    </ul>
    <p>Guesses remaining: {{guessesRemaining}}</p>
    <img src="../assets/test.jpg" alt="Album Art">
    <form>
      <input v-model="albumNameGuess">
      <button type="submit" @click="submitGuess($event)" :disabled="!albumNameGuess">Guess</button>
    </form>
    <ul class="hints" v-if="guessesRemaining <=4">
      <li v-if="guessesRemaining <=4">Release Date: July 24 2020</li>
      <li v-if="guessesRemaining <=3">Song Hint 1: Cardigan</li>
      <li v-if="guessesRemaining <=2">Song Hint 2: Betty</li>
      <li v-if="guessesRemaining <=1">Artist: Taylor Swift</li>
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
      hints:[]
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
        })
        .catch(err=>{
          console.error(err);
          })

      
    },
    submitGuess(event){
      event.preventDefault();
      if(this.albumNameGuess.length == 0){
        return;
      }
      if(this.albumName == this.albumNameGuess.toLowerCase()){
        this.albumNameGuess = '';
        this.wins++;
        localStorage.setItem('wins',this.wins);
        this.guessesRemaining = 6;
      }
      else{
        this.albumNameGuess = '';
        this.guessesRemaining-=1;
      }
      if(this.guessesRemaining == 0){
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
    }
  },
  beforeMount(){
    this.loadScores();
  },
  mounted(){
    this.getRandomAlbum();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
