import requests
import json

query = {
    "request": {
        "Auth": {
            "Phone": "7012326844",
            "Username": "Rbaker",
            "Password": "Ldrsgt@1738"
        },
        "Request": {
            "DataFormat": "json",
            "Module": "membership",
            "Section": "directory",
            "Action": "read"
        }
    }
}

url = "https://secure3.iconcmo.com/api/"
headers = {'Content-Type': 'application/json'}

req = requests.Request('POST', url, data=json.dumps(query), headers=headers)
prepared = req.prepare()

print("=== Request URL ===")
print(prepared.url)
print("\n=== Request Headers ===")
print(prepared.headers)
print("\n=== Request Body ===")
print(prepared.body)
