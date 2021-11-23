const test_file = '../../classes/gpio.js'
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const { expect } = require('chai')
const fs = require('fs')
const path = require('path')
const scripts_dir = path.resolve(__dirname, '../../python-scripts')
const { EventEmitter } = require('events')

describe(test_file, () => {
  let Gpio, child_process, proc

  beforeEach(() => {
    proc = new EventEmitter()
    proc.stdout = new EventEmitter()
    child_process = {
      spawn: sinon.fake(() => proc)
    }
    Gpio = proxyquire(test_file, {
      child_process
    })
  })

  describe('GPIO input', async () => {

    const tpl = `
import RPi.GPIO as GPIO, sys, time

bouncetime = 36
pinNum = 1

interval = 0.01 if readingtype==2 else 1
prev = 1

def setup():
    GPIO.setwarnings(False)
    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(pinNum, GPIO.IN, pull_up_down=GPIO.PUD_UP)
    GPIO.add_event_detect(pinNum, GPIO.FALLING, callback=coinInterrupt, bouncetime=bouncetime)

def coinInterrupt(pin):
    if (GPIO.input(pinNum) == 0):
        print str(1)
        sys.stdout.flush()

def loop():
    global prev
    gpio_val = GPIO.input(pinNum)
    if (prev == 1 and gpio_val == 0):
        print str(1)
        sys.stdout.flush()
    prev = gpio_val

setup()

if(readingtype == 2):
    while 1:
        loop()
        time.sleep(interval)
else:
    while 1:
        time.sleep(interval)
    `
    const gpio = new Gpio({
      direction: 'input',
      board: 'rpi',
      pin: 3,
    })
    await gpio.init()
    const tpl = await fs.readFile('/tmp/rpi-input-3.py')
    sinon.assert.calledWithExactly(child_process.spawn, 'python', ['/tmp/rpi-input-3.py'])
    const spy = sinon.fake()
    gpio.on('data', spy)
    proc.stdout.emit('data')
    sinon.assert.calledWithExactly(spy, 1)
  })
})
