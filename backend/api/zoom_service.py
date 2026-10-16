import os
import requests
import logging

logger = logging.getLogger(__name__)

class ZoomService:
    @staticmethod
    def is_configured():
        account_id = os.environ.get('ZOOM_ACCOUNT_ID')
        client_id = os.environ.get('ZOOM_CLIENT_ID')
        client_secret = os.environ.get('ZOOM_CLIENT_SECRET')
        return bool(account_id and client_id and client_secret)

    @staticmethod
    def get_access_token():
        if not ZoomService.is_configured():
            return None, "Zoom integration is NOT_CONFIGURED on backend environment."

        account_id = os.environ.get('ZOOM_ACCOUNT_ID')
        client_id = os.environ.get('ZOOM_CLIENT_ID')
        client_secret = os.environ.get('ZOOM_CLIENT_SECRET')

        url = f"https://zoom.us/oauth/token?grant_type=account_credentials&account_id={account_id}"
        try:
            res = requests.post(url, auth=(client_id, client_secret), timeout=10)
            if res.status_code == 200:
                data = res.json()
                return data.get('access_token'), None
            else:
                logger.error(f"Zoom OAuth token request failed: {res.status_code} {res.text}")
                return None, f"Zoom Authentication Error: {res.json().get('reason', 'Failed to authenticate with Zoom API')}"
        except Exception as e:
            logger.exception("Exception requesting Zoom OAuth token")
            return None, f"Network or Zoom API error: {str(e)}"

    @staticmethod
    def create_meeting(topic, start_time_iso, duration_minutes=60, agenda=""):
        if not ZoomService.is_configured():
            return {
                "success": False,
                "status": "NOT_CONFIGURED",
                "message": "Zoom credentials are not configured on the server. Please set ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, and ZOOM_CLIENT_SECRET."
            }

        token, err = ZoomService.get_access_token()
        if err:
            return {
                "success": False,
                "status": "ERROR",
                "message": err
            }

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        payload = {
            "topic": topic,
            "type": 2, # Scheduled meeting
            "start_time": start_time_iso,
            "duration": duration_minutes,
            "timezone": "Asia/Kolkata",
            "agenda": agenda,
            "settings": {
                "host_video": True,
                "participant_video": False,
                "join_before_host": False,
                "mute_upon_entry": True,
                "auto_recording": "none"
            }
        }

        try:
            response = requests.post("https://api.zoom.us/v2/users/me/meetings", json=payload, headers=headers, timeout=12)
            if response.status_code == 201:
                data = response.json()
                return {
                    "success": True,
                    "status": "ACTIVE",
                    "meeting_id": str(data.get('id')),
                    "join_url": data.get('join_url'),
                    "start_url": data.get('start_url'), # Host URL, server-side only
                    "passcode": data.get('password', ''),
                    "message": "Zoom meeting created successfully!"
                }
            else:
                error_msg = response.json().get('message', 'Failed to create Zoom meeting.')
                return {
                    "success": False,
                    "status": "ERROR",
                    "message": f"Zoom API Error ({response.status_code}): {error_msg}"
                }
        except Exception as e:
            return {
                "success": False,
                "status": "ERROR",
                "message": f"Zoom API network request failed: {str(e)}"
            }
