import json
from typing import List, Optional
from dataclasses import dataclass
from enum import Enum
import cloudscraper
import asyncio
from requests.exceptions import RequestException
from jwt import decode, InvalidTokenError
from datetime import datetime
from urllib.parse import urlparse

class Region(Enum):
    CHINA = 'cn'
    EUROPE = 'eu'
    NORTH_AMERICA = 'na'
    ASIA_PACIFIC = 'ap'
    OTHER = 'other'

    def is_china(self) -> bool:
        return self == Region.CHINA

@dataclass
class Device:
    name: str
    online: bool
    dev_id: str
    print_status: str
    nozzle_diameter: float
    dev_model_name: str
    dev_access_code: str
    dev_product_name: str

    async def get_bambu_camera_url(self, client: 'Client') -> str:
        response = await client.client.post(
            f"https://api.bambulab.{'cn' if client.region.is_china() else 'com'}/v1/iot-service/api/user/ttcode",
            headers={
                "Authorization": f"Bearer {client.auth_token.jwt}",
                "user-id": client.auth_token.username
            },
            json={"dev_id": self.dev_id}
        )
        response.raise_for_status()
        camera_response = await response.json()
        return f"bambu:///{ camera_response['ttcode']}?authkey={camera_response['authkey']}&passwd={camera_response['passwd']}&region={camera_response['region']}"

@dataclass
class AMSDetail:
    position: int
    source_color: str
    target_color: str
    filament_id: str
    filament_type: str
    target_filament_type: str
    weight: float

@dataclass
class Task:
    id: int
    design_id: int
    design_title: str
    instance_id: int
    model_id: str
    title: str
    cover: str
    status: int
    feedback_status: int
    start_time: datetime
    end_time: datetime
    weight: float
    length: int
    cost_time: int
    profile_id: int
    plate_index: int
    plate_name: str
    device_id: str
    ams_detail_mapping: List[AMSDetail]
    mode: str
    is_public_profile: bool
    is_printable: bool
    device_model: str
    device_name: str
    bed_type: str

@dataclass
class Personal:
    bio: str
    links: List[str]
    task_weight_sum: float
    task_length_sum: int
    task_time_sum: int
    background_url: str

@dataclass
class Account:
    uid: int
    email: str
    name: str
    avatar: str
    fan_count: int
    follow_count: int
    like_count: int
    collection_count: int
    download_count: int
    product_models: List[str]
    my_like_count: int
    favourites_count: int
    point: int
    personal: Personal

class Token:
    def __init__(self, jwt: str):
        self.jwt = jwt
        self.username = self.parse_username(jwt)

    @staticmethod
    def parse_username(jwt: str) -> str:
        try:
            token_data = decode(jwt, options={"verify_signature": False})
            return token_data["username"]
        except (InvalidTokenError, KeyError):
            return ""

class LoginResponse:
    def __init__(self, access_token: str, need_two_factor_auth: bool):
        self.access_token = access_token
        self.need_two_factor_auth = need_two_factor_auth

class DevicesResponse:
    def __init__(self, devices: List[Device]):
        self.devices = devices

class TasksResponse:
    def __init__(self, total: int, hits: List[Task]):
        self.total = total
        self.hits = hits

class DeviceCameraError(Exception):
    pass

