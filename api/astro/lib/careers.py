"""
Career mapping based on numerology and Vedic astrology.
"""

NUMEROLOGY_CAREERS = {
    1: [
        {'career': 'Entrepreneurship & Startups', 'score': 92, 'reasoning': 'Natural leadership and pioneering spirit'},
        {'career': 'Management Consulting', 'score': 85, 'reasoning': 'Strategic thinking and decision-making'},
        {'career': 'Government Administration (IAS/IPS)', 'score': 80, 'reasoning': 'Authority and organizational skills'},
        {'career': 'Product Management', 'score': 78, 'reasoning': 'Vision and execution ability'},
        {'career': 'Defence Services', 'score': 75, 'reasoning': 'Discipline and leadership under pressure'},
    ],
    2: [
        {'career': 'Counseling & Psychology', 'score': 90, 'reasoning': 'Natural empathy and sensitivity'},
        {'career': 'Human Resources', 'score': 85, 'reasoning': 'People skills and mediation ability'},
        {'career': 'Teaching & Education', 'score': 82, 'reasoning': 'Patience and nurturing nature'},
        {'career': 'Diplomatic Services', 'score': 80, 'reasoning': 'Tact and harmony-seeking nature'},
        {'career': 'Healthcare (Nursing/Therapy)', 'score': 78, 'reasoning': 'Caring disposition and attention to detail'},
    ],
    3: [
        {'career': 'Content Creation & Media', 'score': 92, 'reasoning': 'Creative expression and communication'},
        {'career': 'Marketing & Advertising', 'score': 88, 'reasoning': 'Persuasion and creative thinking'},
        {'career': 'Film & Entertainment', 'score': 85, 'reasoning': 'Artistic talent and self-expression'},
        {'career': 'Journalism', 'score': 82, 'reasoning': 'Communication skills and curiosity'},
        {'career': 'UX/UI Design', 'score': 78, 'reasoning': 'Visual creativity and user empathy'},
    ],
    4: [
        {'career': 'Software Engineering', 'score': 90, 'reasoning': 'Systematic thinking and building'},
        {'career': 'Civil Engineering / Architecture', 'score': 88, 'reasoning': 'Structural thinking and precision'},
        {'career': 'Chartered Accountancy', 'score': 85, 'reasoning': 'Detail orientation and methodical approach'},
        {'career': 'Project Management', 'score': 82, 'reasoning': 'Organization and process management'},
        {'career': 'Data Science', 'score': 80, 'reasoning': 'Analytical rigor and pattern recognition'},
    ],
    5: [
        {'career': 'Sales & Business Development', 'score': 90, 'reasoning': 'Adaptability and persuasion'},
        {'career': 'Travel & Tourism', 'score': 85, 'reasoning': 'Love of variety and new experiences'},
        {'career': 'Journalism & Reporting', 'score': 82, 'reasoning': 'Curiosity and communication'},
        {'career': 'Digital Marketing', 'score': 80, 'reasoning': 'Versatility and trend awareness'},
        {'career': 'Stock Trading / Fintech', 'score': 78, 'reasoning': 'Quick thinking and risk appetite'},
    ],
    6: [
        {'career': 'Healthcare & Medicine', 'score': 92, 'reasoning': 'Service orientation and responsibility'},
        {'career': 'Teaching & Mentoring', 'score': 88, 'reasoning': 'Nurturing nature and patience'},
        {'career': 'Interior Design', 'score': 82, 'reasoning': 'Aesthetic sense and harmony'},
        {'career': 'Social Work / NGO', 'score': 85, 'reasoning': 'Community service and compassion'},
        {'career': 'Food & Hospitality', 'score': 78, 'reasoning': 'Hospitality and nurturing instinct'},
    ],
    7: [
        {'career': 'Research & Academia', 'score': 92, 'reasoning': 'Deep analytical and investigative mind'},
        {'career': 'Data Science & AI', 'score': 88, 'reasoning': 'Pattern recognition and abstract thinking'},
        {'career': 'Philosophy & Spirituality', 'score': 85, 'reasoning': 'Introspective and wisdom-seeking'},
        {'career': 'Cybersecurity', 'score': 82, 'reasoning': 'Investigative and detail-oriented'},
        {'career': 'Technical Writing', 'score': 78, 'reasoning': 'Clarity of thought and precision'},
    ],
    8: [
        {'career': 'Finance & Banking', 'score': 92, 'reasoning': 'Business acumen and wealth management'},
        {'career': 'Real Estate', 'score': 88, 'reasoning': 'Material success orientation'},
        {'career': 'Corporate Law', 'score': 85, 'reasoning': 'Authority and negotiation skills'},
        {'career': 'Entrepreneurship (Scale-ups)', 'score': 82, 'reasoning': 'Ambition and organizational power'},
        {'career': 'Investment Banking', 'score': 80, 'reasoning': 'Risk management and strategic thinking'},
    ],
    9: [
        {'career': 'Social Entrepreneurship', 'score': 92, 'reasoning': 'Humanitarian vision and leadership'},
        {'career': 'Public Policy / Politics', 'score': 88, 'reasoning': 'Idealism and broad perspective'},
        {'career': 'International Relations', 'score': 85, 'reasoning': 'Global thinking and compassion'},
        {'career': 'Arts & Culture', 'score': 82, 'reasoning': 'Creative vision and emotional depth'},
        {'career': 'Environmental Science', 'score': 78, 'reasoning': 'Concern for collective welfare'},
    ],
}

