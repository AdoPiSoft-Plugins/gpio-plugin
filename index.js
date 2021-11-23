const _require = require('@adopisoft/require')
const cmd = _require('utils/cmd')
const application = _require('config/application')

exports.install = async () => {
  const { hardware } = await application.read()
  const get_pip_py = '/tmp/get-pip.py'
  await cmd('apt update -y')
  await cmd('apt install -y build-essential')
  await cmd('apt install -y python-dev python2.7-dev python3-dev')
  await cmd(`curl https://bootstrap.pypa.io/pip/2.7/get-pip.py -o ${get_pip_py}`)
  await cmd(`python ${get_pip_py}`)
  if (hardware.startsWith('opi')) {
    await cmd('pip install --upgrade OPi.GPIO')
  } else if (hardware === 'tinker') {
    const asus_gpio_dir = '/tmp/asus-gpio'
    await cmd(`git clone https://github.com/TinkerBoard/gpio_lib_python.git ${asus_gpio_dir}`)
    await cmd('python setup.py install', {cwd: asus_gpio_dir})
  } else if (hardware.startsWith('rpi')) {
    await cmd('apt-get install mercurial -y')
    await cmd('pip install hg+http://hg.code.sf.net/p/raspberry-gpio-python/code#egg=RPi.GPIO')
  }
}
