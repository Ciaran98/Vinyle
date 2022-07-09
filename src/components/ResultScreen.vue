<template>
  <div v-if="gameResult == 'win' || gameResult == 'loss'">
    Congratulations! You have correctly guessed the album cover as "{{
      gameAlbumName
    }}" in {{ gameTime }} seconds and in {{ gameAttempts }} attempts.
  </div>
</template>
<script>
export default {
  name: "Result-Screen-Component",
  props: {
    gameResult: String,
    gameTime: String,
    gameAttempts: String,
    gameAlbumName: String,
  },
};
</script>
<style scoped></style>
