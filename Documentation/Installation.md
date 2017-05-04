### Hardware Requirements
- Texas Instruments SensorTag CC2650
- Android Device that is BlueTooth Low Energy Capable (4.4+)
- Device to deploy apk to the android device

### Installation Instructions
- Clone this Repository
- Follow the steps to install ember js in the main directory
- Install ember-cordova (https://github.com/isleofcode/ember-cordova)
- Install the dependencies
  - bootstrap [ember install ember-bootstrap]
  - charts [ember install ember-charts]
  - local-forage [ember install ember-local-forage]
  - power-select [ember install ember-power-select]
  - ble-central [ember cdv:cordova plugin add cordova-plugin-ble-central]
  - camera [ember cdv:cordova plugin add cordova-plugin-camera]
  - geolocation [ember cdv:cordova plugin add cordova-plugin-geolocation]
  
- Build the project using "ember cdv:build --platform android"
- Push the project to your USB debug connected android device with "ember cdv run  --platform=android --devices"

### Tips for using the product
- Readings for understanding of internals
  - Emberjs (https://www.emberjs.com/)
  - Cordova (https://github.com/isleofcode/ember-cordova)
  - BLE Central (https://github.com/don/cordova-plugin-ble-central)
  
- Use a code editor like sublime text to help visualize the folder structure while coding
- Use chrome://inspect/#devices to handle debugging of the device
