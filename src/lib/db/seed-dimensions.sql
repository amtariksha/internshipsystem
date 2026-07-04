-- AEDHAS dimension seed — the 12 behavioral assessment dimensions.
--
-- MUST run BEFORE seed-behavioral-questions.sql / -part2.sql, which resolve
-- questions.dimension_id via (SELECT id FROM dimensions WHERE code=...).
-- If dimensions is empty those lookups return NULL and the question inserts
-- fail with: null value in column "dimension_id" violates not-null constraint.
--
-- Idempotent: ON CONFLICT (code) DO NOTHING makes this safe to re-run.

INSERT INTO dimensions (code, name_key, description, category, max_score, startup_weight, general_weight, sort_order) VALUES
('grit_perseverance', 'dimensions.grit_perseverance', 'Sustained passion and effort toward long-term goals despite setbacks', 'ENTREPRENEURIAL', 5.0, 0.15, 0.10, 1),
('risk_tolerance', 'dimensions.risk_tolerance', 'Willingness to take calculated risks and handle uncertainty', 'ENTREPRENEURIAL', 5.0, 0.13, 0.07, 2),
('proactivity', 'dimensions.proactivity', 'Taking initiative and acting before being asked', 'ENTREPRENEURIAL', 5.0, 0.12, 0.10, 3),
('eq_self_regulation', 'dimensions.eq_self_regulation', 'Emotional intelligence and ability to manage emotions under pressure', 'PERSONALITY', 5.0, 0.09, 0.12, 4),
('growth_mindset', 'dimensions.growth_mindset', 'Belief that abilities can be developed through effort and learning', 'COGNITIVE', 5.0, 0.08, 0.10, 5),
('integrity', 'dimensions.integrity', 'Consistency between stated values and actual behavior', 'PERSONALITY', 5.0, 0.08, 0.11, 6),
('strategic_thinking', 'dimensions.strategic_thinking', 'Ability to plan ahead and see the bigger picture', 'COGNITIVE', 5.0, 0.09, 0.08, 7),
('collaboration', 'dimensions.collaboration', 'Working effectively with others and building relationships', 'INTERPERSONAL', 5.0, 0.06, 0.10, 8),
('self_efficacy', 'dimensions.self_efficacy', 'Confidence in own ability to execute and deliver results', 'PERSONALITY', 5.0, 0.08, 0.08, 9),
('innovativeness', 'dimensions.innovativeness', 'Creative problem-solving and generating novel solutions', 'COGNITIVE', 5.0, 0.06, 0.06, 10),
('action_orientation', 'dimensions.action_orientation', 'Bias toward action over analysis paralysis', 'ENTREPRENEURIAL', 5.0, 0.04, 0.05, 11),
('physical_mental_vitality', 'dimensions.physical_mental_vitality', 'Physical and mental energy management', 'PERSONALITY', 5.0, 0.02, 0.03, 12)
ON CONFLICT (code) DO NOTHING;
