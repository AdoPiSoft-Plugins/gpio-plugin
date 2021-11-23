import RPi.GPIO as GPIO, sys, time

pinNumberingType = GPIO.BOARD
bouncetime = 36
readingtype = 1
PIN_NUM
BOUNCE_TIME
READING_TYPE

interval = 0.01 if readingtype==2 else 1
prev = 1

def setup():
    GPIO.setwarnings(False)
    GPIO.setmode(pinNumberingType)
    GPIO.setup(pinNum, GPIO.IN, pull_up_down=GPIO.PUD_UP)
    if (readingtype == 1):
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
