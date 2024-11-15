import asyncio
from pybambu import BambuClient

async def control_printer():
    # Initialize the Bambu client with your configuration
    config = {
        'host': '192.168.1.100',
        'access_code': 'your_access_code',
        'serial': 'your_printer_serial'
    }

    async with BambuClient(config) as client:
        # Connect to the printer
        await client.connect(callback=None)

        # Get the device information
        device = client.get_device()
        print(f"Printer info: {device.info}")

        # Subscribe to printer events and request initial data
        client.subscribe_and_request_info()

        # Enable the chamber image feature
        client.set_camera_enabled(True)

        # Force a data refresh
        await client.refresh()

        # Publish a custom message to the printer
        client.publish({'command': 'start_print'})

        # Disconnect from the printer
        client.disconnect()

asyncio.run(control_printer())