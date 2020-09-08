import json
from iconsdk.icon_service import IconService
from iconsdk.providers.http_provider import HTTPProvider

# Creates an IconService instance using the HTTP provider and set a provider.
icon_service = IconService(HTTPProvider('https://bicon.net.solidwallet.io', 3))
block = icon_service.get_block('latest')

print(json.dumps(block, indent = 2))

# curl -X POST https://bicon.net.solidwallet.io/api/v3 -H "'Content-Type': 'application/json'" -d '{ "jsonrpc": "2.0", "method": "icx_getLastBlock", "id": 12345 }'

# Block heigh is a lowercase hex value, if not it will cause 500 error.
# curl -X POST https://bicon.net.solidwallet.io/api/v3 -H "'Content-Type': 'application/json'" -d '{ "params": {"height": "0x63865A"}, "jsonrpc": "2.0", "method": "icx_getBlockByHeight", "id": 12345 }'
