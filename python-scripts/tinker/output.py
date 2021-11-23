import ASUS.GPIO as GPIO, sys, time

# pin_var
# output_var
# output = 0 or 1 #
# pinNum = 3
PIN_NUM
OUTPUT

pinNumberingType = GPIO.BOARD # BOARD

GPIO.setwarnings(False)
GPIO.setmode(pinNumberingType)
GPIO.setup(pinNum, GPIO.OUT)

GPIO.output(pinNum, output)


