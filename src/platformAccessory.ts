import { Service, PlatformAccessory, CharacteristicValue } from 'homebridge';

import { GoogleSpeaker } from './platform';

export class GoogleSpeakerSwitch {
  private service: Service;
  private state = {
    On: false
  };

  constructor(
    private readonly platform: GoogleSpeaker,
    private readonly accessory: PlatformAccessory,
  ) {

    // set accessory information
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Default-Manufacturer')
      .setCharacteristic(this.platform.Characteristic.Model, 'Default-Model')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'Default-Serial');

    this.service = this.accessory.getService(this.platform.Service.Switch) || this.accessory.addService(this.platform.Service.Switch);
    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.name);

    this.service.getCharacteristic(this.platform.Characteristic.On)
      .onSet(this.setOn.bind(this))                // SET - bind to the `setOn` method below
      .onGet(this.getOn.bind(this));               // GET - bind to the `getOn` method below

    // const motionSensorOneService = this.accessory.getService('Music 1') ||
    //   this.accessory.addService(this.platform.Service.Switch, 'Music 1', 'YourUniqueIdentifier-1');
    //
    // const motionSensorTwoService = this.accessory.getService('Music 2') ||
    //   this.accessory.addService(this.platform.Service.Switch, 'Music 1', 'YourUniqueIdentifier-2');

    // let motionDetected = false;
    // setInterval(() => {
    //   motionDetected = !motionDetected;
    //
    //   motionSensorOneService.updateCharacteristic(this.platform.Characteristic.MotionDetected, motionDetected);
    //   motionSensorTwoService.updateCharacteristic(this.platform.Characteristic.MotionDetected, !motionDetected);
    //
    //   this.platform.log.debug('Triggering motionSensorOneService:', motionDetected);
    //   this.platform.log.debug('Triggering motionSensorTwoService:', !motionDetected);
    // }, 10000);
  }

  async setOn(value: CharacteristicValue) {
    this.state.On = value as boolean;
    this.platform.log.debug('Set Characteristic On ->', value);
  }

  async getOn(): Promise<CharacteristicValue> {
    const isOn = this.state.On;
    this.platform.log.debug('Get Characteristic On ->', isOn);

    return isOn;
  }
}
