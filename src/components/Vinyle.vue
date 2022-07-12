<!----------------------------------------Template-------------------------------------------------------------------->
<template>
  <div>
    <ResultScreen
      :game-result="this.rsResult"
      :game-attempts="this.rsAttempts"
      :game-time="this.rsTime"
      :game-album-name="this.rsAlbumName"
      :game-album-name-today="this.rsAlbumNameToday"
    />

    <div id="game-area">
      <canvas id="canvas" width="600" height="600"></canvas>
    </div>
    <div id="game-elements">
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
    vinyleName: String,
    vinyleGameType: String,
    vinyleCompletedToday: Boolean,
    vinyleIsToday: Boolean,
    vinyleTodaysAlbum: String,
  },
  data() {
    return {
      playing: false,
      albumNameGuess: "",
      guessesRemaining: 6,
      pixelsize: 0.005,
      timerCount: 200,
      timerEnabled: false,
      previousGame: [],
      winsteak: 0,
      // --------------- Result Screen Variables ------------ \\
      rsResult: "",
      rsAttempts: "",
      rsTime: "",
      rsAlbumName: "",
      rsAlbumNameToday: "",
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
        if (value == 0) {
          this.changeFormDisplay("none", "none", "none", "none");
          let res = "";
          if (this.guessesRemaining > 0) {
            res = "timeout";
          } else {
            res = "loss";
          }
          this.setResults(res, String(7 - this.guessesRemaining), "0");
          if (this.vinyleName == this.vinyleTodaysAlbum) {
            localStorage.setItem("previousGamePlayed", [
              this.vinyleName,
              (200 - this.timerCount) / 10,
              7 - this.guessesRemaining,
              res,
            ]);
          }
        }
      },
    },
    guessesRemaining: function () {
      if (this.guessesRemaining != 6 && this.guessesRemaining != 0) {
        document.getElementById("game-area").animate(
          [
            {
              transform: "translateX(0)",
            },
            {
              transform: "translateX(30px)",
            },
            {
              transform: "translateX(0)",
            },
            {
              transform: "translateX(-30px)",
            },
            {
              transform: "translateX(0)",
            },
          ],
          {
            fill: "none",
            duration: 200,
            iterations: 2,
          }
        );
      }
    },
    vinyleName: function () {
      this.timerCount = 200;
      this.pixelsize = 0.005;
      this.guessesRemaining = 6;
      this.albumNameGuess = "";
      this.timerEnabled = false;
      document.getElementById("game-area").animate(
        [
          {
            opacity: "0",
          },
          {
            opacity: "1",
          },
        ],
        {
          fill: "forwards",
          duration: 300,
          direction: "alternate",
        }
      );
      if (
        this.vinyleTodaysAlbum == this.vinyleName &&
        this.vinyleCompletedToday
      ) {
        this.setResults(
          this.previousGame[3],
          this.previousGame[2],
          this.previousGame[1]
        );
        this.changeFormDisplay("none", "none", "none", "none");
      } else {
        this.setResults("none", "0", "0");
        this.changeFormDisplay("inline", "none", "none", "none");
      }
      this.todayCompletedPixelationOff();
    },
  },
  methods: {
    // Change the display properties of the form elements
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
      // Check if guess is correct, if true, check the game type, if calendar, set today's stat to a win, and emit that the game is now completed
      if (
        this.vinyleName.replace(/[^a-zA-Z0-9]/g, "").toLocaleLowerCase() ==
        this.albumNameGuess.replace(/[^a-zA-Z0-9]/g, "").toLocaleLowerCase()
      ) {
        if (this.vinyleGameType == "today") {
          this.$emit("update-completed-today", true);
          localStorage.setItem("previousGamePlayed", [
            this.vinyleName,
            (200 - this.timerCount) / 10,
            7 - this.guessesRemaining,
            "win",
          ]);
          this.getPreviouslyCompletedGame();
        }
        this.setResults(
          "win",
          String(7 - this.guessesRemaining),
          String((200 - this.timerCount) / 10)
        );
        // Preparethe results as props for the result screen component
        // Set completed game to true, the timer to zero, unpixelate the image
        this.pixelateImage(1);
        this.changeFormDisplay("none", "none", "none", "none");
      } else {
        this.guessesRemaining--;
        this.changeFormDisplay("inline", "none", "none", "none");
      }
      if (this.guessesRemaining == 0) {
        this.timerCount = 0;
        this.pixelateImage(1);
        this.changeFormDisplay("none", "none", "none", "none");
      }
      this.albumNameGuess = "";
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
      //image.src = this.vinyleCover;
      if (this.vinyleName.length != 0) {
        image.src = require("@/assets/albums/" +
          this.vinyleName.replace(/[^a-zA-Z0-9]/g, "").toLocaleLowerCase() +
          ".jpg");
      }

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
      this.playing = true;
      this.timerEnabled = true;
      this.changeFormDisplay("none", "inline", "none", "none");
    },
    pause() {
      // Pause the timer
      this.timerEnabled = false;
      this.changeFormDisplay("none", "none", "inline", "inline");
    },
    todayCompletedPixelationOff() {
      if (
        this.vinyleTodaysAlbum == this.vinyleName &&
        this.vinyleCompletedToday
      ) {
        this.pixelateImage(1);
      } else {
        this.pixelateImage(this.pixelsize);
      }
    },
    getPreviouslyCompletedGame() {
      if (localStorage.getItem("previousGamePlayed") != null) {
        this.previousGame = localStorage
          .getItem("previousGamePlayed")
          .split(",");
      }
    },
    setResults(result, attempts, time) {
      this.rsAlbumName = this.vinyleName;
      this.rsAlbumNameToday = this.vinyleTodaysAlbum;
      this.rsAttempts = attempts;
      this.rsResult = result;
      this.rsTime = time;
    },
  },
  beforeMount() {
    this.getPreviouslyCompletedGame();
  },
  mounted() {
    this.todayCompletedPixelationOff();
  },
  components: { ResultScreen },
};
</script>
<!----------------------------------------End of script------------------------------------------------------------>
<!----------------------------------------Style-------------------------------------------------------------------->
<style scoped>
@keyframes fade {
  0% {
    opacity: 0;
    background-color: purple;
  }
  100% {
    opacity: 1;
    background-color: pink;
  }
}
canvas {
  height: 600px;
  width: 600px;
  border-radius: 5px;
  border: 2px solid rgb(36, 36, 36);
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
