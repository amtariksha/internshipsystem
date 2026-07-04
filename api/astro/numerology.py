"""
Vercel Python Serverless Function: Quick AstroCareer analysis.
Input: name + DOB → Chaldean numerology + Sun/Moon sign → top 5 careers.
"""

from http.server import BaseHTTPRequestHandler
import json
from .lib.chaldean import get_numerology as get_numerology_chaldean
from .lib.pythagorean import get_numerology as get_numerology_pythagorean
from .lib.vedic import get_sun_sign, get_moon_sign_approx
from .lib.careers import get_careers_from_numerology

# Supported numerology systems → their get_numerology implementation.
NUMEROLOGY_SYSTEMS = {
    'chaldean': get_numerology_chaldean,
    'pythagorean': get_numerology_pythagorean,
}
DEFAULT_SYSTEM = 'chaldean'


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = json.loads(self.rfile.read(content_length)) if content_length else {}

        name = body.get('name', '')
        dob = body.get('dob', '')  # Format: YYYY-MM-DD
        system = str(body.get('system') or DEFAULT_SYSTEM).lower()

        if not name or not dob:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'name and dob are required'}).encode())
            return

        if system not in NUMEROLOGY_SYSTEMS:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'error': f"system must be one of: {', '.join(sorted(NUMEROLOGY_SYSTEMS))}"
            }).encode())
            return

        try:
            # Numerology (dispatch on chosen system)
            get_numerology = NUMEROLOGY_SYSTEMS[system]
            numerology = get_numerology(name, dob)

            # Sun and Moon signs
            sun_sign = get_sun_sign(dob)
            moon_sign = get_moon_sign_approx(dob)

            # Career suggestions based on destiny number
            careers = get_careers_from_numerology(numerology['destinyNumber'])

            result = {
                'name': name,
                'dob': dob,
                'system': system,
                'script': numerology['script'],
                'destinyNumber': numerology['destinyNumber'],
                'soulNumber': numerology['soulNumber'],
                'personalityNumber': numerology['personalityNumber'],
                'nameNumber': numerology['nameNumber'],
                'sunSign': sun_sign,
                'moonSign': moon_sign,
                'topCareers': careers,
            }

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
