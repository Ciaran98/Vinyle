<!----------------------------------------Template-------------------------------------------------------------------->
<template>
  <div class="vinyle-main">
    <div class="main-wrapper">

    <div id="game-area">
      <canvas id="canvas" width="600" height="600"></canvas>
    </div>
    <ResultScreen
      :game-result="this.rsResult"
      :game-attempts="this.rsAttempts"
      :game-time="this.rsTime"
      :game-album-name="this.rsAlbumName"
      :game-album-name-today="this.rsAlbumNameToday"
      :game-number="this.vinyleGameNumber"
    />
  </div>
    <div class="game-elements">
      <form>
        <div class="input-wrapper">
          <input
            type="text"
            autocomplete="off"
            :disabled="guessesRemaining == 0"
            id="albumInput"
            :value="this.albumNameGuess"
            :placeholder="this.guessesRemaining + ' Guesses Remaining...'"
            @input="filterAlbums"
            @focus="resultVisible = true"
          />
          <div style="all: unset" v-if="resultVisible">
            <ul>
              <li
                v-for="searchResult in searchResults"
                :key="searchResult"
                @click="setAlbum(searchResult)"
              >
                {{ searchResult }}
              </li>
            </ul>
          </div>
        </div>
        <div class="button-wrapper">
          <button class="play" @click="play()" id="start" type="button">
            Play
          </button>
          <button class="play" @click="pause()" id="stop" type="button">
            Pause
          </button>
          <button
            type="submit"
            class="submit"
            :disabled="this.albumNameGuess.length == 0"
            @click="submitGuess($event)"
            id="guessSubmit"
          >
            Guess
          </button>
        </div>
      </form>
    </div>

  </div>
