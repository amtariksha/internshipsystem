"""
Chaldean numerology character-to-number mappings.
Supports Latin (English), Devanagari (Hindi), Telugu, Tamil, and Kannada scripts.
"""

LATIN_MAP: dict[str, int] = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 8, 'G': 3, 'H': 5,
    'I': 1, 'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 7, 'P': 8,
    'Q': 1, 'R': 2, 'S': 3, 'T': 4, 'U': 6, 'V': 6, 'W': 6, 'X': 5,
    'Y': 1, 'Z': 7,
}

# Devanagari consonants and vowels mapped to Chaldean values
DEVANAGARI_MAP: dict[str, int] = {
    'अ': 1, 'आ': 1, 'इ': 1, 'ई': 1, 'उ': 6, 'ऊ': 6, 'ए': 5, 'ऐ': 5,
    'ओ': 7, 'औ': 7, 'अं': 1, 'अः': 1,
    'क': 2, 'ख': 2, 'ग': 3, 'घ': 3, 'ङ': 5,
    'च': 3, 'छ': 3, 'ज': 1, 'झ': 1, 'ञ': 5,
    'ट': 4, 'ठ': 4, 'ड': 4, 'ढ': 4, 'ण': 5,
    'त': 4, 'थ': 4, 'द': 4, 'ध': 4, 'न': 5,
    'प': 8, 'फ': 8, 'ब': 2, 'भ': 2, 'म': 4,
    'य': 1, 'र': 2, 'ल': 3, 'व': 6, 'श': 3,
    'ष': 3, 'स': 3, 'ह': 5,
    'ा': 1, 'ि': 1, 'ी': 1, 'ु': 6, 'ू': 6,
    'े': 5, 'ै': 5, 'ो': 7, 'ौ': 7, 'ं': 5, 'ः': 5,
    '्': 0,
}

# Telugu script (Unicode U+0C00-U+0C7F)
TELUGU_MAP: dict[str, int] = {
    'అ': 1, 'ఆ': 1, 'ఇ': 1, 'ఈ': 1, 'ఉ': 6, 'ఊ': 6, 'ఋ': 2,
    'ఎ': 5, 'ఏ': 5, 'ఐ': 5, 'ఒ': 7, 'ఓ': 7, 'ఔ': 7,
    'క': 2, 'ఖ': 2, 'గ': 3, 'ఘ': 3, 'ఙ': 5,
    'చ': 3, 'ఛ': 3, 'జ': 1, 'ఝ': 1, 'ఞ': 5,
    'ట': 4, 'ఠ': 4, 'డ': 4, 'ఢ': 4, 'ణ': 5,
    'త': 4, 'థ': 4, 'ద': 4, 'ధ': 4, 'న': 5,
    'ప': 8, 'ఫ': 8, 'బ': 2, 'భ': 2, 'మ': 4,
    'య': 1, 'ర': 2, 'ల': 3, 'వ': 6, 'శ': 3,
    'ష': 3, 'స': 3, 'హ': 5, 'ళ': 3, 'క్ష': 2, 'ఱ': 2,
    # Telugu matras
    'ా': 1, 'ి': 1, 'ీ': 1, 'ు': 6, 'ూ': 6,
    'ె': 5, 'ే': 5, 'ై': 5, 'ొ': 7, 'ో': 7, 'ౌ': 7,
    'ం': 5, 'ః': 5, '్': 0,
}

