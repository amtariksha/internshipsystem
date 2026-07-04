"""
Pythagorean numerology character-to-number mappings.

Mirrors the public interface of ``chaldean.py`` (same function names and
return shapes) so callers can dispatch on the chosen system.

The Pythagorean system differs from Chaldean only in the Latin letter map:
each Latin letter maps to ``(position_in_alphabet - 1) % 9 + 1`` — i.e. the
standard A=1, B=2, ... I=9, J=1, ... R=9, S=1, ... Z=8 cycle.

Pythagorean numerology is defined for the Latin alphabet only. For Indic
scripts (Devanagari, Telugu, Tamil, Kannada) there is no distinct Pythagorean
convention, so we reuse the Chaldean phonetic maps as the industry-standard
fallback.
"""

from .chaldean import (
    DEVANAGARI_MAP,
    TELUGU_MAP,
    TAMIL_MAP,
    KANNADA_MAP,
    VOWELS_LATIN,
    VOWELS_DEVANAGARI,
    VOWELS_TELUGU,
    VOWELS_TAMIL,
    VOWELS_KANNADA,
    detect_script,
    reduce_to_single,
)


def _build_latin_map() -> dict[str, int]:
    """A=1..I=9, J=1..R=9, S=1..Z=8 (1-9 cycle by alphabet position)."""
    return {
        chr(ord('A') + i): (i % 9) + 1
        for i in range(26)
    }


LATIN_MAP: dict[str, int] = _build_latin_map()

SCRIPT_CONFIG: dict[str, dict] = {
    'latin': {'map': LATIN_MAP, 'vowels': VOWELS_LATIN},
    'devanagari': {'map': DEVANAGARI_MAP, 'vowels': VOWELS_DEVANAGARI},
    'telugu': {'map': TELUGU_MAP, 'vowels': VOWELS_TELUGU},
    'tamil': {'map': TAMIL_MAP, 'vowels': VOWELS_TAMIL},
    'kannada': {'map': KANNADA_MAP, 'vowels': VOWELS_KANNADA},
}


def compute_name_number(name: str, char_map: dict) -> int:
    """Sum all character values and reduce."""
    total = 0
    for ch in name.upper():
        if ch in char_map:
            total += char_map[ch]
    return reduce_to_single(total)


def compute_destiny_number(dob: str) -> int:
    """Destiny number from DOB. Sum all digits and reduce."""
    digits = [int(d) for d in dob if d.isdigit()]
    return reduce_to_single(sum(digits))


def compute_soul_number(name: str, script: str) -> int:
    """Soul number from vowels only."""
    config = SCRIPT_CONFIG.get(script, SCRIPT_CONFIG['latin'])
    vowel_set = config['vowels']
    char_map = config['map']
    total = 0
    for ch in name.upper():
        if ch in vowel_set and ch in char_map:
            total += char_map[ch]
    return reduce_to_single(total) if total > 0 else 1


def compute_personality_number(name: str, script: str) -> int:
    """Personality number from consonants only."""
    config = SCRIPT_CONFIG.get(script, SCRIPT_CONFIG['latin'])
    vowel_set = config['vowels']
    char_map = config['map']
    total = 0
    for ch in name.upper():
        if ch in char_map and ch not in vowel_set:
            total += char_map[ch]
    return reduce_to_single(total) if total > 0 else 1


def get_numerology(name: str, dob: str) -> dict:
    """Complete Pythagorean numerology analysis.

    Returns the same shape as ``chaldean.get_numerology``.
    """
    script = detect_script(name)
    config = SCRIPT_CONFIG.get(script, SCRIPT_CONFIG['latin'])
    char_map = config['map']

    name_number = compute_name_number(name, char_map)
    destiny_number = compute_destiny_number(dob)
    soul_number = compute_soul_number(name, script)
    personality_number = compute_personality_number(name, script)

    return {
        'script': script,
        'nameNumber': name_number,
        'destinyNumber': destiny_number,
        'soulNumber': soul_number,
        'personalityNumber': personality_number,
    }
