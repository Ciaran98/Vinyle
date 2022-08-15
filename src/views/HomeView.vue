<template>
  <div id="infoModal" class="modal">
    <!-- Modal content -->
    <div class="modal-content" id="contentModal">
      <span class="close" @click="closeModal">&times;</span>
      <h1>How To Play</h1>
      <hr />
      <h2>Welcome to Vinyle!</h2>
      <p>
        At the beginning of the game, you are given a pixelated album cover, and
        you have to guess the name of the album. You need to be careful, you
        only have 6 guess attempts, or 20 seconds to guess the name of the
        album. If the timer reaches 0, or you run out of guesses, you lose. If
        you successfully guess the album, you can share your results!
      </p>
    </div>
  </div>

  <div class="play-buttons">
    <button class="modal-button how-to-play" @click="openModal">
      How to play</button
    ><br />
    <input
      id="vinyleCalendar"
      type="date"
      min="2022-07-07"
      @change="selectDate($event)"
    />
    <Vinyle
      :vinyle-name="this.albumName"
      :vinyle-game-type="this.gamemodeSelected"
      :vinyle-completed-today="this.todayCompleted"
      :vinyle-is-today="this.isToday"
      :vinyle-todays-album="this.todaysAlbum"
      :vinyle-game-number="this.gameNumber"
      @update-completed-today="updateCompleted"
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
import VinyleApi from "../services/VinyleApi.js";
export default {
  name: "HomeView",
  components: {
    Vinyle,
  },
  data() {
    return {
      albumName: "default",
      gamemodeSelected: "",
      serverError: false,
      todayCompleted: false,
      isToday: false,
      todaysAlbum: "",
      gameNumber: 0,
      modalToggled: false,
    };
  },
  mounted() {
    // Set the maximum date on the date input to today
    document.getElementById("vinyleCalendar").max = new Date(
      new Date().getTime() - new Date().getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];

    // Initialise the site with today's game of vinyle
  },
  created() {
    this.selectToday();
  },
  methods: {
    // Select today's vinyle game
    selectToday() {
      VinyleApi.getVinyleFromDate(new Date().setHours(0, 0, 0, 0))
        .then((res) => {
          this.albumName = res.data.name;
          this.gamemodeSelected = "today";
          this.todaysAlbum = this.albumName;
          this.gameNumber = res.data.albumIndex;
          if (
            localStorage.getItem("todaysGame") == null ||
            localStorage.getItem("todaysGame") != this.albumName
          ) {
            localStorage.setItem("todaysGame", this.albumName);
          }
          if (localStorage.getItem("previousGamePlayed") != null) {
            if (
              localStorage
                .getItem("previousGamePlayed")
                .split(",")[0]
                .replace(/[^a-zA-Z0-9]/g, "")
                .toLocaleLowerCase() !=
              this.todaysAlbum.replace(/[^a-zA-Z0-9]/g, "").toLocaleLowerCase()
            ) {
              localStorage.removeItem("previousGamePlayed");
            }
          }
          this.checkIfTodayCompleted(this.albumName);
          this.isToday = true;
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
          this.albumName = res.data.name;
          this.gamemodeSelected = this.checkIfToday(date);
          this.gameNumber = res.data.albumIndex;
          this.checkIfTodayCompleted(this.albumName);
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
        this.isToday = true;
        return "today";
      } else {
        this.isToday = false;
        return "calendar";
      }
    },
    // Check if the game selected has already been completed today
    checkIfTodayCompleted() {
      if (
        localStorage.getItem("previousGamePlayed") != null &&
        localStorage.getItem("todaysGame") != null
      ) {
        let prevGame = localStorage.getItem("previousGamePlayed").split(",");
        let todayGame = localStorage
          .getItem("todaysGame")
          .replace(/[^a-zA-Z0-9]/g, "")
          .toLocaleLowerCase();
        if (prevGame[0] == todayGame) {
          this.todayCompleted = true;
        } else {
          this.todayCompleted = false;
        }
      }
    },
    updateCompleted(payload) {
      this.todayCompleted = payload;
    },
    openModal() {
      document.getElementById("infoModal").style.display = "block";
    },
    closeModal() {
      document.getElementById("infoModal").style.display = "none";
    },
  },
};
</script>

<style scoped>
.play-anim {
  animation: openmodal 1s linear 0 1 normal forwards;
}
.reverse-anim {
  animation: closemodal 1s linear 0 1 normal forwards;
}
div.play-buttons > * {
  margin: 20px;
}
.modal-button {
  width: 150px !important;
}
div.play-buttons {
  padding-bottom: 60px;
}
</style>
