const PORT = process.env.PORT || 4000;
const { Gpio } = require("onoff");
const moment = require("moment");
const fetch = require("node-fetch");
const express = require("express");
const { get } = require("lodash");
const schedule = require("node-schedule");
const cors = require("cors");

const state = {
  livingRoom: {
    light: {
      pin: 4,
      on: false
    }
  }
};

// tasks
const getSunTimes = ({ lng = -4.42034, lat = 36.72016, date = "today" } = {}) =>
  fetch(
    `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${date}`
  ).then(res => res.json());

const scheduleSunset = () =>
  getSunTimes({
    lat: 43.659718,
    lng: -79.36274,
    date: "today"
  }).then(({ results: { sunset } }) => {
    const localTime = moment(sunset, "LTS")
      .utc()
      .valueOf();
    console.log(`scheduling Sunset at: ${localTime}`);
    schedule.scheduleJob(new Date(localTime), () => {
      if (!state.livingRoom.light.on) {
        fetch(`http://localhost:${PORT}/toggle/livingRoom/light`);
      }
    });
  });

schedule.scheduleJob("* * 6 * * *", scheduleSunset);
scheduleSunset();

const app = express();
app.use(cors());
app.use("/toggle", (req, res) => {
  const { path } = req;
  const statePath = path
    .split("/")
    .filter(p => p.length)
    .join(".");
  const stateObj = get(state, statePath);
  if (stateObj) {
    const port = new Gpio(stateObj.pin, "out");
    stateObj.on = !stateObj.on;
    port.writeSync(Number(stateObj.on));
  }
  res.send(state);
});

app.use("/state", (req, res) => res.send(state));

app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
