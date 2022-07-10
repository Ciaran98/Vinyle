<template>
  <div v-if="gameResult == 'win'">
    <Countdown /> Congrats, you have guessed correctly! This album cover was
    {{ gameAlbumName }}. You guessed correctly in {{ gameAttempts }} attempts,
    and in {{ gameTime }} seconds.
  </div>
  <div v-if="gameResult == 'loss'">That is unfortunate, you lost</div>
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
};
</script>
<style scoped>
div.results {
  opacity: 1;
}
.v-enter-active {
  animation: bounce-in 0.3s;
}
.v-leave-active {
  animation: bounce-in 0.3s reverse;
}
@keyframes bounce-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