</template>
<!----------------------------------------End of Template----------------------------------------------------------->
<!----------------------------------------Script-------------------------------------------------------------------->
<script>
import ResultScreen from "./ResultScreen.vue";
import albums from "../assets/albums.json";
// Imports and Data initialisation
export default {
  name: "Vinyle-Component",
  props: {
    vinyleName: String,
    vinyleCover: String,
    vinyleGameType: String,
    vinyleCompletedToday: Boolean,
    vinyleIsToday: Boolean,
    vinyleTodaysAlbum: String,
    vinyleGameNumber: Number,
  },
  data() {
    return {
      guessesRemaining: 6,
      pixelsize: 0.005,
      timerCount: 200,
      timerEnabled: false,
      previousGame: [],
      winsteak: 0,
      resultVisible: false,
      albumNameGuess: "",
      albums: albums,
      searchResults: [],
      // --------------- Result Screen Variables ------------ \\
      rsResult: "",
      rsAttempts: "",
      rsTime: "",
      rsAlbumName: "",
      rsAlbumNameToday: "",
      // ----------------------------------------------------- \\
    };
  },
  emits: ["update-completed-today"],
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
          this.pixelateImage(
            (this.pixelsize +=
              this.pixelsize === 1
                ? 1
                : 1 - Math.pow(1.0024, -10 * this.pixelsize))
          );
        }
        if (value == 0) {
          this.pixelateImage(1);
          this.changeFormDisplay("none", "none", "none", "none");
          this.setResults("timeout", String(6 - this.guessesRemaining), "20");
          if (this.vinyleName == this.vinyleTodaysAlbum) {
            localStorage.setItem("previousGamePlayed", [
              this.vinyleName.replace(/[^a-zA-Z0-9]/g, "").toLocaleLowerCase(),
              "20",
              6 - this.guessesRemaining,
              "timeout",
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
      if (this.guessesRemaining == 0) {
        this.pixelateImage(1);
        this.changeFormDisplay("none", "none", "none", "none");
        this.setResults(
          "loss",
          String(6 - this.guessesRemaining),
          String((200 - this.timerCount) / 10)
        );
        if (this.vinyleName == this.vinyleTodaysAlbum) {
          localStorage.setItem("previousGamePlayed", [
            this.vinyleName.replace(/[^a-zA-Z0-9]/g, "").toLocaleLowerCase(),
            (200 - this.timerCount) / 10,
            6 - this.guessesRemaining,
            "loss",
          ]);
        }
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
        this.changeFormDisplay("inline", "none", "inline", "inline");
      }
      this.todayCompletedPixelationOff();
    },
  },

  methods: {
    setAlbum(searchResult) {
      this.albumNameGuess = searchResult;
      this.resultVisible = false;
    },
    beep() {
      console.log("beep");
    },
    filterAlbums(e) {
      this.albumNameGuess = e.target.value;
      if (this.albumNameGuess === "") {
        this.searchResults = [];
        return;
      }
      this.searchResults = this.albums.filter((album) => {
        return album
          .toLowerCase()
          .startsWith(this.albumNameGuess.toLowerCase());
      });
    },
    // Change the display properties of the form elements
    changeFormDisplay(startDisplay, stopDisplay, inputDisplay, submitDisplay) {
      document.getElementById("start").style.display = startDisplay;
      document.getElementById("stop").style.display = stopDisplay;
      document.getElementById("albumInput").style.display = inputDisplay;
      document.getElementById("guessSubmit").style.display = submitDisplay;
    },
    // Function to submit guess
    submitGuess(event) {
      this.timerEnabled = false;
      event.preventDefault();
      this.searchResults = [];
      // Check if guess is correct, if true, check the game type, if calendar, set today's stat to a win, and emit that the game is now completed
      if (
        this.vinyleName.replace(/[^a-zA-Z0-9]/g, "").toLocaleLowerCase() ==
        this.albumNameGuess.replace(/[^a-zA-Z0-9]/g, "").toLocaleLowerCase()
      ) {
        if (this.vinyleGameType == "today") {
          this.timerEnabled = false;
          this.$emit("update-completed-today", true);
          localStorage.setItem("previousGamePlayed", [
            this.vinyleName.replace(/[^a-zA-Z0-9]/g, "").toLocaleLowerCase(),
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
        this.changeFormDisplay("inline", "none", "inline", "inline");
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
      image.src = this.vinyleCover;
      if (this.vinyleName != null) {
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
      this.timerEnabled = true;
      this.changeFormDisplay("none", "inline", "inline", "inline");
    },
    pause() {
      // Pause the timer
      this.timerEnabled = false;
      this.changeFormDisplay("inline", "none", "inline", "inline");
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
.icon {
  font-size: 200px;
}
#stop {
  display: none;
}
.main-wrapper{
  display: flex;
  flex-flow:row;
  justify-content: center;
  gap:20px
}
.button-wrapper{
  display: flex;
  flex-flow:row;
  justify-content: space-between;
}
canvas {
  height: 400px;
  width: 400px;
  border-radius: 5px;
  border: 2px solid #242424;
}
form {
  width: 100%;
}
.input-wrapper {
  width: 100%;
  position: relative;
}
::-webkit-scrollbar {
  width: 0.5em;
}
::-webkit-scrollbar-track {
  background: rgb(236, 236, 236);
}
::-webkit-scrollbar-thumb {
  background: rgb(42, 43, 42);
  border-radius: 15px;
}
ul {
  margin: 0;
  padding: 0;
  overflow-y: auto;
  overflow-x: hidden;
  height: auto;
  max-height: 100px;
  list-style: none;
  border-radius: 5px;
  width: 100%;
  position: absolute;
}
li {
  background-color: rgb(255, 255, 255);
  padding: 5px;
  margin: 0;
  border: none;
  width: 100%;
  text-align: left;
  color: #242424;
  font-size: 14px;
  font-weight: 600;
  height: 25px;
}

input {
  margin: 0;
  width: 98%;
  height: 40px;
  font-size: 14px;
  font-weight: 400;
}
li:hover {
  background-color: #242424;
  color: #ffffff;
  cursor: pointer;
}
div.game-elements {
  max-width: 350px;
  margin: auto;
}

#start {
  display: inline;
}
@media (max-width: 768px) {
  canvas {
    height: 300px;
    width: 300px;
  }
  .main-wrapper{
    flex-direction: column-reverse;
  }
}
</style>
<!----------------------------------------End of Style-------------------------------------------------------------------->
