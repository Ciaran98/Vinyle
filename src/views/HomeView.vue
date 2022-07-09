<template>
  <div class="home">
    <div class="play-buttons">
      <input
        id="vinyleCalendar"
        type="date"
        min="2022-07-07"
        @change="selectDate($event)"
      />
    </div>
    <Countdown />
    <Vinyle
      :alb-name="this.albumName"
      :cover-url="this.albumCover"
      :game-type="this.gamemodeSelected"
      :completed-already="this.todayCompleted"
      @update-completed-already="updateCompleted"
    />
  </div>
</template>

<script>
// Reminder of what local storage data represents
// 1st item is the album name
// 2nd item is the time in seconds it took for the user to guess the cover
// 3rd item is the amount of guesses used
// 4th is if the user won or lost the round
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
      gamemodeSelected: "",
      serverError: false,
      todayCompleted: false,
    };
  },
  mounted() {
    // Set the maximum date on the date input to today
    document.getElementById("vinyleCalendar").max = new Date()
      .toISOString()
      .split("T")[0];
    // Initialise the site with today's game of vinyle
    this.selectToday();
  },
  methods: {
    // Select today's vinyle game
    selectToday() {
      VinyleApi.getTodayVinyle()
        .then((res) => {
          this.albumCover = res.data.image;
          this.albumName = res.data.name;
          this.playToday = true;
          this.gamemodeSelected = "today";
          this.checkIfCompleted(this.albumName);
        })
        .catch((err) => {
          this.serverError = true;
          console.error(err);
        });
    },
    // Select vinyle game from a date chosen from the date input
    selectDate(event) {
      let date = new Date(event.target.value).setHours(0, 0, 0, 0);
      VinyleApi.getVinyleFromDate(date)
        .then((res) => {
          this.albumCover = res.data.image;
          this.albumName = res.data.name;
          this.gamemodeSelected = this.checkIfToday(date);
          this.checkIfCompleted(this.albumName);
        })
        .catch((err) => {
          this.serverError = true;
          console.error(err);
        });
    },
    // Check if the date selected on the date input is today, and set the gametype accordingly
    checkIfToday(date) {
      let dateToday = new Date().setHours(0, 0, 0, 0);
      if (date == dateToday) {
        return "today";
      } else {
        return "calendar";
      }
    },
    // Check if the game selected has already been completed today
    checkIfCompleted(alName) {
      if (localStorage.getItem("previousGamePlayed") != null) {
        let prevGame = localStorage.getItem("previousGamePlayed").split(",");
        if (prevGame[0] == alName) {
          this.todayCompleted = true;
        } else if (this.gamemodeSelected == "today" && prevGame[0] != alName) {
          localStorage.removeItem("previousGamePlayed");
          this.todayCompleted = false;
        } else {
          this.todayCompleted = false;
        }
      }
    },
    updateCompleted(payload) {
      this.todayCompleted = payload;
    },
  },
};
</script>

<style scoped>
div.play-buttons > * {
  margin: 20px;
}
</style>
