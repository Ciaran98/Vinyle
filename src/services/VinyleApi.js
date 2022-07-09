import axios from "axios";

const url = "http://localhost:3000/";
export default {
  // Function to call api to get today's vinyle album
  getTodayVinyle() {
    return axios
      .get(url + "getToday")
      .then((res) => res)
      .catch((err) => {
        console.error(err);
      });
  },
  // function to call api to get vinyle album from specified date
  getVinyleFromDate(time) {
    return axios
      .get(url + "getVinyleFromDate", { params: { time: time } })
      .then((res) => res)
      .catch((err) => {
        console.error(err);
      });
  },
};
