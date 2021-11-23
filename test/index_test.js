const test_file = '../index.js'
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const { expect } = require('chai')

describe(test_file, () => {
  let index, _require, cmd, application, app_cfg

  beforeEach(() => {
    cmd = sinon.fake.resolves()
    application = {read: async () => app_cfg}
    _require = sinon.fake((pkg) => {
      const pkgs = {
        'utils/cmd': cmd,
        'config/application': application
      }
      return pkgs[pkg]
    })
    index = proxyquire(test_file, {
      '@adopisoft/require': _require
    })
  })

  describe('install()', () => {
    const get_pip_py = '/tmp/get-pip.py'
    const calls = [
      'apt update -y',
      'apt install -y build-essential',
      'apt install -y python-dev python2.7-dev python3-dev',
      `curl https://bootstrap.pypa.io/pip/2.7/get-pip.py -o ${get_pip_py}`,
      `python ${get_pip_py}`
    ]
    it('should install RPI gpio python module', async () => {
      app_cfg = {hardware: 'rpi_3'}
      await index.install()
      const expected_calls = [
        ...calls,
        'apt-get install mercurial -y',
        'pip install hg+http://hg.code.sf.net/p/raspberry-gpio-python/code#egg=RPi.GPIO'
      ]
      expected_calls.forEach((c, i) => {
        expect(cmd.getCall(i).args[0]).to.eql(c)
      })
    })
    it('should install OPI GPIO python module', async () => {
      app_cfg = {hardware: 'opi_zero'}
      await index.install()
      const expected_calls = [
        ...calls,
        'pip install --upgrade OPi.GPIO'
      ]
      expected_calls.forEach((c, i) => {
        expect(cmd.getCall(i).args[0]).to.eql(c)
      })
    })
    it('should install ASUS GPIO python module', async () => {
      const asus_gpio_dir = '/tmp/asus-gpio'
      app_cfg = {hardware: 'tinker'}
      await index.install()
      const expected_calls = [
        ...calls,
        `git clone https://github.com/TinkerBoard/gpio_lib_python.git ${asus_gpio_dir}`,
        'python setup.py install'
      ]
      expected_calls.forEach((c, i) => {
        expect(cmd.getCall(i).args[0]).to.eql(c)
      })
    })
  })
})
