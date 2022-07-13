import axios from "axios";

const url = "https://vinyle-game.herokuapp.com";
//const url = "http://localhost:3000"
export default {
  // function to call api to get vinyle album from specified date
  getVinyleFromDate(time) {
    return axios
      .get(url + "/getVinyleFromDate", { params: { time: time } })
      .then((res) => res)
      .catch((err) => {
        console.error(err);
      });
  },
};
