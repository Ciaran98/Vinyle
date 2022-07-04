<template>
  <div>
    <h1>Guess the album name from the artwork!</h1>
    <p v-if="!lastGame[1]">Time Remaining: {{ Math.round(timerCount / 10) }}</p>
    <p v-if="!lastGame[1]">Guesses Remaining: {{ guessesRemaining }}</p>
    <p>Stats - Wins: {{ wins }} - Losses: {{ losses }}</p>
    <p v-if="lastGame[1] == 'true'">
      You have already completed today's Vinyle!
    </p>
    <div class="imageup" id="imel">
      <canvas id="canvas" width="600" height="600"></canvas>
    </div>
    <form>
      <input
        v-model="albumNameGuess"
        :disabled="guessesRemaining == 0 || correctGuess"
        list="albumNames"
        id="albumInput"
      />
      <datalist id="albumNames">
        <option value="Evermore"></option>
      </datalist>
      <button
        type="submit"
        @click="submitGuess($event)"
        :disabled="!albumNameGuess"
        id="guessSubmit"
      >
        Guess
      </button>
    </form>
    <button @click="play()" id="start">Begin Guessing</button>
    <button @click="pause()" id="stop">Guess</button>
    <ul class="hints" v-if="guessesRemaining <= 4">
      <li v-if="guessesRemaining <= 4">Release Date: {{ hints[0] }}</li>
      <li v-if="guessesRemaining <= 3">Song Hint 1: {{ hints[1] }}</li>
      <li v-if="guessesRemaining <= 2">Song Hint 2: {{ hints[2] }}</li>
      <li v-if="guessesRemaining <= 1">Artist: Taylor {{ hints[3] }}</li>
    </ul>
  </div>
</template>

<script>
// Imports and Data initialisation
import axios from "axios";
const url = "http://localhost:3000/getRandom";
export default {
  name: "Vinyle-Component",
  props: {},
  data() {
    return {
      albumName: "",
      albumNameGuess: "",
      guessesRemaining: 6,
      hints: [],
      imageUrl: "",
      pixelsize: 0.005,
      timerCount: 200,
      timerEnabled: false,
      correctGuess: false,
      wins: 0,
      losses: 0,
      lastGame: ["", false],
    };
  },
  // Timer method
  watch: {
    timerEnabled(value) {
      if (value) {
        setTimeout(() => {
          this.timerCount -= 1;
        }, 100);
      }
    },
    timerCount: {
      handler(value) {
        if (value > 0 && this.timerEnabled) {
          setTimeout(() => {
            this.timerCount -= 1;
          }, 100);
          this.pixelateImage((this.pixelsize += 0.0005));
        }
      },
      immediate: true,
    },
  },
  methods: {
    // Get today's album - todo - rename to getTodayAlbum
    getRandomAlbum() {
      axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          this.albumName = res.data.name;
          this.hints = res.data.hints;
          this.imageUrl = res.data.image;
          // Check if this game has been completed already
          if (this.lastGame[0] == this.albumName) {
            this.pixelateImage(1);
            document.getElementById("start").style.display = "none";
            document.getElementById("stop").style.display = "none";
          } else {
            this.pixelateImage(this.pixelsize);
            localStorage.setItem("lastGame", ["", false]);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // Submit your guess
    submitGuess(event) {
      event.preventDefault();
      if (this.albumName.toLowerCase() == this.albumNameGuess.toLowerCase()) {
        this.timerCount = 0;
        this.pixelateImage(1);
        this.albumNameGuess = "";
        this.correctGuess = true;
        document.getElementById("start").style.display = "none";
        document.getElementById("stop").style.display = "none";
        document.getElementById("guessSubmit").style.display = "none";
        document.getElementById("albumInput").style.display = "none";
        this.wins++;
        localStorage.setItem("wins", this.wins);
        this.lastGame[0] = this.albumName;
        this.lastGame[1] = true;
        localStorage.setItem("lastGame", this.lastGame);
      } else {
        this.guessesRemaining -= 1;
        this.albumNameGuess = "";
        document.getElementById("start").style.display = "inline";
        document.getElementById("guessSubmit").style.display = "none";
        document.getElementById("albumInput").style.display = "none";
      }
      if (this.guessesRemaining == 0) {
        this.albumNameGuess = "";
        this.timerCount = 0;
        this.pixelateImage(1);
        document.getElementById("start").style.display = "none";
        document.getElementById("stop").style.display = "none";
        this.losses++;
        localStorage.setItem("losses", this.losses);
      }
    },
    // Load data, wins, losses, and the previous game
    loadData() {
      if (localStorage.getItem("wins") > 0) {
        this.wins = localStorage.getItem("wins");
      }
      if (localStorage.getItem("losses") > 0) {
        this.losses = localStorage.getItem("losses");
      }
      if (localStorage.getItem("lastGame")) {
        this.lastGame = localStorage.getItem("lastGame").split(",");
      }
    },
    // Pixelate the image
    pixelateImage(pSize) {
      let image = new Image();
      let canvas = document.getElementById("canvas");
      let ctx = canvas.getContext("2d");
      ctx.mozImageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.imageSmoothingEnabled = false;
      image.onload = pixelate;
      image.src = this.imageUrl;
      function pixelate() {
        let size = pSize,
          w = canvas.width * size,
          h = canvas.height * size;
        ctx.drawImage(image, 0, 0, w, h);
        ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
      }
    },
    // Start the timer
    play() {
      this.timerEnabled = true;
      document.getElementById("start").style.display = "none";
      document.getElementById("stop").style.display = "inline";
    },
    pause() {
      // Pause the timer
      this.timerEnabled = false;
      document.getElementById("start").style.display = "none";
      document.getElementById("stop").style.display = "none";
      document.getElementById("guessSubmit").style.display = "inline";
      document.getElementById("albumInput").style.display = "inline";
    },
  },
  beforeMount() {
    this.loadData();
  },
  mounted() {
    this.getRandomAlbum();
    this.pixelateImage();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas {
  height: 600px;
  width: 600px;
}
#start {
  display: inline;
}
#stop {
  display: none;
}
#guessSubmit {
  display: none;
}
#albumInput {
  display: none;
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
form {
  margin-top: 20px;
}
button {
  all: unset;
  border: 2px solid white;
  border-radius: 20px;
  padding: 12px 20px;
  margin: 10px 20px;
  font-size: 22px;
}
button:hover {
  background-color: rgb(255, 255, 255);
  color: #252629;
  cursor: pointer;
}
button:disabled {
  cursor: default;
  background-color: transparent;
  color: white;
}
input {
  background-color: transparent;
  color: white;
  height: 47px;
  margin: 10px 20px;
  text-align: center;
  font-size: 22px;
  border: 2px solid white;
  border-radius: 20px;
}
input:focus {
  background-color: white;
  color: #252629;
}
</style>
