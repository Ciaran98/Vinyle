<template>
  <div>
    <h1>Guess the album name from the artwork!</h1>
    <p>Time Remaining: {{ Math.round(timerCount / 10) }}</p>
    <p>Guesses Remaining: {{ guessesRemaining }}</p>
    <p>Stats - Wins: {{ wins }} - Losses: {{ losses }}</p>
    <p v-if="lastGame[1] == 'true'">
      You have already completed today's Vinyle! <br />It was
      {{ albumName }} by!
    </p>
    <div class="imageup" id="imel">
      <canvas id="canvas" width="600" height="600"></canvas>
    </div>
    <form>
      <input
        v-model="albumNameGuess"
        :disabled="guessesRemaining == 0"
        list="albumNames"
        id="albumInput"
      />
      <button
        type="submit"
        @click="submitGuess($event)"
        :disabled="!albumNameGuess"
        id="guessSubmit"
      >
        Guess
      </button>
    </form>
    <button @click="play()" id="start">Start</button>
    <button @click="pause()" id="stop">Stop</button>
  </div>
</template>

<script>
// Imports and Data initialisation
export default {
  name: "Vinyle-Component",
  props: {
    albName: String,
    coverUrl: String,
  },
  data() {
    return {
      albumName: "",
      albumNameGuess: "",
      guessesRemaining: 6,
      pixelsize: 0.005,
      timerCount: 200,
      timerEnabled: false,
      wins: 0,
      losses: 0,
      lastGame: ["", false, ""],
      todayData: "",
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
          this.pixelateImage((this.pixelsize += this.pixelsize / 38.2));
        }
      },
    },
    albName: function () {
      this.timerEnabled = false;
      this.timerCount = 200;
      this.pixelsize = 0.005;
      this.pixelateImage(this.pixelsize);
      this.changeFormDisplay("inline", "none", "none", "none");
    },
  },
  methods: {
    // Submit your guess
    changeFormDisplay(
      startDisplay,
      stopDisplay,
      submitGuessDisplay,
      inputDisplay
    ) {
      document.getElementById("start").style.display = startDisplay;
      document.getElementById("stop").style.display = stopDisplay;
      document.getElementById("guessSubmit").style.display = submitGuessDisplay;
      document.getElementById("albumInput").style.display = inputDisplay;
    },
    submitGuess(event) {
      event.preventDefault();
      if (this.albName.toLowerCase() == this.albumNameGuess.toLowerCase()) {
        this.timerCount = 0;
        this.pixelateImage(1);
        this.albumNameGuess = "";
        this.correctGuess = true;
        this.changeFormDisplay("none", "none", "none", "none");
        this.wins++;
        /*localStorage.setItem("wins", this.wins);
        this.lastGame[0] = this.albumName;
        this.lastGame[1] = true;
        this.lastGame[2] = this.hints[3];
        localStorage.setItem("lastGame", this.lastGame);*/
      } else {
        this.guessesRemaining -= 1;
        this.albumNameGuess = "";
        this.changeFormDisplay("inline", "none", "none", "none");
      }
      if (this.guessesRemaining == 0) {
        this.albumNameGuess = "";
        this.timerCount = 0;
        this.pixelateImage(1);
        this.changeFormDisplay("none", "none", "none", "none");
        this.losses++;
        localStorage.setItem("losses", this.losses);
      }
    },
    // Load data, wins, losses, and the previous game
    loadData() {
      /*if (localStorage.getItem("wins") > 0) {
        this.wins = localStorage.getItem("wins");
      }
      if (localStorage.getItem("losses") > 0) {
        this.losses = localStorage.getItem("losses");
      }
      if (localStorage.getItem("lastGame")) {
        this.lastGame = localStorage.getItem("lastGame").split(",");
      }*/
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
      image.src = this.coverUrl;
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
      this.changeFormDisplay("none", "inline", "none", "none");
    },
    pause() {
      // Pause the timer
      this.timerEnabled = false;
      this.changeFormDisplay("none", "none", "inline", "inline");
    },
  },
  beforeMount() {},
  mounted() {
    this.pixelateImage(this.pixelsize);
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
</style>
