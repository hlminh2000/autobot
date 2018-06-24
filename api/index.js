const PORT = process.env.PORT || 3000
const {Gpio} = require('onoff')
const express = require('express')
const app = express()

const LED = new Gpio(4, 'out')

app.use('/on', (req, res) => {
	LED.writeSync(1)
	res.end("ON!!!")
})

app.use('/off', (req, res) => {
	LED.writeSync(0)
	res.end("OFF!!!")
})

app.listen(PORT, () => {
	console.log(`listening on port: ${PORT}`)
})
