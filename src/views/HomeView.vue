<template>
  <div class="home">
    <div class="play-buttons">
      <button @click="selectToday" v-if="!playToday">Today's Vinyle</button>
      <input
        type="date"
        min="2022-07-01"
        max="2022-07-08"
        @change="selectDate($event)"
      />
    </div>
    <Countdown />
    <Vinyle
      :alb-name="this.albumName"
      :cover-url="this.albumCover"
      v-if="gamemodeSelected"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import Vinyle from "@/components/Vinyle.vue";
import Countdown from "@/components/Countdown.vue";
import VinyleApi from "../services/VinyleApi.js";
export default {
  name: "HomeView",
  components: {
    Vinyle,
    Countdown,
  },
  data() {
    return {
      playToday: false,
      albumCover: "",
      albumName: "",
      gamemodeSelected: false,
      serverError: false,
    };
  },
  methods: {
    selectToday() {
      VinyleApi.getTodayVinyle()
        .then((res) => {
          this.albumCover = res.data.image;
          this.albumName = res.data.name;
          this.playToday = true;
          this.gamemodeSelected = true;
        })
        .catch((err) => {
          this.serverError = true;
          console.error(err);
        });
    },
    selectDate(event) {
      let date = new Date(event.target.value).setHours(0, 0, 0, 0);
      VinyleApi.getVinyleFromDate(date)
        .then((res) => {
          this.albumCover = res.data.image;
          this.albumName = res.data.name;
          this.gamemodeSelected = true;
        })
        .catch((err) => {
          this.serverError = true;
          console.error(err);
        });
    },
  },
};
</script>

<style scoped>
div.play-buttons > * {
  margin: 20px;
}
</style>