class Client:
    def __init__(self, region: Region, auth_token: Token):
        self.region = region
        self.client = cloudscraper.create_scraper()
        self.auth_token = auth_token

    @classmethod
    async def login(cls, region: Region, email: str, password: str) -> 'Client':
        scraper = cloudscraper.create_scraper()
        try:
            # First, try to log in without 2FA
            response = scraper.post(
                f"https://api.bambulab.{'cn' if region.is_china() else 'com'}/v1/user-service/user/login",
                json={"account": email, "password": password},
                headers={'Origin': 'https://bambulab.com/en'}
            )
            response.raise_for_status()
            login_response = response.json()
            
            print(login_response)

            # Check if 2FA is required
            if login_response.get("loginType") == "verifyCode":
                # Prompt the user for the 2FA code
                two_factor_code = input("Please enter the 2FA code sent to your email: ")

                # Send the 2FA code to the API
                two_factor_response = scraper.post(
                    f"https://api.bambulab.{'cn' if region.is_china() else 'com'}/v1/user-service/user/login",
                    json={"account": email, "code": two_factor_code}
                )
                two_factor_response.raise_for_status()
                login_response = two_factor_response.json()
                
                print(login_response)

            access_token = login_response["accessToken"]
            auth_token = Token(access_token)
        except RequestException as e:
            raise Exception(f"Failed to send login request: {e}") from e
        except (json.JSONDecodeError, InvalidTokenError) as e:
            raise Exception(f"Failed to parse login response: {e}") from e

        return cls(region, auth_token)

    async def get_profile(self) -> Account:
        response = self.client.get(
            f"https://api.bambulab.{'cn' if self.region.is_china() else 'com'}/v1/user-service/my/profile",
            headers={"Authorization": f"Bearer {self.auth_token.jwt}"}
        )
        response.raise_for_status()
        account_data = response.json()
        return Account(
            uid=account_data["uid"],
            email=account_data["email"],
            name=account_data["name"],
            avatar=account_data["avatar"],
            fan_count=account_data["fanCount"],
            follow_count=account_data["followCount"],
            like_count=account_data["likeCount"],
            collection_count=account_data["collectionCount"],
            download_count=account_data["downloadCount"],
            product_models=account_data["productModels"],
            my_like_count=account_data["myLikeCount"],
            favourites_count=account_data["favouritesCount"],
            point=account_data["point"],
            personal=Personal(
                bio=account_data["personal"]["bio"],
                links=[link for link in account_data["personal"]["links"]],
                task_weight_sum=account_data["personal"]["taskWeightSum"],
                task_length_sum=account_data["personal"]["taskLengthSum"],
                task_time_sum=account_data["personal"]["taskTimeSum"],
                background_url=account_data["personal"]["backgroundUrl"]
            )
        )

    async def get_devices(self) -> List[Device]:
        response = self.client.get(
            f"https://api.bambulab.{'cn' if self.region.is_china() else 'com'}/v1/iot-service/api/user/bind",
            headers={"Authorization": f"Bearer {self.auth_token.jwt}"}
        )
        response.raise_for_status()
        devices_response = DevicesResponse(
            [Device(**device_data) for device_data in (response.json())["devices"]]
        )
        return devices_response.devices

    async def get_tasks(self, only_device: Optional[str] = None) -> List[Task]:
        params = {"limit": "500", "deviceId": only_device or ""}
        response = self.client.get(
            f"https://api.bambulab.{'cn' if self.region.is_china() else 'com'}/v1/user-service/my/tasks",
            params=params,
            headers={"Authorization": f"Bearer {self.auth_token.jwt}"}
        )
        response.raise_for_status()
        tasks_response = response.json()
        return [
            Task(
                id=task_data["id"],
                design_id=task_data["designId"],
                design_title=task_data["designTitle"],
                instance_id=task_data["instanceId"],
                model_id=task_data["modelId"],
                title=task_data["title"],
                cover=task_data["cover"],
                status=task_data["status"],
                feedback_status=task_data["feedbackStatus"],
                start_time=datetime.fromisoformat(task_data["startTime"]),
                end_time=datetime.fromisoformat(task_data["endTime"]),
                weight=task_data["weight"],
                length=task_data["length"],
                cost_time=task_data["costTime"],
                profile_id=task_data["profileId"],
                plate_index=task_data["plateIndex"],
                plate_name=task_data["plateName"],
                device_id=task_data["deviceId"],
                ams_detail_mapping=[AMSDetail(**ams_detail) for ams_detail in task_data["amsDetailMapping"]],
                mode=task_data["mode"],
                is_public_profile=task_data["isPublicProfile"],
                is_printable=task_data["isPrintable"],
                device_model=task_data["deviceModel"],
                device_name=task_data["deviceName"],
                bed_type=task_data["bedType"]
            )
            for task_data in tasks_response["hits"]
        ]

    def mqtt_host(self) -> str:
        return "cn.mqtt.bambulab.com" if self.region.is_china() else "us.mqtt.bambulab.com"

