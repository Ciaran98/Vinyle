import axios from "axios";

const url = "http://localhost:3000/";
export default {
  getTodayVinyle() {
    return axios
      .get(url + "getToday")
      .then((res) => res)
      .catch((err) => {
        console.error(err);
      });
  },
  getVinyleFromDate(time) {
    return axios
      .get(url + "getVinyleFromDate", { params: { time: time } })
      .then((res) => res)
      .catch((err) => {
        console.error(err);
      });
  },
};
