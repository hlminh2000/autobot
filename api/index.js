const PORT = process.env.PORT || 3000;
const { Gpio } = require("onoff");
const express = require("express");
const app = express();
const { get } = require("lodash");

const state = {
  livingRoom: {
    light: {
      pin: 4,
      on: false
    }
  }
};

app.use("/toggle/*", (req, res) => {
  const { path } = req;
  const statePath = path
    .split("/")
    .filter(p => p !== "toggle")
    .join(".");
  const stateObj = get(state, statePath);
  if (stateObj) {
    const port = new Gpio(stateObj.pin, "out");
    stateObj.on = !stateObj.on;
    port.writeSync(stateObj.on);
  }
  res.send(state);
});

app.use("/state", (req, res) => res.send(state));

app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
