"""
Chaldean numerology character-to-number mappings.
Supports Latin (English) and Devanagari (Hindi) scripts.
"""

LATIN_MAP = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 8, 'G': 3, 'H': 5,
    'I': 1, 'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 7, 'P': 8,
    'Q': 1, 'R': 2, 'S': 3, 'T': 4, 'U': 6, 'V': 6, 'W': 6, 'X': 5,
    'Y': 1, 'Z': 7,
}

# Devanagari consonants and vowels mapped to Chaldean values
DEVANAGARI_MAP = {
    'अ': 1, 'आ': 1, 'इ': 1, 'ई': 1, 'उ': 6, 'ऊ': 6, 'ए': 5, 'ऐ': 5,
    'ओ': 7, 'औ': 7, 'अं': 1, 'अः': 1,
    'क': 2, 'ख': 2, 'ग': 3, 'घ': 3, 'ङ': 5,
    'च': 3, 'छ': 3, 'ज': 1, 'झ': 1, 'ञ': 5,
    'ट': 4, 'ठ': 4, 'ड': 4, 'ढ': 4, 'ण': 5,
    'त': 4, 'थ': 4, 'द': 4, 'ध': 4, 'न': 5,
    'प': 8, 'फ': 8, 'ब': 2, 'भ': 2, 'म': 4,
    'य': 1, 'र': 2, 'ल': 3, 'व': 6, 'श': 3,
    'ष': 3, 'स': 3, 'ह': 5,
    # Matras (vowel marks)
    'ा': 1, 'ि': 1, 'ी': 1, 'ु': 6, 'ू': 6,
    'े': 5, 'ै': 5, 'ो': 7, 'ौ': 7, 'ं': 5, 'ः': 5,
    '्': 0,  # Halant - no value
}

VOWELS_LATIN = set('AEIOU')
VOWELS_DEVANAGARI = set('अआइईउऊएऐओऔाििीुूेैोौ')


def detect_script(name: str) -> str:
    """Detect whether name is Latin or Devanagari."""
    for ch in name:
        if '\u0900' <= ch <= '\u097F':
            return 'devanagari'
    return 'latin'


def reduce_to_single(num: int) -> int:
    """Reduce a number to single digit (1-9). Master numbers 11, 22, 33 kept."""
    if num in (11, 22, 33):
        return num
    while num > 9:
        num = sum(int(d) for d in str(num))
    return num


def compute_name_number(name: str, char_map: dict) -> int:
    """Sum all character values and reduce."""
    total = 0
    for ch in name.upper():
        if ch in char_map:
            total += char_map[ch]
    return reduce_to_single(total)


def compute_destiny_number(dob: str) -> int:
    """Destiny number from DOB (DD-MM-YYYY). Sum all digits and reduce."""
    digits = [int(d) for d in dob if d.isdigit()]
    return reduce_to_single(sum(digits))


def compute_soul_number(name: str, script: str) -> int:
    """Soul number from vowels only."""
    vowel_set = VOWELS_LATIN if script == 'latin' else VOWELS_DEVANAGARI
    char_map = LATIN_MAP if script == 'latin' else DEVANAGARI_MAP
    total = 0
    for ch in name.upper():
        if ch in vowel_set and ch in char_map:
            total += char_map[ch]
    return reduce_to_single(total) if total > 0 else 1


def compute_personality_number(name: str, script: str) -> int:
    """Personality number from consonants only."""
    vowel_set = VOWELS_LATIN if script == 'latin' else VOWELS_DEVANAGARI
    char_map = LATIN_MAP if script == 'latin' else DEVANAGARI_MAP
    total = 0
    for ch in name.upper():
        if ch in char_map and ch not in vowel_set:
            total += char_map[ch]
    return reduce_to_single(total) if total > 0 else 1


def get_numerology(name: str, dob: str) -> dict:
    """Complete Chaldean numerology analysis."""
    script = detect_script(name)
    char_map = LATIN_MAP if script == 'latin' else DEVANAGARI_MAP

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
