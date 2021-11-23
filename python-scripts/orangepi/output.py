import OPi.GPIO as GPIO, sys, time
import orangepi.BOARD_NAME as board

PIN_NUM
OUTPUT

pinNumberingType = board.BOARD # BOARD

GPIO.setwarnings(False)
GPIO.setmode(pinNumberingType)
GPIO.setup(pinNum, GPIO.OUT)

GPIO.output(pinNum, output)


