<template>
  <div v-if="gameResult == 'win' || gameResult == 'loss'"><Countdown /></div>

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
  <Transition>
    <button
      v-if="gameAlbumName == gameAlbumNameToday"
      @click="copyToClipboard()"
    >
      Share Results
    </button>
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
    gameNumber: String,
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
      navigator.clipboard.writeText(
        `Vinyle #${this.gameNumber} score: + ${squared}`
      );
    },
  },
};
</script>
<style scoped>
div {
  font-family: "Raleway", sans-serif;
}
div.game-result {
  font-size: 20px;
}
h1 {
  font-size: 60px;
}
.correct {
  background: linear-gradient(
    90deg,
    rgba(52, 214, 226, 1) 0%,
    rgba(174, 255, 40, 1) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.incorrect {
  background: linear-gradient(
    120deg,
    rgba(226, 52, 52, 1) 32%,
    rgba(243, 255, 40, 1) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
  h1 {
    font-size: 40px;
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
button {
  width: 150px;
}
</style>
