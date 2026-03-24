"""
Vedic astrology engine using pyswisseph.
Computes planetary positions, houses, and Vimshottari dasha.
"""

import swisseph as swe
from datetime import datetime
import math

# Lahiri ayanamsha (most common in Vedic astrology)
swe.set_sid_mode(swe.SIDM_LAHIRI)

SIGNS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
]

SIGNS_SANSKRIT = [
    'Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
    'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'
]

PLANETS = {
    swe.SUN: 'Sun',
    swe.MOON: 'Moon',
    swe.MARS: 'Mars',
    swe.MERCURY: 'Mercury',
    swe.JUPITER: 'Jupiter',
    swe.VENUS: 'Venus',
    swe.SATURN: 'Saturn',
    swe.MEAN_NODE: 'Rahu',
}

# Vimshottari dasha periods (years)
DASHA_YEARS = {
    'Ketu': 7, 'Venus': 20, 'Sun': 6, 'Moon': 10,
    'Mars': 7, 'Rahu': 18, 'Jupiter': 16, 'Saturn': 19, 'Mercury': 17,
}
DASHA_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury']
NAKSHATRA_LORDS = [
    'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
] * 3  # 27 nakshatras, 9 lords repeated 3 times


def datetime_to_jd(dt: datetime) -> float:
    """Convert datetime to Julian Day."""
    return swe.julday(dt.year, dt.month, dt.day,
                      dt.hour + dt.minute / 60.0 + dt.second / 3600.0)


def get_sign(longitude: float) -> tuple:
    """Get zodiac sign from longitude."""
    sign_idx = int(longitude / 30) % 12
    degree_in_sign = longitude % 30
    return sign_idx, SIGNS[sign_idx], SIGNS_SANSKRIT[sign_idx], degree_in_sign


def get_sun_sign(dob: str) -> str:
    """Approximate tropical sun sign from DOB (no birth time needed)."""
    dt = datetime.strptime(dob, '%Y-%m-%d')
    jd = datetime_to_jd(dt)
    pos = swe.calc_ut(jd, swe.SUN, swe.FLG_SWIEPH | swe.FLG_SIDEREAL)
    _, sign, _, _ = get_sign(pos[0][0])
    return sign


def get_moon_sign_approx(dob: str) -> str:
    """Approximate moon sign from DOB (assumes noon)."""
    dt = datetime.strptime(dob, '%Y-%m-%d')
    dt = dt.replace(hour=12)
    jd = datetime_to_jd(dt)
    pos = swe.calc_ut(jd, swe.MOON, swe.FLG_SWIEPH | swe.FLG_SIDEREAL)
    _, sign, _, _ = get_sign(pos[0][0])
    return sign


def compute_full_chart(dob: str, birth_time: str, lat: float, lng: float) -> dict:
    """Compute full Vedic birth chart."""
    dt = datetime.strptime(f'{dob} {birth_time}', '%Y-%m-%d %H:%M')
    jd = datetime_to_jd(dt)

    # Compute ascendant and houses
    houses, ascmc = swe.houses(jd, lat, lng, b'P')  # Placidus
    asc_longitude = ascmc[0]
    _, asc_sign, asc_sign_sk, asc_degree = get_sign(asc_longitude)

    # Compute planetary positions
    planetary_data = {}
    for planet_id, planet_name in PLANETS.items():
        pos = swe.calc_ut(jd, planet_id, swe.FLG_SWIEPH | swe.FLG_SIDEREAL)
        longitude = pos[0][0]
        sign_idx, sign, sign_sk, degree = get_sign(longitude)
        house = get_house_placement(longitude, houses)
        planetary_data[planet_name] = {
            'longitude': round(longitude, 2),
            'sign': sign,
            'signSanskrit': sign_sk,
            'degree': round(degree, 2),
            'house': house,
        }

    # Ketu is opposite Rahu
    rahu_long = planetary_data['Rahu']['longitude']
    ketu_long = (rahu_long + 180) % 360
    sign_idx, sign, sign_sk, degree = get_sign(ketu_long)
    planetary_data['Ketu'] = {
        'longitude': round(ketu_long, 2),
        'sign': sign,
        'signSanskrit': sign_sk,
        'degree': round(degree, 2),
        'house': get_house_placement(ketu_long, houses),
    }

    # House data
    house_data = {}
    for i in range(12):
        _, sign, sign_sk, degree = get_sign(houses[i])
        house_data[str(i + 1)] = {
            'sign': sign,
            'signSanskrit': sign_sk,
            'degree': round(degree, 2),
        }

    # Current dasha
    moon_long = planetary_data['Moon']['longitude']
    dasha_data = compute_dasha(moon_long, dt)

    return {
        'ascendant': asc_sign,
        'ascendantSanskrit': asc_sign_sk,
        'ascendantDegree': round(asc_degree, 2),
        'planetaryData': planetary_data,
        'houseData': house_data,
        'dashaData': dasha_data,
        'moonSign': planetary_data['Moon']['sign'],
        'sunSign': planetary_data['Sun']['sign'],
    }


def get_house_placement(longitude: float, houses: tuple) -> int:
    """Determine which house a planet falls in."""
    for i in range(12):
        start = houses[i]
        end = houses[(i + 1) % 12]
        if start < end:
            if start <= longitude < end:
                return i + 1
        else:
            if longitude >= start or longitude < end:
                return i + 1
    return 1


def compute_dasha(moon_longitude: float, birth_dt: datetime) -> dict:
    """Compute current Vimshottari Mahadasha."""
    nakshatra_idx = int(moon_longitude / (360 / 27))
    lord = NAKSHATRA_LORDS[nakshatra_idx]

    # Find position in dasha cycle
    lord_idx = DASHA_ORDER.index(lord)
    elapsed_in_nakshatra = (moon_longitude % (360 / 27)) / (360 / 27)
    remaining_years = DASHA_YEARS[lord] * (1 - elapsed_in_nakshatra)

    now = datetime.now()
    age_years = (now - birth_dt).days / 365.25

    # Walk through dasha cycle to find current period
    cumulative = remaining_years
    current_lord = lord
    for i in range(9):
        if cumulative >= age_years:
            break
        idx = (lord_idx + i + 1) % 9
        current_lord = DASHA_ORDER[idx]
        cumulative += DASHA_YEARS[current_lord]

    return {
        'currentMahadasha': current_lord,
        'dashaYears': DASHA_YEARS[current_lord],
        'birthNakshatra': nakshatra_idx + 1,
        'nakshatraLord': lord,
    }
