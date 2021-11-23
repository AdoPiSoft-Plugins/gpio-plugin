import sys
import time

PIN_NUM

gpio_path = "/sys/class/gpio"
export_path = gpio_path + "/export"
value_path = gpio_path + "/gpio" + str(pinNum) + "/value"

interval = 0.02
prev = "1"

try:
    export_file = open(export_path, "w")
    export_file.write(str(pinNum))
    export_file.close()
except:
    pass

while True:

    gpio_value_file = open(value_path, "r")
    gpio_val = gpio_value_file.read().strip()
    gpio_value_file.close()

    if (prev != gpio_val and gpio_val == "0"):
        print gpio_val
        sys.stdout.flush()

    prev = gpio_val
    time.sleep(interval)



