<!----------------------------------------Template-------------------------------------------------------------------->
<template>
  <div>
    <ResultScreen
      :game-Result="this.rsResult"
      :game-Attempts="this.rsAttempts"
      :game-Time="this.rsTime"
      :game-Album-Name="this.rsAlbumName"
    />
    <h1>Guess the album name from the artwork!</h1>
    <p v-if="!completedAlready">
      Time Remaining: {{ Math.round(timerCount / 10) }}
    </p>
    <p v-if="!completedAlready">Guesses Remaining: {{ guessesRemaining }}</p>
    <p>Stats - Wins: {{ wins }} - Losses: {{ losses }}</p>
    <div>
      <canvas id="canvas" width="600" height="600"></canvas>
    </div>
    <form>
      <button
        type="submit"
        @click="submitGuess($event)"
        :disabled="!albumNameGuess"
        id="guessSubmit"
      >
        Guess</button
      ><br /><input
        v-model="albumNameGuess"
        :disabled="guessesRemaining == 0"
        id="albumInput"
      />
    </form>
    <button @click="play()" id="start">Start</button>
    <button @click="pause()" id="stop">Stop</button>
  </div>
</template>
<!----------------------------------------End of Template----------------------------------------------------------->
<!----------------------------------------Script-------------------------------------------------------------------->
<script>
import ResultScreen from "./ResultScreen.vue";
// Imports and Data initialisation
export default {
  name: "Vinyle-Component",
  props: {
    albName: String,
    coverUrl: String,
    gameType: String,
    completedAlready: Boolean,
  },
  data() {
    return {
      albumNameGuess: "",
      guessesRemaining: 6,
      pixelsize: 0.005,
      timerCount: 200,
      timerEnabled: false,
      wins: 0,
      losses: 0,
      completedGame: false,
      previousGame: [],
      // --------------- Result Screen Variables ------------ \\
      rsResult: "",
      rsAttempts: "",
      rsTime: "",
      rsAlbumName: "",
      // ----------------------------------------------------- \\
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
        if (value == 0 && !this.completedGame && !this.completedAlready) {
          this.pixelateImage(1);
          this.losses++;
          localStorage.setItem("stats", [this.wins, this.losses]);
          this.changeFormDisplay("none", "none", "none", "none");
        }
      },
    },
    albName: function () {
      this.timerEnabled = false;
      this.completedGame = false;
      if (!this.completedAlready) {
        this.setupGame("not completed", 6, 200, 0.005);
        this.changeFormDisplay("inline", "none", "none", "none");
      } else {
        this.prepareResults(
          this.previousGame[3],
          this.previousGame[1],
          this.previousGame[2],
          this.previousGame[0]
        );
        this.setupGame("win", 0, 0, 1);
        this.changeFormDisplay("none", "none", "none", "none");
      }
      this.pixelateImage(this.pixelsize);
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
    // Function to submit guess
    submitGuess(event) {
      event.preventDefault();
      if (
        this.albName.replace(/\s+/g, "").toLocaleLowerCase() ==
        this.albumNameGuess.replace(/\s+/g, "").toLocaleLowerCase()
      ) {
        if (this.gameType == "today") {
          this.setTodayStats("win");
          this.$emit("update-completed-already", true);
        }
        this.prepareResults(
          "win",
          (20 - Math.round(this.timerCount / 10)).toString(),
          (6 - this.guessesRemaining).toString(),
          this.albName
        );
        this.completedGame = true;
        this.timerCount = 0;
        this.pixelateImage(1);
        this.albumNameGuess = "";
        this.changeFormDisplay("none", "none", "none", "none");
        this.wins++;
        localStorage.setItem("stats", [this.wins, this.losses]);
      } else {
        if (this.gameType == "today") {
          this.setTodayStats("loss");
        }
        this.guessesRemaining -= 1;
        this.albumNameGuess = "";
        this.changeFormDisplay("inline", "none", "none", "none");
      }
      if (this.guessesRemaining == 0) {
        if (this.gameType == "today") {
          this.setTodayStats("loss");
        }
        this.albumNameGuess = "";
        this.timerCount = 0;
        this.pixelateImage(1);
        this.changeFormDisplay("none", "none", "none", "none");
        localStorage.setItem("stats", [this.wins, this.losses]);
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
    // Load stats to be displayed
    loadStats() {
      if (localStorage.getItem("stats") != null) {
        this.wins = localStorage.getItem("stats").split(",")[0];
        this.losses = localStorage.getItem("stats").split(",")[1];
      }
    },
    // Load previous game data
    loadPreviousGame() {
      if (localStorage.getItem("previousGamePlayed") != null) {
        return localStorage.getItem("previousGamePlayed").split(",");
      }
    },
    // Set todays stats after playing today's game
    setTodayStats(result) {
      localStorage.setItem("previousGamePlayed", [
        this.albName,
        20 - Math.round(this.timerCount / 10),
        6 - this.guessesRemaining,
        result,
      ]);
    },
    // Function to setup the results in the results component
    prepareResults(result, time, attempts, alname) {
      this.rsResult = result;
      this.rsTime = time;
      this.rsAttempts = attempts;
      this.rsAlbumName = alname;
    },
    //Result guesses, time, timerenabled, pixelsize
    setupGame(res, guess, time, pixel) {
      this.rsResult = res;
      this.guessesRemaining = guess;
      this.timerCount = time;
      this.pixelsize = pixel;
    },
  },
  beforeMount() {
    this.previousGame = this.loadPreviousGame();
    this.loadStats();
  },
  mounted() {
    if (this.previousGame != null) {
      this.prepareResults(
        this.previousGame[3],
        this.previousGame[1],
        this.previousGame[2],
        this.previousGame[0]
      );
    }
    if (this.completedAlready) {
      this.pixelateImage(1);
    } else {
      this.pixelateImage(this.pixelsize);
    }
  },
  components: { ResultScreen },
};
</script>
<!----------------------------------------End of script------------------------------------------------------------>
<!----------------------------------------Style-------------------------------------------------------------------->
<style scoped>
canvas {
  height: 600px;
  width: 600px;
}
#albumInput,
#guessSubmit,
#stop {
  display: none;
}
#start {
  display: inline;
}
button {
  all: unset;
  padding: 20px 40px;
  background-color: #36d804;
  box-shadow: 0 5px 0 #269703;
  border-radius: 15px;
  color: aliceblue;
  font-size: 20px;
  transition: all 0.2s ease;
  font-family: "Comfortaa", cursive;
  font-weight: bold;
}
button:enabled:active {
  box-shadow: none;
  transform: translateY(5px);
}
button:disabled {
  background-color: #e20000;
  box-shadow: 0 5px 0 #830000;
}
@media (max-width: 768px) {
  canvas {
    height: 300px;
    width: 300px;
  }
}
</style>
<!----------------------------------------End of Style-------------------------------------------------------------------->
