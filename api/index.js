const PORT = process.env.PORT || 3000;
const { Gpio } = require("onoff");
const express = require("express");
const app = express();
const { get } = require("lodash");
var cors = require("cors");

const state = {
  livingRoom: {
    light: {
      pin: 4,
      on: false
    }
  }
};

app.use(cors());

app.use("/toggle", (req, res) => {
  const { path } = req;
  const statePath = path
    .split("/")
    .filter(p => p.length)
    .join(".");
  const stateObj = get(state, statePath);
  console.log(statePath);
  console.log(stateObj);
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
