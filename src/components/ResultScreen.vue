<template>
  <div v-if="gameResult == 'win' || gameResult == 'loss'">
    <Countdown />
  </div>

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
      <p>Unfortunately you did not guess correctly, better luck next time!</p>
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
    <div
      v-if="
        gameResult == 'win' || gameResult == 'loss' || gameResult == 'timeout'
      "
    >
      <button
        v-if="gameAlbumName == gameAlbumNameToday"
        @click="
          openModal();
          copyToClipboard();
        "
      >
        Share Results
      </button>
      <div id="resultsModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeModal">&times;</span>
          <h1>Share Your Results!</h1>
          <p>Copy the results below, and share them on social media!</p>
          <hr />
          <p class="share">{{ shareString }}</p>
        </div>
      </div>
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
    gameNumber: Number,
  },
  watch: {},
  components: {
    Countdown,
  },
  data() {
    return {
      resultModalToggled: false,
      shareString: "",
    };
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
      this.shareString = `Vinyle #${this.gameNumber}: - ${squared} Time: ${this.gameTime}s Attempts: ${this.gameAttempts}`;
    },
    openModal() {
      document.getElementById("resultsModal").style.display = "block";
    },
    closeModal() {
      document.getElementById("resultsModal").style.display = "none";
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
    transform: translateY(-100px);
  }
  100% {
    opacity: 1;
  }
}
button {
  width: 150px;
}
.share {
  background-color: rgb(241, 241, 241);
  padding: 20px;
  border: 2px solid rgb(27, 27, 27);
  border-radius: 15px;
  color: rgb(27, 27, 27);
  font-weight: bold;
  font-size: 17px;
}
</style>