# Tamil script (Unicode U+0B80-U+0BFF)
TAMIL_MAP: dict[str, int] = {
    'அ': 1, 'ஆ': 1, 'இ': 1, 'ஈ': 1, 'உ': 6, 'ஊ': 6,
    'எ': 5, 'ஏ': 5, 'ஐ': 5, 'ஒ': 7, 'ஓ': 7, 'ஔ': 7,
    'க': 2, 'ங': 5, 'ச': 3, 'ஞ': 5, 'ட': 4, 'ண': 5,
    'த': 4, 'ந': 5, 'ப': 8, 'ம': 4, 'ய': 1, 'ர': 2,
    'ல': 3, 'வ': 6, 'ழ': 3, 'ள': 3, 'ற': 2, 'ன': 5,
    'ஜ': 1, 'ஷ': 3, 'ஸ': 3, 'ஹ': 5,
    # Tamil matras
    'ா': 1, 'ி': 1, 'ீ': 1, 'ு': 6, 'ூ': 6,
    'ெ': 5, 'ே': 5, 'ை': 5, 'ொ': 7, 'ோ': 7, 'ௌ': 7,
    'ஂ': 5, 'ஃ': 5, '்': 0,
}

# Kannada script (Unicode U+0C80-U+0CFF)
KANNADA_MAP: dict[str, int] = {
    'ಅ': 1, 'ಆ': 1, 'ಇ': 1, 'ಈ': 1, 'ಉ': 6, 'ಊ': 6, 'ಋ': 2,
    'ಎ': 5, 'ಏ': 5, 'ಐ': 5, 'ಒ': 7, 'ಓ': 7, 'ಔ': 7,
    'ಕ': 2, 'ಖ': 2, 'ಗ': 3, 'ಘ': 3, 'ಙ': 5,
    'ಚ': 3, 'ಛ': 3, 'ಜ': 1, 'ಝ': 1, 'ಞ': 5,
    'ಟ': 4, 'ಠ': 4, 'ಡ': 4, 'ಢ': 4, 'ಣ': 5,
    'ತ': 4, 'ಥ': 4, 'ದ': 4, 'ಧ': 4, 'ನ': 5,
    'ಪ': 8, 'ಫ': 8, 'ಬ': 2, 'ಭ': 2, 'ಮ': 4,
    'ಯ': 1, 'ರ': 2, 'ಲ': 3, 'ವ': 6, 'ಶ': 3,
    'ಷ': 3, 'ಸ': 3, 'ಹ': 5, 'ಳ': 3, 'ಱ': 2,
    # Kannada matras
    'ಾ': 1, 'ಿ': 1, 'ೀ': 1, 'ು': 6, 'ೂ': 6,
    'ೆ': 5, 'ೇ': 5, 'ೈ': 5, 'ೊ': 7, 'ೋ': 7, 'ೌ': 7,
    'ಂ': 5, 'ಃ': 5, '್': 0,
}

VOWELS_LATIN: set[str] = set('AEIOU')
VOWELS_DEVANAGARI: set[str] = set('अआइईउऊएऐओऔाििीुूेैोौ')
VOWELS_TELUGU: set[str] = set('అఆఇఈఉఊఋఎఏఐఒఓఔాిీుూెేైొోౌ')
VOWELS_TAMIL: set[str] = set('அஆஇஈஉஊஎஏஐஒஓஔாிீுூெேைொோௌ')
VOWELS_KANNADA: set[str] = set('ಅಆಇಈಉಊಋಎಏಐಒಓಔಾಿೀುೂೆೇೈೊೋೌ')

SCRIPT_CONFIG: dict[str, dict] = {
    'latin': {'map': LATIN_MAP, 'vowels': VOWELS_LATIN},
    'devanagari': {'map': DEVANAGARI_MAP, 'vowels': VOWELS_DEVANAGARI},
    'telugu': {'map': TELUGU_MAP, 'vowels': VOWELS_TELUGU},
    'tamil': {'map': TAMIL_MAP, 'vowels': VOWELS_TAMIL},
    'kannada': {'map': KANNADA_MAP, 'vowels': VOWELS_KANNADA},
}


def detect_script(name: str) -> str:
    """Detect script from name characters."""
    for ch in name:
        if '\u0C80' <= ch <= '\u0CFF':
            return 'kannada'
        if '\u0C00' <= ch <= '\u0C7F':
            return 'telugu'
        if '\u0B80' <= ch <= '\u0BFF':
            return 'tamil'
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
    """Complete Chaldean numerology analysis."""
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
