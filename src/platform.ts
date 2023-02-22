import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig, Service, Characteristic } from 'homebridge';

import { PLATFORM_NAME, PLUGIN_NAME } from './settings';
import { GoogleSpeakerSwitch } from './platformAccessory';
import { getGoogleCast, IGoogleCast } from './googleCast';
import {Categories} from "hap-nodejs/dist/lib/Accessory";


export class GoogleSpeaker implements DynamicPlatformPlugin {
  public readonly Service: typeof Service = this.api.hap.Service;
  public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;

  // this is used to track restored cached accessories
  public readonly accessories: PlatformAccessory[] = [];

  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
    this.api.on('didFinishLaunching', async () => {
      await this.discoverDevices();
    });
  }

  /**
   * This function is invoked when homebridge restores cached accessories from disk at startup.
   * It should be used to setup event handlers for characteristics and update respective values.
   */
  configureAccessory(accessory: PlatformAccessory) {
    this.accessories.push(accessory);
  }

  /**
   * This is an example method showing how to register discovered accessories.
   * Accessories must only be registered once, previously created accessories
   * must not be registered again to prevent "duplicate UUID" errors.
   */
  async discoverDevices() {
    const device: IGoogleCast = await getGoogleCast();
    const uuid = this.api.hap.uuid.generate(device.ip);

    const existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid);
    //
    if (existingAccessory) {
      this.log.info('Restoring existing accessory from cache:', existingAccessory.displayName);
      new GoogleSpeakerSwitch(this, existingAccessory);
    } else {
      this.log.info('Adding new accessory:', device.name);
      const accessory = new this.api.platformAccessory(`${device.room}_${device.name}`, uuid, Categories.SWITCH);
      accessory.context.device = device;
      new GoogleSpeakerSwitch(this, accessory);
      this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
    }
  }
}
