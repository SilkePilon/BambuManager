<details open>
<summary>**BambuLab Client Documentation**</summary>

## Overview

The `BambuClient` class is a Python library that provides a client interface for connecting to a BambuLab 3D printer. It handles the MQTT communication, device information management, and optional camera image retrieval. The client can be used to monitor the printer's status, receive notifications, and control certain aspects of the printer's operation.

## Key Features

- **MQTT Communication**: Establishes a secure MQTT connection to the BambuLab printer, handling reconnections and watchdog monitoring.
- **Device Information**: Manages device information, such as model, serial number, and firmware version.
- **Print Status Monitoring**: Receives and processes print job updates, including progress, estimated time remaining, and error notifications.
- **Slicer Settings Management**: Retrieves and updates the slicer settings used by the printer.
- **Camera Image Retrieval**: Supports retrieving and processing live camera images from the printer (if the device supports this feature).
- **Configurable Connection Settings**: Allows customization of the MQTT connection, including local access mode and manual refresh mode.

## Installation

To use the `BambuClient` library, you'll need to have the following dependencies installed:

- `paho-mqtt`
- `dataclasses`

You can install these dependencies using pip:

```
pip install paho-mqtt
```

## Usage

Here's an example of how to use the `BambuClient` class:

<details>
<summary>Example Usage</summary>

```python
from __future__ import annotations

from pybambu import BambuClient

# Create a BambuClient instance with the required configuration
config = {
    'host': '192.168.1.100',
    'access_code': 'your_access_code',
    # 'auth_token': 'your_auth_token',
    # 'device_type': 'bambu_lab_x1',
    'serial': 'your_serial_number',
    # 'username': 'your_username',
    'enable_camera': True,
}

client = BambuClient(config)

# Connect to the printer
async def handle_print_update(data):
    print(f"Print status update: {data}")

client.connect(handle_print_update)

# Retrieve the device information
device = client.get_device()
print(f"Device Model: {device.info.model}")
print(f"Firmware Version: {device.info.firmware_version}")

# Monitor print jobs
device.on_print_update = handle_print_update

# Retrieve camera images (if enabled)
if client.camera_enabled:
    device.chamber_image.on_image_received = handle_camera_image

# Disconnect from the printer
client.disconnect()
```

In this example, we create a `BambuClient` instance with the required configuration parameters, such as the printer's IP address, access code, and authentication token. We then connect to the printer and start monitoring print job updates.

The `handle_print_update` function is called whenever a print job status update is received from the printer. You can customize this function to handle the print job data as needed.

If the camera is enabled, the `handle_camera_image` function will be called whenever a new camera image is received. You can implement this function to process the camera images.

Finally, we disconnect from the printer when we're done.

</details>

## API Documentation

### `BambuClient` Class

The `BambuClient` class is the main entry point for interacting with the BambuLab printer.

#### Initialization

```python
BambuClient(config: dict)
```

- `config` (dict): A dictionary containing the required configuration parameters for the client.
  - `host` (str): The IP address or hostname of the BambuLab printer.
  - `access_code` (str): The access code for the printer (required for local MQTT connection).
  - `auth_token` (str): The authentication token for the printer (required for cloud MQTT connection).
  - `device_type` (str): The type of the BambuLab device (e.g., 'bambu_lab_x1').
  - `serial` (str): The serial number of the BambuLab device.
  - `username` (str): The username for the cloud MQTT connection.
  - `enable_camera` (bool): Whether to enable the camera image retrieval feature.

#### Properties

- `connected` (bool): Indicates whether the client is currently connected to the printer.
- `manual_refresh_mode` (bool): Indicates whether the client is running in manual refresh mode, where the user must manually initiate a refresh.
- `camera_enabled` (bool): Indicates whether the camera image retrieval feature is enabled.

#### Methods

- `connect(callback: Callable)`: Connects the client to the BambuLab printer and starts the MQTT listener thread.
- `disconnect()`: Disconnects the client from the BambuLab printer.
- `refresh()`: Forcibly refreshes the device information and print job status.
- `get_device()`: Returns the `Device` object associated with the BambuLab printer.
- `set_camera_enabled(enable: bool)`: Enables or disables the camera image retrieval feature.
- `set_manual_refresh_mode(on: bool)`: Enables or disables the manual refresh mode.

### `Device` Class

The `Device` class represents the BambuLab printer and provides access to its information and capabilities.

#### Properties

- `info` (DeviceInfo): Provides access to the device's information, such as model, serial number, and firmware version.
- `print_update` (PrintUpdate): Provides access to the current print job's status, including progress, estimated time remaining, and error notifications.
- `chamber_image` (ChamberImage): Provides access to the live camera images from the printer (if available).
- `slicer_settings` (SlicerSettings): Provides access to the slicer settings used by the printer.

#### Events

- `on_print_update`: A callback function that is called whenever a print job status update is received.
- `on_image_received`: A callback function that is called whenever a new camera image is received.

### `DeviceInfo` Class

The `DeviceInfo` class represents the device information for the BambuLab printer.

#### Properties

- `model` (str): The model of the BambuLab device.
- `serial` (str): The serial number of the BambuLab device.
- `firmware_version` (str): The firmware version of the BambuLab device.
- `is_online` (bool): Indicates whether the device is currently online.

### `PrintUpdate` Class

The `PrintUpdate` class represents the current status of a print job.

#### Properties

- `progress` (float): The current progress of the print job as a percentage.
- `estimated_time_remaining` (float): The estimated time remaining for the print job (in minutes).
- `status` (str): The current status of the print job (e.g., 'Printing', 'Paused', 'Completed').
- `error` (str): Any error message associated with the print job.

### `ChamberImage` Class

The `ChamberImage` class provides access to the live camera images from the BambuLab printer.

#### Methods

- `set_jpeg(bytes: bytes)`: Sets the current JPEG image data captured from the camera.

### `SlicerSettings` Class

The `SlicerSettings` class provides access to the slicer settings used by the BambuLab printer.

#### Methods

- `update()`: Retrieves the current slicer settings from the printer.

## Conclusion

The `BambuClient` library provides a comprehensive interface for interacting with BambuLab 3D printers. It handles the low-level MQTT communication, device information management, and optional camera image retrieval, allowing you to focus on building applications that monitor and control your BambuLab printers.

Feel free to explore the code, contribute to the project, or reach out if you have any questions or feedback!

</details>