PLANET_CAREER_MAP = {
    'Sun': ['Government', 'Administration', 'Leadership', 'Politics', 'Medicine'],
    'Moon': ['Healthcare', 'Hospitality', 'Agriculture', 'Nursing', 'Shipping'],
    'Mars': ['Engineering', 'Defence', 'Sports', 'Surgery', 'Police'],
    'Mercury': ['Communication', 'IT', 'Commerce', 'Accounting', 'Writing'],
    'Jupiter': ['Education', 'Law', 'Banking', 'Philosophy', 'Consulting'],
    'Venus': ['Arts', 'Fashion', 'Entertainment', 'Luxury', 'Hospitality'],
    'Saturn': ['Manufacturing', 'Mining', 'Agriculture', 'Real Estate', 'Research'],
    'Rahu': ['Technology', 'Foreign Trade', 'Aviation', 'Electronics', 'Innovation'],
    'Ketu': ['Spirituality', 'Research', 'Alternative Medicine', 'Occult', 'Mathematics'],
}


def get_careers_from_numerology(destiny_number: int) -> list:
    """Get top 5 careers based on destiny number."""
    return NUMEROLOGY_CAREERS.get(destiny_number, NUMEROLOGY_CAREERS[1])


def get_careers_from_chart(planetary_data: dict, house_data: dict) -> list:
    """Get career suggestions from 10th house analysis."""
    careers = []

    # Find 10th house sign
    tenth_house = house_data.get('10', {})
    tenth_sign = tenth_house.get('sign', 'Aries')

    # Find planets in 10th house
    planets_in_10th = []
    for planet, data in planetary_data.items():
        if data.get('house') == 10:
            planets_in_10th.append(planet)

    # Combine career suggestions from 10th house planets
    seen = set()
    for planet in planets_in_10th:
        for career in PLANET_CAREER_MAP.get(planet, []):
            if career not in seen:
                careers.append({
                    'career': career,
                    'score': 85,
                    'reasoning': f'{planet} in 10th house indicates aptitude for {career.lower()}'
                })
                seen.add(career)

    # If no planets in 10th, use 10th house lord
    if not careers:
        sign_lords = {
            'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury',
            'Cancer': 'Moon', 'Leo': 'Sun', 'Virgo': 'Mercury',
            'Libra': 'Venus', 'Scorpio': 'Mars', 'Sagittarius': 'Jupiter',
            'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter',
        }
        lord = sign_lords.get(tenth_sign, 'Sun')
        for career in PLANET_CAREER_MAP.get(lord, [])[:3]:
            careers.append({
                'career': career,
                'score': 75,
                'reasoning': f'{lord} rules 10th house ({tenth_sign}), suggesting {career.lower()}'
            })

    return careers[:5]
