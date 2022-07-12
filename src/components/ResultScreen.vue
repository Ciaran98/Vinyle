<template>
  <Transition>
    <div class="game-timer" v-if="gameResult == 'win' || gameResult == 'loss'">
      <Countdown />
      <button
        v-if="gameAlbumName == gameAlbumNameToday"
        @click="copyToClipboard()"
      >
        Share Results
      </button>
    </div>
  </Transition>
  <Transition>
    <div class="game-result" v-if="gameResult == 'win'">
      <h1 class="correct">Correct!</h1>
      <p>
        Congrats, you have guessed correctly! This album cover was "{{
          gameAlbumName
        }}".<br />
        You guessed correctly in {{ gameAttempts }} attempts, and in
        {{ gameTime }} seconds.<br />
      </p>
    </div>
  </Transition>
  <Transition>
    <div class="game-result" v-if="gameResult == 'loss'">
      <h1 class="incorrect">Incorrect!</h1>
      <p>You lost</p>
    </div>
  </Transition>
  <Transition>
    <div class="game-result" v-if="gameResult == 'timeout'">
      <h1 class="incorrect">Timeout!</h1>
      <p>
        Unfortunately, the timer ran out! The correct answer was "{{
          gameAlbumName
        }}". Better luck next time!
      </p>
    </div>
  </Transition>
</template>
<script>
import Countdown from "@/components/Countdown.vue";
export default {
  name: "Result-Screen-Component",
  props: {
    gameResult: String,
    gameTime: String,
    gameAttempts: String,
    gameAlbumName: String,
    gameAlbumNameToday: String,
  },
  components: {
    Countdown,
  },
  methods: {
    copyToClipboard() {
      let squared = "";
      if (this.gameResult == "loss") {
        squared = "🟥".repeat(6);
      }
      if (this.gameResult == "win") {
        squared = "🟥".repeat(this.gameAttempts - 1);
        squared += "🟩";
        squared += "⬜".repeat(6 - this.gameAttempts);
      }
      if (this.gameResult == "timeout") {
        squared += "🟥".repeat(this.gameAttempts);
        squared += "⬜".repeat(6 - this.gameAttempts);
      }
      navigator.clipboard.writeText(squared);
    },
  },
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Raleway&display=swap");
div {
  font-family: "Raleway", sans-serif;
}
div.game-result {
  font-size: 20px;
}
.correct {
  color: #48e02a;
  text-shadow: 2px 2px 0 #000000, 2px -2px 0 #000000, -2px 2px 0 #000000,
    -2px -2px 0 #000000, 2px 0px 0 #000000, 0px 2px 0 #000000,
    -2px 0px 0 #000000, 0px -2px 0 #000000;
}
.incorrect {
  color: red;
  text-shadow: 2px 2px 0 #000000, 2px -2px 0 #000000, -2px 2px 0 #000000,
    -2px -2px 0 #000000, 2px 0px 0 #000000, 0px 2px 0 #000000,
    -2px 0px 0 #000000, 0px -2px 0 #000000;
}
.v-enter-active {
  animation: fade-in 0.3s;
}
.v-leave-active {
  animation: fade-in 0.3s reverse;
}
@media (max-width: 768px) {
  div.game-result {
    font-size: 14px;
  }
}
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
