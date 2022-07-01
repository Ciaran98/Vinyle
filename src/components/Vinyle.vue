<template>
  <div>
    <h1>Guess the album artwork!</h1>

    <p>Guesses remaining: {{guessesRemaining}}</p>
    <img src="../assets/test.jpg">
    <form>
      <input v-model="albumNameGuess">
      <button type="submit" @click="submitGuess($event)">Guess</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Vinyle-Component',
  props: {
  },
  data(){
    return{
      albumName:'folklore',
      albumNameGuess:'',
      guessesRemaining:6
    }
  },
  methods:{
    submitGuess(){
      if(this.albumNameGuess.length == 0){
        alert('Please enter a guess')
        return;
      }
      console.log(this.albumName);
      console.log(this.albumNameGuess);
      if(this.albumName == this.albumNameGuess.toLowerCase()){
        alert('Congrats!');
      }
      else{
        alert('Incorrect Guess')
        this.guessesRemaining-=1;
      }
      if(this.guessesRemaining == 0){
        this.guessesRemaining = 6;
        // Refresh image, refresh guesses
        alert('You lost');
      }
    }
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
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
