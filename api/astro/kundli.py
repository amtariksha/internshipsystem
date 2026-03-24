"""
Vercel Python Serverless Function: Full Kundli analysis.
Input: name + DOB + birth time + place → full Vedic chart + career analysis.
"""

from http.server import BaseHTTPRequestHandler
import json
from .lib.chaldean import get_numerology
from .lib.vedic import compute_full_chart
from .lib.careers import get_careers_from_numerology, get_careers_from_chart


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = json.loads(self.rfile.read(content_length)) if content_length else {}

        name = body.get('name', '')
        dob = body.get('dob', '')  # YYYY-MM-DD
        birth_time = body.get('birthTime', '')  # HH:MM
        latitude = body.get('latitude')
        longitude = body.get('longitude')

        if not all([name, dob, birth_time, latitude, longitude]):
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'error': 'name, dob, birthTime, latitude, and longitude are required'
            }).encode())
            return

        try:
            lat = float(latitude)
            lng = float(longitude)

            # Numerology
            numerology = get_numerology(name, dob)

            # Full Vedic chart
            chart = compute_full_chart(dob, birth_time, lat, lng)

            # Career suggestions from both numerology and chart
            num_careers = get_careers_from_numerology(numerology['destinyNumber'])
            chart_careers = get_careers_from_chart(chart['planetaryData'], chart['houseData'])

            # Merge and deduplicate, preferring chart-based when available
            seen = set()
            merged_careers = []
            for c in chart_careers + num_careers:
                if c['career'] not in seen:
                    merged_careers.append(c)
                    seen.add(c['career'])
            merged_careers = merged_careers[:5]

            result = {
                'name': name,
                'dob': dob,
                'birthTime': birth_time,
                'script': numerology['script'],
                'destinyNumber': numerology['destinyNumber'],
                'soulNumber': numerology['soulNumber'],
                'personalityNumber': numerology['personalityNumber'],
                'sunSign': chart['sunSign'],
                'moonSign': chart['moonSign'],
                'ascendant': chart['ascendant'],
                'ascendantSanskrit': chart['ascendantSanskrit'],
                'planetaryData': chart['planetaryData'],
                'houseData': chart['houseData'],
                'dashaData': chart['dashaData'],
                'topCareers': merged_careers,
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
