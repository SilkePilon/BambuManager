import asyncio
from bambu_cloud import Client, Region

import asyncio

async def main():
    client = await Client.login(Region.EUROPE, "silkepilon2009@gmail.com", "Landrover@01")
    profile = await client.get_profile()
    print(profile)

    devices = await client.get_devices()
    print(devices)

    tasks = await client.get_tasks()
    print(tasks)

asyncio.run(main())