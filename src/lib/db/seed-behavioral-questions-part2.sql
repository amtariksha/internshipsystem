-- AEDHAS Behavioral SJT Question Seed — Part 2
-- 135 questions: 15 per dimension × 9 remaining dimensions
-- Each: scenario + prompt (en/hi) + 4 options with dimension weights
-- Run AFTER seed-behavioral-questions.sql (which covers GP, RT, PR)
-- Difficulty spread per dimension: 6 easy (d1-2), 6 medium (d3), 3 hard (d4-5)

-- ═══════════════════════════════════════════════════════════
-- DIMENSION 4: EQ & SELF-REGULATION (15 questions)
-- ═══════════════════════════════════════════════════════════

INSERT INTO questions (code, dimension_id, scenario_type, difficulty, is_active) VALUES
('EQ01', (SELECT id FROM dimensions WHERE code='eq_self_regulation'), 'COLLEGE', 1, true),
('EQ02', (SELECT id FROM dimensions WHERE code='eq_self_regulation'), 'STARTUP', 1, true),
('EQ03', (SELECT id FROM dimensions WHERE code='eq_self_regulation'), 'WORK', 2, true),
('EQ04', (SELECT id FROM dimensions WHERE code='eq_self_regulation'), 'COLLEGE', 2, true),
('EQ05', (SELECT id FROM dimensions WHERE code='eq_self_regulation'), 'STARTUP', 2, true),
('EQ06', (SELECT id FROM dimensions WHERE code='eq_self_regulation'), 'WORK', 2, true),
('EQ07', (SELECT id FROM dimensions WHERE code='eq_self_regulation'), 'COLLEGE', 3, true),
('EQ08', (SELECT id FROM dimensions WHERE code='eq_self_regulation'), 'STARTUP', 3, true),
('EQ09', (SELECT id FROM dimensions WHERE code='eq_self_regulation'), 'WORK', 3, true),
('EQ10', (SELECT id FROM dimensions WHERE code='eq_self_regulation'), 'COLLEGE', 3, true),
('EQ11', (SELECT id FROM dimensions WHERE code='eq_self_regulation'), 'STARTUP', 3, true),
('EQ12', (SELECT id FROM dimensions WHERE code='eq_self_regulation'), 'WORK', 3, true),
('EQ13', (SELECT id FROM dimensions WHERE code='eq_self_regulation'), 'STARTUP', 4, true),
('EQ14', (SELECT id FROM dimensions WHERE code='eq_self_regulation'), 'WORK', 4, true),
('EQ15', (SELECT id FROM dimensions WHERE code='eq_self_regulation'), 'COLLEGE', 5, true);

-- EQ English variants
INSERT INTO question_variants (question_id, locale, scenario, prompt)
SELECT q.id, 'en', v.scenario, v.prompt FROM (VALUES
('EQ01', 'Your roommate at the college hostel plays loud music every night before your JEE Mains mock tests.', 'How do you handle this?'),
('EQ02', 'Your co-founder publicly criticizes your design decisions in front of the team during a standup call.', 'How do you respond?'),
('EQ03', 'Your manager gives you harsh feedback in a team meeting in front of all your colleagues in the Bangalore office.', 'What do you do?'),
('EQ04', 'You worked very hard on a group project but your teammate takes all the credit during the viva presentation.', 'How do you react?'),
('EQ05', 'An angry customer leaves a scathing 1-star review about your startup product on social media tagging your personal account.', 'What is your response?'),
('EQ06', 'A colleague at work constantly interrupts you during meetings and dismisses your ideas.', 'How do you handle it?'),
('EQ07', 'During campus placement season, your best friend gets selected at a top company while you get rejected from the same company.', 'How do you manage your feelings?'),
('EQ08', 'Your startup investor sends a furious email accusing you of mismanaging funds based on incorrect information.', 'How do you respond?'),
('EQ09', 'You discover that a team member has been talking negatively about you behind your back to the manager.', 'What is your approach?'),
('EQ10', 'Your parents compare your academic performance unfavorably with your cousin who scored higher in the board exams.', 'How do you handle this?'),
('EQ11', 'Two of your co-founders are having a major personal conflict that is affecting the entire team morale and product delivery.', 'What do you do?'),
('EQ12', 'You are passed over for a high-visibility project and it is given to a junior colleague. You feel it is unfair.', 'How do you respond?'),
('EQ13', 'Your startup fails after 2 years of effort. Friends and family who warned you say I told you so. You feel devastated and embarrassed.', 'How do you cope?'),
('EQ14', 'During a heated client negotiation, the client makes a personal remark about your age and experience that feels deeply disrespectful.', 'How do you respond?'),
('EQ15', 'You are dealing with intense academic pressure from semester exams while your parents are going through a difficult separation. Your performance is suffering.', 'How do you manage?')
) AS v(code, scenario, prompt) JOIN questions q ON q.code = v.code;

-- EQ Hindi variants
INSERT INTO question_variants (question_id, locale, scenario, prompt)
SELECT q.id, 'hi', v.scenario, v.prompt FROM (VALUES
('EQ01', 'कॉलेज हॉस्टल में आपका रूममेट हर रात JEE मेन्स मॉक टेस्ट से पहले तेज़ म्यूज़िक बजाता है।', 'आप इसे कैसे संभालेंगे?'),
('EQ02', 'आपका को-फाउंडर स्टैंडअप कॉल में टीम के सामने आपके डिज़ाइन निर्णयों की सार्वजनिक आलोचना करता है।', 'आप कैसे जवाब देंगे?'),
('EQ03', 'बैंगलोर ऑफिस में मैनेजर टीम मीटिंग में सभी सहकर्मियों के सामने आपको कड़ी प्रतिक्रिया देता है।', 'आप क्या करेंगे?'),
('EQ04', 'आपने ग्रुप प्रोजेक्ट पर बहुत मेहनत की लेकिन वाइवा प्रेजेंटेशन में टीममेट सारा क्रेडिट ले लेता है।', 'आप कैसे रिएक्ट करेंगे?'),
('EQ05', 'एक गुस्साए ग्राहक ने सोशल मीडिया पर आपका पर्सनल अकाउंट टैग करके 1-स्टार रिव्यू दिया।', 'आपकी प्रतिक्रिया क्या है?'),
('EQ06', 'ऑफिस में एक सहकर्मी मीटिंग्स में लगातार आपको टोकता है और आपके आइडियाज़ को खारिज करता है।', 'आप इसे कैसे संभालेंगे?'),
('EQ07', 'कैंपस प्लेसमेंट में आपका सबसे अच्छा दोस्त टॉप कंपनी में सेलेक्ट हो गया जबकि उसी कंपनी ने आपको रिजेक्ट कर दिया।', 'आप अपनी भावनाओं को कैसे संभालेंगे?'),
('EQ08', 'स्टार्टअप के निवेशक ने गलत जानकारी के आधार पर फंड के दुरुपयोग का आरोप लगाते हुए गुस्से भरा ईमेल भेजा।', 'आप कैसे जवाब देंगे?'),
('EQ09', 'आपको पता चलता है कि एक टीम मेंबर मैनेजर से आपके बारे में पीठ पीछे बुराई कर रहा है।', 'आपका दृष्टिकोण क्या है?'),
('EQ10', 'आपके माता-पिता बोर्ड परीक्षा में ज़्यादा अंक लाने वाले चचेरे भाई से आपकी तुलना करते हैं।', 'आप इसे कैसे संभालेंगे?'),
('EQ11', 'आपके दो को-फाउंडर्स के बीच बड़ा व्यक्तिगत विवाद है जो पूरी टीम के मनोबल और प्रोडक्ट डिलीवरी को प्रभावित कर रहा है।', 'आप क्या करेंगे?'),
('EQ12', 'आपको एक हाई-विज़िबिलिटी प्रोजेक्ट से हटाकर जूनियर सहकर्मी को दे दिया गया। आपको यह अनुचित लगता है।', 'आप कैसे जवाब देंगे?'),
('EQ13', '2 साल की मेहनत के बाद स्टार्टअप फेल हो गया। दोस्त और परिवार जिन्होंने चेतावनी दी थी वो कह रहे हैं मैंने कहा था। आप तबाह और शर्मिंदा हैं।', 'आप कैसे सामना करेंगे?'),
('EQ14', 'क्लाइंट नेगोशिएशन में क्लाइंट आपकी उम्र और अनुभव पर गहरा अपमानजनक व्यक्तिगत कमेंट करता है।', 'आप कैसे जवाब देंगे?'),
('EQ15', 'सेमेस्टर परीक्षा का तीव्र दबाव है और इसी दौरान आपके माता-पिता कठिन अलगाव से गुज़र रहे हैं। आपका प्रदर्शन गिर रहा है।', 'आप कैसे प्रबंधन करेंगे?')
) AS v(code, scenario, prompt) JOIN questions q ON q.code = v.code;

-- EQ Options (English)
INSERT INTO question_options (question_id, "position", locale, text, weights)
SELECT q.id, v.pos, 'en', v.text, v.weights::jsonb FROM (VALUES
('EQ01',1,'Get angry and confront the roommate aggressively','{"eq_self_regulation":0.5,"collaboration":0.5}'),
('EQ01',2,'Have a calm conversation explaining your exam schedule and suggest a compromise like headphones','{"eq_self_regulation":5.0,"collaboration":4.0,"integrity":3.5}'),
('EQ01',3,'Complain to the hostel warden without talking to the roommate first','{"eq_self_regulation":2.0,"collaboration":1.0}'),
('EQ01',4,'Suppress your frustration and study in the library instead without addressing it','{"eq_self_regulation":2.5,"grit_perseverance":3.0}'),
('EQ02',1,'Snap back at the co-founder in front of the team','{"eq_self_regulation":0.5,"collaboration":0.5}'),
('EQ02',2,'Stay composed, acknowledge the feedback, and request a private discussion after the meeting to address specifics','{"eq_self_regulation":5.0,"collaboration":4.0,"integrity":3.5}'),
('EQ02',3,'Stay silent during the meeting but hold a grudge','{"eq_self_regulation":2.0,"integrity":1.0}'),
('EQ02',4,'Agree with everything to avoid conflict','{"eq_self_regulation":1.5,"self_efficacy":0.5}'),
('EQ03',1,'Argue with the manager in front of everyone','{"eq_self_regulation":0.5,"integrity":1.0}'),
('EQ03',2,'Listen calmly, take notes, then schedule a one-on-one to discuss the feedback constructively','{"eq_self_regulation":5.0,"growth_mindset":4.0,"proactivity":3.5}'),
('EQ03',3,'Shut down emotionally and stop contributing for the rest of the meeting','{"eq_self_regulation":1.0,"action_orientation":0.5}'),
('EQ03',4,'Complain to HR immediately after the meeting','{"eq_self_regulation":2.0,"proactivity":2.0}'),
('EQ04',1,'Confront the teammate angrily in front of the examiner','{"eq_self_regulation":0.5,"collaboration":0.5}'),
('EQ04',2,'After the viva, calmly discuss the issue with your teammate and agree on fair credit attribution going forward','{"eq_self_regulation":4.5,"collaboration":4.0,"integrity":4.0}'),
('EQ04',3,'Never work with that person again and tell everyone they are a cheat','{"eq_self_regulation":1.0,"collaboration":0.5}'),
('EQ04',4,'Let it go — it is not worth the confrontation','{"eq_self_regulation":3.0,"self_efficacy":1.5}'),
('EQ05',1,'Fire back with an angry public response defending your product','{"eq_self_regulation":0.5,"integrity":1.0}'),
('EQ05',2,'Respond professionally and publicly, acknowledge their frustration, and offer to resolve the issue via DM','{"eq_self_regulation":5.0,"integrity":4.5,"proactivity":3.5}'),
('EQ05',3,'Delete the review or report it as spam','{"eq_self_regulation":1.0,"integrity":0.5}'),
('EQ05',4,'Ignore it completely and hope it goes away','{"eq_self_regulation":2.0,"action_orientation":0.5}'),
('EQ06',1,'Start interrupting them back to give them a taste of their own medicine','{"eq_self_regulation":0.5,"collaboration":0.5}'),
('EQ06',2,'Address it privately — explain how it affects your participation and ask for mutual respect','{"eq_self_regulation":4.5,"collaboration":4.0,"integrity":3.5}'),
('EQ06',3,'Stop sharing ideas in meetings altogether','{"eq_self_regulation":1.5,"proactivity":0.5}'),
('EQ06',4,'Escalate directly to the manager without talking to the colleague','{"eq_self_regulation":2.0,"collaboration":1.5}'),
('EQ07',1,'Feel jealous and distance yourself from your friend','{"eq_self_regulation":0.5,"collaboration":0.5}'),
('EQ07',2,'Genuinely congratulate your friend, process your disappointment privately, and refocus on your own preparation','{"eq_self_regulation":5.0,"growth_mindset":4.5,"grit_perseverance":4.0}'),
('EQ07',3,'Pretend you are happy but complain about it to other friends','{"eq_self_regulation":1.5,"integrity":1.0}'),
('EQ07',4,'Blame the company for unfair selection criteria','{"eq_self_regulation":1.0,"growth_mindset":0.5}'),
('EQ08',1,'Reply immediately with an angry defensive email','{"eq_self_regulation":0.5,"integrity":1.0}'),
('EQ08',2,'Take a few hours to compose yourself, then reply with facts, financial reports, and a request for a call to clarify','{"eq_self_regulation":5.0,"strategic_thinking":4.5,"integrity":4.5}'),
('EQ08',3,'Forward the email to your lawyer without responding','{"eq_self_regulation":2.5,"strategic_thinking":2.5}'),
('EQ08',4,'Panic and start looking for a new investor','{"eq_self_regulation":1.0,"risk_tolerance":1.5}'),
('EQ09',1,'Confront the team member publicly in the next meeting','{"eq_self_regulation":0.5,"collaboration":0.5}'),
('EQ09',2,'Have a private, calm conversation to understand the situation and clear any misunderstanding','{"eq_self_regulation":5.0,"collaboration":4.0,"integrity":4.0}'),
('EQ09',3,'Start talking negatively about them to others in retaliation','{"eq_self_regulation":0.5,"integrity":0.5}'),
('EQ09',4,'Go directly to the manager to complain about them','{"eq_self_regulation":2.0,"collaboration":1.5}'),
('EQ10',1,'Argue with your parents and storm out of the room','{"eq_self_regulation":0.5,"integrity":1.0}'),
('EQ10',2,'Calmly explain that everyone has different strengths and share your own goals and progress','{"eq_self_regulation":4.5,"self_efficacy":4.0,"integrity":3.5}'),
('EQ10',3,'Internalize the comparison and feel inadequate','{"eq_self_regulation":1.0,"self_efficacy":0.5}'),
('EQ10',4,'Use it as motivation to study harder to prove them wrong','{"eq_self_regulation":3.0,"grit_perseverance":3.5}'),
('EQ11',1,'Pick a side and support one co-founder over the other','{"eq_self_regulation":1.0,"collaboration":0.5}'),
('EQ11',2,'Facilitate a structured mediation session, set ground rules, and help both parties find common ground for the company sake','{"eq_self_regulation":5.0,"collaboration":5.0,"strategic_thinking":4.0}'),
('EQ11',3,'Ignore it and hope they sort it out themselves','{"eq_self_regulation":1.5,"action_orientation":0.5}'),
('EQ11',4,'Threaten to leave the startup if they do not resolve it','{"eq_self_regulation":1.5,"integrity":2.0}'),
('EQ12',1,'Complain loudly to colleagues about the unfairness','{"eq_self_regulation":0.5,"integrity":1.0}'),
('EQ12',2,'Process your feelings, then have a constructive conversation with your manager about your career growth path','{"eq_self_regulation":5.0,"proactivity":4.0,"growth_mindset":3.5}'),
('EQ12',3,'Reduce your work effort as a form of silent protest','{"eq_self_regulation":1.0,"integrity":0.5}'),
('EQ12',4,'Immediately start looking for a new job','{"eq_self_regulation":2.0,"action_orientation":2.5}'),
('EQ13',1,'Isolate yourself and refuse to talk about it with anyone','{"eq_self_regulation":1.0,"physical_mental_vitality":0.5}'),
('EQ13',2,'Allow yourself to grieve, seek support from trusted people, reflect on lessons learned, and plan your next steps','{"eq_self_regulation":5.0,"growth_mindset":4.5,"physical_mental_vitality":4.0,"grit_perseverance":4.0}'),
('EQ13',3,'Immediately jump into the next venture to avoid thinking about the failure','{"eq_self_regulation":1.5,"action_orientation":2.5}'),
('EQ13',4,'Blame external factors — the market, investors, timing — and avoid self-reflection','{"eq_self_regulation":0.5,"growth_mindset":0.5}'),
('EQ14',1,'Walk out of the meeting immediately','{"eq_self_regulation":1.5,"strategic_thinking":1.0}'),
('EQ14',2,'Pause, maintain composure, redirect the conversation to business merits, and address the remark privately later','{"eq_self_regulation":5.0,"strategic_thinking":4.5,"integrity":4.0}'),
('EQ14',3,'Make a personal remark back at the client','{"eq_self_regulation":0.5,"integrity":0.5}'),
('EQ14',4,'Ignore the remark completely and pretend it did not happen','{"eq_self_regulation":3.0,"self_efficacy":2.0}'),
('EQ15',1,'Drop out of the semester to deal with family issues','{"eq_self_regulation":1.5,"grit_perseverance":1.0}'),
('EQ15',2,'Talk to a counselor, create a structured daily routine that balances academics and emotional wellbeing, and communicate with professors','{"eq_self_regulation":5.0,"physical_mental_vitality":4.5,"strategic_thinking":4.0,"grit_perseverance":4.0}'),
('EQ15',3,'Push through by ignoring emotions and focusing only on exams','{"eq_self_regulation":2.0,"physical_mental_vitality":1.0}'),
('EQ15',4,'Give up on getting good grades this semester and deal with the aftermath later','{"eq_self_regulation":1.5,"grit_perseverance":0.5}')
) AS v(code, pos, text, weights) JOIN questions q ON q.code = v.code;

-- ═══════════════════════════════════════════════════════════
-- DIMENSION 5: GROWTH MINDSET (15 questions)
-- ═══════════════════════════════════════════════════════════

INSERT INTO questions (code, dimension_id, scenario_type, difficulty, is_active) VALUES
('GM01', (SELECT id FROM dimensions WHERE code='growth_mindset'), 'COLLEGE', 1, true),
('GM02', (SELECT id FROM dimensions WHERE code='growth_mindset'), 'STARTUP', 1, true),
('GM03', (SELECT id FROM dimensions WHERE code='growth_mindset'), 'WORK', 2, true),
('GM04', (SELECT id FROM dimensions WHERE code='growth_mindset'), 'COLLEGE', 2, true),
('GM05', (SELECT id FROM dimensions WHERE code='growth_mindset'), 'STARTUP', 2, true),
('GM06', (SELECT id FROM dimensions WHERE code='growth_mindset'), 'WORK', 2, true),
('GM07', (SELECT id FROM dimensions WHERE code='growth_mindset'), 'COLLEGE', 3, true),
('GM08', (SELECT id FROM dimensions WHERE code='growth_mindset'), 'STARTUP', 3, true),
('GM09', (SELECT id FROM dimensions WHERE code='growth_mindset'), 'WORK', 3, true),
('GM10', (SELECT id FROM dimensions WHERE code='growth_mindset'), 'COLLEGE', 3, true),
('GM11', (SELECT id FROM dimensions WHERE code='growth_mindset'), 'STARTUP', 3, true),
('GM12', (SELECT id FROM dimensions WHERE code='growth_mindset'), 'WORK', 3, true),
('GM13', (SELECT id FROM dimensions WHERE code='growth_mindset'), 'STARTUP', 4, true),
('GM14', (SELECT id FROM dimensions WHERE code='growth_mindset'), 'WORK', 4, true),
('GM15', (SELECT id FROM dimensions WHERE code='growth_mindset'), 'COLLEGE', 5, true);

-- GM English variants
INSERT INTO question_variants (question_id, locale, scenario, prompt)
SELECT q.id, 'en', v.scenario, v.prompt FROM (VALUES
('GM01', 'You scored poorly in your first coding test at college despite being good at math in school.', 'How do you interpret this result?'),
('GM02', 'Your first startup product demo was a disaster — nothing worked as expected in front of potential customers.', 'What is your takeaway?'),
('GM03', 'You receive feedback in your annual review that your presentation skills need significant improvement.', 'How do you respond?'),
('GM04', 'A classmate who used to struggle in academics has suddenly started outperforming you after changing study methods.', 'How do you react?'),
('GM05', 'Your startup mentor tells you that your technical skills are not sufficient to build the product you envision.', 'What do you do?'),
('GM06', 'You are asked to lead a project using a technology you have never worked with before.', 'How do you approach it?'),
('GM07', 'You have been learning data science for 6 months but your Kaggle competition scores are in the bottom 20 percent.', 'What is your next step?'),
('GM08', 'A competitor with less experience and fewer resources shipped a better product than yours.', 'What do you learn from this?'),
('GM09', 'Your code review at work comes back with 47 comments and suggestions for improvement.', 'How do you feel about this?'),
('GM10', 'You struggled through a statistics course and barely passed while your friends found it easy.', 'What is your reflection?'),
('GM11', 'Your startup pivot failed and the new direction also did not gain traction. Team morale is at an all-time low.', 'How do you motivate yourself and the team?'),
('GM12', 'You realize that younger colleagues in your Mumbai office are adapting to new AI tools faster than you.', 'How do you respond?'),
('GM13', 'After 3 failed startups over 5 years, a family member asks you to admit you are not cut out for entrepreneurship.', 'What is your response?'),
('GM14', 'You are asked to move from your comfortable backend role to an unfamiliar full-stack role to fill a critical gap in the Delhi team.', 'How do you react?'),
('GM15', 'You failed the GATE exam twice despite months of preparation each time. Your coaching institute suggests you try a different career path.', 'How do you process this?')
) AS v(code, scenario, prompt) JOIN questions q ON q.code = v.code;

-- GM Hindi variants
INSERT INTO question_variants (question_id, locale, scenario, prompt)
SELECT q.id, 'hi', v.scenario, v.prompt FROM (VALUES
('GM01', 'स्कूल में गणित में अच्छे होने के बावजूद कॉलेज की पहली कोडिंग परीक्षा में आपने खराब प्रदर्शन किया।', 'आप इस परिणाम को कैसे समझते हैं?'),
('GM02', 'संभावित ग्राहकों के सामने आपके पहले स्टार्टअप प्रोडक्ट डेमो में कुछ भी उम्मीद के मुताबिक काम नहीं किया।', 'आपकी क्या सीख है?'),
('GM03', 'वार्षिक समीक्षा में फीडबैक मिलता है कि आपके प्रेजेंटेशन स्किल्स में काफी सुधार की ज़रूरत है।', 'आप कैसे जवाब देंगे?'),
('GM04', 'एक सहपाठी जो पढ़ाई में कमज़ोर था, स्टडी मेथड बदलने के बाद अचानक आपसे बेहतर प्रदर्शन करने लगा।', 'आप कैसे रिएक्ट करेंगे?'),
('GM05', 'स्टार्टअप मेंटर कहता है कि आपके टेक्निकल स्किल्स उस प्रोडक्ट को बनाने के लिए पर्याप्त नहीं हैं जो आप चाहते हैं।', 'आप क्या करेंगे?'),
('GM06', 'आपसे एक ऐसी टेक्नोलॉजी में प्रोजेक्ट लीड करने को कहा जाता है जिसमें आपने कभी काम नहीं किया।', 'आप कैसे आगे बढ़ेंगे?'),
('GM07', '6 महीने से डेटा साइंस सीख रहे हैं लेकिन Kaggle प्रतियोगिता में आपके स्कोर नीचे 20 प्रतिशत में हैं।', 'आपका अगला कदम क्या है?'),
('GM08', 'कम अनुभव और संसाधनों वाले प्रतियोगी ने आपसे बेहतर प्रोडक्ट बना दिया।', 'आप इससे क्या सीखते हैं?'),
('GM09', 'ऑफिस में कोड रिव्यू 47 कमेंट्स और सुधार सुझावों के साथ वापस आता है।', 'आप इसके बारे में कैसा महसूस करते हैं?'),
('GM10', 'सांख्यिकी कोर्स में आपने संघर्ष किया और मुश्किल से पास हुए जबकि दोस्तों को आसान लगा।', 'आपका चिंतन क्या है?'),
('GM11', 'स्टार्टअप पिवट फेल हुआ और नई दिशा भी ट्रैक्शन नहीं मिला। टीम का मनोबल सबसे नीचे है।', 'आप खुद को और टीम को कैसे प्रेरित करेंगे?'),
('GM12', 'आपको लगता है कि मुंबई ऑफिस में छोटे सहकर्मी नए AI टूल्स को आपसे तेज़ी से अपना रहे हैं।', 'आप कैसे जवाब देंगे?'),
('GM13', '5 साल में 3 फेल स्टार्टअप्स के बाद परिवार का सदस्य कहता है मान लो कि उद्यमिता तुम्हारे बस की नहीं।', 'आपकी प्रतिक्रिया क्या है?'),
('GM14', 'दिल्ली टीम में एक गंभीर कमी भरने के लिए आपसे आरामदायक बैकएंड रोल छोड़कर अनजान फुल-स्टैक रोल में जाने को कहा जाता है।', 'आप कैसे रिएक्ट करेंगे?'),
('GM15', 'महीनों की तैयारी के बावजूद GATE परीक्षा में दो बार फेल हुए। कोचिंग इंस्टीट्यूट कहता है कोई और करियर आज़माओ।', 'आप इसे कैसे समझते हैं?')
) AS v(code, scenario, prompt) JOIN questions q ON q.code = v.code;

-- GM Options (English)
INSERT INTO question_options (question_id, "position", locale, text, weights)
SELECT q.id, v.pos, 'en', v.text, v.weights::jsonb FROM (VALUES
('GM01',1,'I am just not meant for coding — math and coding are different things','{"growth_mindset":0.5,"self_efficacy":0.5}'),
('GM01',2,'This is a new skill and struggles are normal. I will analyze my mistakes and practice more','{"growth_mindset":5.0,"grit_perseverance":4.0,"self_efficacy":3.5}'),
('GM01',3,'The test was unfairly difficult','{"growth_mindset":1.0,"eq_self_regulation":1.0}'),
('GM01',4,'Maybe I should switch to a non-technical field','{"growth_mindset":0.5,"risk_tolerance":1.5}'),
('GM02',1,'I am clearly not good at building products','{"growth_mindset":0.5,"self_efficacy":0.5}'),
('GM02',2,'Every great product had a terrible first demo. I will fix the bugs and prepare better for the next one','{"growth_mindset":5.0,"grit_perseverance":4.5,"action_orientation":4.0}'),
('GM02',3,'It was just bad luck — the WiFi was slow and affected the demo','{"growth_mindset":1.0,"integrity":1.0}'),
('GM02',4,'Maybe I should hire someone else to do demos','{"growth_mindset":2.0,"collaboration":2.5}'),
('GM03',1,'The reviewer does not understand my style — I do not need to change','{"growth_mindset":0.5,"eq_self_regulation":1.0}'),
('GM03',2,'This is valuable feedback. I will join a public speaking club and practice weekly','{"growth_mindset":5.0,"proactivity":4.5,"action_orientation":4.0}'),
('GM03',3,'Some people are natural presenters and I am not — it is genetic','{"growth_mindset":0.5,"self_efficacy":0.5}'),
('GM03',4,'I will avoid roles that require presentations','{"growth_mindset":1.0,"strategic_thinking":1.5}'),
('GM04',1,'They must be cheating or just got lucky','{"growth_mindset":0.5,"integrity":0.5}'),
('GM04',2,'Ask them what changed and learn from their approach — if they improved, so can I','{"growth_mindset":5.0,"collaboration":4.0,"proactivity":3.5}'),
('GM04',3,'Feel threatened and study longer hours without changing anything','{"growth_mindset":1.5,"grit_perseverance":2.5}'),
('GM04',4,'Some people are just smarter than others — nothing I can do','{"growth_mindset":0.5}'),
('GM05',1,'Accept that I do not have what it takes technically','{"growth_mindset":0.5,"self_efficacy":0.5}'),
('GM05',2,'Create a learning roadmap, take online courses, and build progressively complex prototypes to close the gap','{"growth_mindset":5.0,"action_orientation":4.5,"grit_perseverance":4.0,"strategic_thinking":3.5}'),
('GM05',3,'Hire a CTO and focus only on business tasks','{"growth_mindset":2.0,"strategic_thinking":3.5}'),
('GM05',4,'Find a simpler product to build that matches my current skills','{"growth_mindset":1.5,"strategic_thinking":2.5}'),
('GM06',1,'Decline — I should only work with technologies I already know','{"growth_mindset":0.5,"risk_tolerance":0.5}'),
('GM06',2,'Accept enthusiastically, spend the first week learning intensively, and set up regular check-ins with experts','{"growth_mindset":5.0,"proactivity":4.5,"risk_tolerance":4.0,"action_orientation":4.0}'),
('GM06',3,'Accept but feel anxious the entire time about failing','{"growth_mindset":2.0,"eq_self_regulation":1.5}'),
('GM06',4,'Ask for a colleague who already knows the technology to lead instead','{"growth_mindset":1.5,"collaboration":2.5}'),
('GM07',1,'Data science is clearly not my field — I will quit','{"growth_mindset":0.5,"grit_perseverance":0.5}'),
('GM07',2,'Review top solutions, identify specific knowledge gaps, focus on those areas, and set a target for the next competition','{"growth_mindset":5.0,"strategic_thinking":4.5,"grit_perseverance":4.0}'),
('GM07',3,'Kaggle competitions are not a fair measure of real data science ability','{"growth_mindset":1.0}'),
('GM07',4,'Watch more tutorials before attempting another competition','{"growth_mindset":2.5,"action_orientation":2.0}'),
('GM08',1,'They just got lucky — our product is fine','{"growth_mindset":0.5,"strategic_thinking":0.5}'),
('GM08',2,'Study their product deeply, understand what they did better, and use those insights to improve ours','{"growth_mindset":5.0,"strategic_thinking":4.5,"innovativeness":4.0}'),
('GM08',3,'Poach their best employees','{"growth_mindset":1.0,"integrity":0.5}'),
('GM08',4,'There is nothing to learn — they just had more connections','{"growth_mindset":0.5}'),
('GM09',1,'The reviewer is being unnecessarily harsh — my code was fine','{"growth_mindset":0.5,"eq_self_regulation":1.0}'),
('GM09',2,'This is amazing feedback — each comment is a chance to improve. I will address every point and learn the patterns','{"growth_mindset":5.0,"grit_perseverance":4.0,"integrity":4.0}'),
('GM09',3,'Feel embarrassed and defensive about the number of comments','{"growth_mindset":1.0,"eq_self_regulation":1.0}'),
('GM09',4,'Fix the comments but feel resentful','{"growth_mindset":2.0,"eq_self_regulation":2.0}'),
('GM10',1,'I am just not a math person — some people have the gene for it','{"growth_mindset":0.5}'),
('GM10',2,'I need to find different learning approaches — maybe visualization or practical applications will work better for me','{"growth_mindset":5.0,"strategic_thinking":4.0,"self_efficacy":3.5}'),
('GM10',3,'The professor taught it poorly','{"growth_mindset":1.0,"integrity":1.0}'),
('GM10',4,'Avoid statistics-heavy courses in the future','{"growth_mindset":0.5,"strategic_thinking":1.0}'),
('GM11',1,'We are clearly not capable of building a successful product','{"growth_mindset":0.5,"grit_perseverance":0.5}'),
('GM11',2,'Share learnings from both attempts, identify what we are getting wrong systematically, and iterate with a hypothesis-driven approach','{"growth_mindset":5.0,"strategic_thinking":4.5,"collaboration":4.0,"grit_perseverance":4.0}'),
('GM11',3,'Blame the market for not being ready for our product','{"growth_mindset":0.5}'),
('GM11',4,'Ask each team member if they want to continue or leave','{"growth_mindset":2.0,"collaboration":3.0}'),
('GM12',1,'AI is overhyped — my traditional skills are more valuable','{"growth_mindset":0.5}'),
('GM12',2,'Ask the younger colleagues to teach me, dedicate time daily to learn AI tools, and bring experience perspective to how we use them','{"growth_mindset":5.0,"collaboration":4.0,"proactivity":4.0}'),
('GM12',3,'Feel anxious about becoming irrelevant','{"growth_mindset":1.0,"eq_self_regulation":1.0}'),
('GM12',4,'Focus only on tasks that do not require AI tools','{"growth_mindset":0.5,"strategic_thinking":1.0}'),
('GM13',1,'Maybe they are right — I should give up on entrepreneurship','{"growth_mindset":0.5,"self_efficacy":0.5}'),
('GM13',2,'Each failure taught me critical lessons. Share specific learnings and explain how the next attempt will be different','{"growth_mindset":5.0,"grit_perseverance":5.0,"self_efficacy":4.0}'),
('GM13',3,'Get angry and cut off family members who doubt me','{"growth_mindset":1.0,"eq_self_regulation":0.5}'),
('GM13',4,'Continue doing exactly what I have been doing — persistence alone will work','{"growth_mindset":2.0,"grit_perseverance":3.0}'),
('GM14',1,'Refuse — switching roles will expose my weaknesses','{"growth_mindset":0.5,"risk_tolerance":0.5}'),
('GM14',2,'See it as a career-expanding opportunity, create a learning plan, and lean on the team for frontend knowledge','{"growth_mindset":5.0,"risk_tolerance":4.0,"proactivity":4.0,"collaboration":3.5}'),
('GM14',3,'Accept reluctantly but avoid frontend tasks when possible','{"growth_mindset":1.5,"integrity":1.0}'),
('GM14',4,'Negotiate to only do the backend portion of the full-stack role','{"growth_mindset":2.0,"strategic_thinking":2.5}'),
('GM15',1,'Accept the coaching institute advice and try a different career immediately','{"growth_mindset":1.5,"risk_tolerance":2.0}'),
('GM15',2,'Deeply analyze my preparation strategy, seek mentors who cleared GATE on later attempts, and redesign my approach','{"growth_mindset":5.0,"grit_perseverance":4.5,"strategic_thinking":4.5}'),
('GM15',3,'I am clearly not smart enough for GATE','{"growth_mindset":0.5,"self_efficacy":0.5}'),
('GM15',4,'Try one more time with the exact same preparation method','{"growth_mindset":1.5,"grit_perseverance":3.0}')
) AS v(code, pos, text, weights) JOIN questions q ON q.code = v.code;

-- ═══════════════════════════════════════════════════════════
-- DIMENSION 6: INTEGRITY (15 questions)
-- ═══════════════════════════════════════════════════════════

INSERT INTO questions (code, dimension_id, scenario_type, difficulty, is_active) VALUES
('IN01', (SELECT id FROM dimensions WHERE code='integrity'), 'COLLEGE', 1, true),
('IN02', (SELECT id FROM dimensions WHERE code='integrity'), 'STARTUP', 1, true),
('IN03', (SELECT id FROM dimensions WHERE code='integrity'), 'WORK', 2, true),
('IN04', (SELECT id FROM dimensions WHERE code='integrity'), 'COLLEGE', 2, true),
('IN05', (SELECT id FROM dimensions WHERE code='integrity'), 'STARTUP', 2, true),
('IN06', (SELECT id FROM dimensions WHERE code='integrity'), 'WORK', 2, true),
('IN07', (SELECT id FROM dimensions WHERE code='integrity'), 'COLLEGE', 3, true),
('IN08', (SELECT id FROM dimensions WHERE code='integrity'), 'STARTUP', 3, true),
('IN09', (SELECT id FROM dimensions WHERE code='integrity'), 'WORK', 3, true),
('IN10', (SELECT id FROM dimensions WHERE code='integrity'), 'COLLEGE', 3, true),
('IN11', (SELECT id FROM dimensions WHERE code='integrity'), 'STARTUP', 3, true),
('IN12', (SELECT id FROM dimensions WHERE code='integrity'), 'WORK', 3, true),
('IN13', (SELECT id FROM dimensions WHERE code='integrity'), 'STARTUP', 4, true),
('IN14', (SELECT id FROM dimensions WHERE code='integrity'), 'WORK', 4, true),
('IN15', (SELECT id FROM dimensions WHERE code='integrity'), 'COLLEGE', 5, true);

-- IN English variants
INSERT INTO question_variants (question_id, locale, scenario, prompt)
SELECT q.id, 'en', v.scenario, v.prompt FROM (VALUES
('IN01', 'During a college exam, your friend sitting next to you asks you to show your answer sheet so they can copy.', 'What do you do?'),
('IN02', 'Your startup co-founder suggests inflating user numbers in the pitch deck to impress investors.', 'How do you respond?'),
('IN03', 'You accidentally discover that your company is overbilling a client who has not noticed the discrepancy.', 'What do you do?'),
('IN04', 'You find a previous year question paper with exact answers for tomorrow exam being sold in the hostel.', 'What is your decision?'),
('IN05', 'A vendor offers you a personal kickback if you choose their services for your startup instead of a cheaper competitor.', 'How do you handle this?'),
('IN06', 'Your manager asks you to misrepresent project timelines to a client — saying you are ahead of schedule when you are actually behind.', 'What do you do?'),
('IN07', 'You accidentally submitted a classmate work as your own in an online assignment and received a high grade for it.', 'What is your next step?'),
('IN08', 'Your startup has a serious product bug that affected 200 users data. Your team suggests fixing it quietly without informing users.', 'What do you decide?'),
('IN09', 'A senior colleague asks you to approve an expense report that you know contains personal expenses disguised as business expenses.', 'How do you respond?'),
('IN10', 'During a group presentation, you realize that the data your teammate cited is fabricated to make the project look more successful.', 'What do you do?'),
('IN11', 'You discover that your startup competitor is violating data privacy regulations. Exposing them would benefit your business significantly.', 'How do you handle this?'),
('IN12', 'You are offered a promotion contingent on taking credit for a project that was primarily your subordinate work.', 'What do you decide?'),
('IN13', 'Your largest client demands that you fire a specific employee they dislike or they will cancel their contract worth 50 lakhs per year.', 'What is your response?'),
('IN14', 'You notice that your company diversity hiring numbers are being inflated in the annual report to look good publicly.', 'What do you do?'),
('IN15', 'You discover that a professor who is also your thesis advisor is plagiarizing sections of published papers in their own research. Reporting could end your academic career.', 'What do you do?')
) AS v(code, scenario, prompt) JOIN questions q ON q.code = v.code;

-- IN Hindi variants
INSERT INTO question_variants (question_id, locale, scenario, prompt)
SELECT q.id, 'hi', v.scenario, v.prompt FROM (VALUES
('IN01', 'कॉलेज परीक्षा में आपके बगल में बैठा दोस्त कॉपी करने के लिए आपकी आंसर शीट दिखाने को कहता है।', 'आप क्या करेंगे?'),
('IN02', 'स्टार्टअप को-फाउंडर निवेशकों को प्रभावित करने के लिए पिच डेक में यूज़र नंबर बढ़ा-चढ़ाकर दिखाने का सुझाव देता है।', 'आप कैसे जवाब देंगे?'),
('IN03', 'आपको गलती से पता चलता है कि कंपनी एक क्लाइंट से ज़्यादा बिलिंग कर रही है जिसने अभी तक यह नोटिस नहीं किया।', 'आप क्या करेंगे?'),
('IN04', 'हॉस्टल में कल की परीक्षा का पिछले साल का प्रश्नपत्र सटीक उत्तरों के साथ बिक रहा है।', 'आपका फैसला क्या है?'),
('IN05', 'एक वेंडर आपको व्यक्तिगत किकबैक ऑफर करता है अगर आप सस्ते प्रतियोगी की जगह उनकी सेवाएं चुनें।', 'आप इसे कैसे संभालेंगे?'),
('IN06', 'मैनेजर आपसे क्लाइंट को प्रोजेक्ट टाइमलाइन गलत बताने को कहता है — कहो कि आगे हो जबकि असल में पीछे हो।', 'आप क्या करेंगे?'),
('IN07', 'ऑनलाइन असाइनमेंट में गलती से सहपाठी का काम अपने नाम से जमा हो गया और अच्छे ग्रेड आ गए।', 'आपका अगला कदम क्या है?'),
('IN08', 'स्टार्टअप में गंभीर प्रोडक्ट बग से 200 यूज़र्स का डेटा प्रभावित हुआ। टीम चुपचाप ठीक करने का सुझाव देती है।', 'आप क्या फैसला करेंगे?'),
('IN09', 'सीनियर सहकर्मी आपसे एक खर्च रिपोर्ट अनुमोदित करने को कहता है जिसमें व्यक्तिगत खर्चे बिज़नेस के रूप में दिखाए गए हैं।', 'आप कैसे जवाब देंगे?'),
('IN10', 'ग्रुप प्रेजेंटेशन में आपको पता चलता है कि टीममेट ने प्रोजेक्ट को सफल दिखाने के लिए डेटा गढ़ा है।', 'आप क्या करेंगे?'),
('IN11', 'पता चलता है कि प्रतियोगी डेटा प्राइवेसी नियमों का उल्लंघन कर रहा है। उन्हें एक्सपोज़ करना आपके बिज़नेस के लिए फायदेमंद होगा।', 'आप कैसे संभालेंगे?'),
('IN12', 'प्रमोशन इस शर्त पर मिल रहा है कि एक प्रोजेक्ट का क्रेडिट लो जो मुख्यतः आपके अधीनस्थ का काम था।', 'आप क्या फैसला करेंगे?'),
('IN13', 'सबसे बड़ा क्लाइंट मांग करता है कि एक विशेष कर्मचारी को निकालो जो उन्हें पसंद नहीं, वरना 50 लाख का कॉन्ट्रैक्ट रद्द कर देंगे।', 'आपकी प्रतिक्रिया क्या है?'),
('IN14', 'आप देखते हैं कि कंपनी की वार्षिक रिपोर्ट में डाइवर्सिटी हायरिंग के आंकड़े बढ़ा-चढ़ाकर दिखाए गए हैं।', 'आप क्या करेंगे?'),
('IN15', 'पता चलता है कि प्रोफेसर जो आपके थीसिस एडवाइज़र भी हैं, अपने रिसर्च में प्रकाशित पेपर्स की साहित्यिक चोरी कर रहे हैं। रिपोर्ट करने से आपका अकादमिक करियर खत्म हो सकता है।', 'आप क्या करेंगे?')
) AS v(code, scenario, prompt) JOIN questions q ON q.code = v.code;

-- IN Options (English)
INSERT INTO question_options (question_id, "position", locale, text, weights)
SELECT q.id, v.pos, 'en', v.text, v.weights::jsonb FROM (VALUES
('IN01',1,'Show them your answers — they are your friend after all','{"integrity":0.5,"collaboration":1.5}'),
('IN01',2,'Politely refuse and explain that cheating hurts both of you','{"integrity":5.0,"eq_self_regulation":3.5,"self_efficacy":3.5}'),
('IN01',3,'Ignore them and focus on your paper','{"integrity":3.0,"eq_self_regulation":2.5}'),
('IN01',4,'Show them only a few answers to help partially','{"integrity":1.5,"collaboration":2.0}'),
('IN02',1,'Agree — everyone exaggerates in pitch decks','{"integrity":0.5,"risk_tolerance":2.0}'),
('IN02',2,'Refuse firmly and present real metrics with a compelling growth story instead','{"integrity":5.0,"strategic_thinking":4.5,"self_efficacy":4.0}'),
('IN02',3,'Inflate slightly but not as much as they suggest','{"integrity":1.5,"risk_tolerance":2.0}'),
('IN02',4,'Let the co-founder handle the pitch deck alone so you are not involved','{"integrity":2.0,"collaboration":0.5}'),
('IN03',1,'Stay quiet — it is not your responsibility and the client should check their bills','{"integrity":1.0,"proactivity":0.5}'),
('IN03',2,'Report the discrepancy to your manager and recommend correcting the billing immediately','{"integrity":5.0,"proactivity":4.0,"collaboration":3.5}'),
('IN03',3,'Wait to see if the client notices on their own','{"integrity":1.5,"action_orientation":0.5}'),
('IN03',4,'Mention it casually to a trusted colleague and see what they suggest','{"integrity":2.5,"collaboration":2.5}'),
('IN04',1,'Buy it — everyone else is doing it and you need good grades','{"integrity":0.5,"risk_tolerance":1.0}'),
('IN04',2,'Do not buy it and report the situation to the department anonymously','{"integrity":5.0,"proactivity":4.0,"eq_self_regulation":3.5}'),
('IN04',3,'Do not buy it but do not report it either','{"integrity":3.5,"eq_self_regulation":2.5}'),
('IN04',4,'Buy it but only use it to understand the question pattern, not memorize answers','{"integrity":1.5,"strategic_thinking":2.0}'),
('IN05',1,'Accept the kickback — it is standard business practice','{"integrity":0.5}'),
('IN05',2,'Decline the kickback, evaluate vendors purely on merit, and report the offer','{"integrity":5.0,"strategic_thinking":4.0,"proactivity":3.5}'),
('IN05',3,'Decline the kickback but choose the vendor if their service is reasonably good','{"integrity":3.0,"strategic_thinking":2.5}'),
('IN05',4,'Ask for a bigger kickback before deciding','{"integrity":0.5}'),
('IN06',1,'Do as the manager says — they know the client relationship better','{"integrity":1.0,"collaboration":2.0}'),
('IN06',2,'Respectfully decline and suggest presenting an honest status with a realistic recovery plan','{"integrity":5.0,"strategic_thinking":4.5,"eq_self_regulation":4.0}'),
('IN06',3,'Present the lie but feel guilty about it','{"integrity":1.5,"eq_self_regulation":1.5}'),
('IN06',4,'Send the update from the manager email instead of yours','{"integrity":1.0}'),
('IN07',1,'Keep the grade — it was an honest mistake and nobody will know','{"integrity":1.0,"risk_tolerance":1.5}'),
('IN07',2,'Contact the professor, explain the mistake, and resubmit your own work','{"integrity":5.0,"eq_self_regulation":4.5,"self_efficacy":4.0}'),
('IN07',3,'Redo the assignment properly but do not tell the professor about the mix-up','{"integrity":3.0,"action_orientation":2.5}'),
('IN07',4,'Wait and only confess if someone finds out','{"integrity":1.5}'),
('IN08',1,'Fix it quietly — informing users will damage our reputation','{"integrity":1.0,"strategic_thinking":2.0}'),
('IN08',2,'Immediately notify all affected users, explain the issue transparently, and share what you are doing to fix it','{"integrity":5.0,"proactivity":4.5,"collaboration":4.0}'),
('IN08',3,'Fix the bug first and then quietly send a vague notification','{"integrity":2.5,"strategic_thinking":2.5}'),
('IN08',4,'Consult a lawyer before saying anything to users','{"integrity":3.0,"strategic_thinking":3.5}'),
('IN09',1,'Approve it — they are senior and you do not want to create problems','{"integrity":0.5,"eq_self_regulation":1.0}'),
('IN09',2,'Politely decline and explain that you cannot approve expenses that appear personal','{"integrity":5.0,"eq_self_regulation":4.0,"self_efficacy":4.0}'),
('IN09',3,'Approve it but keep a personal record in case it comes up later','{"integrity":1.5,"strategic_thinking":2.0}'),
('IN09',4,'Redirect the approval to someone else','{"integrity":2.0,"action_orientation":1.5}'),
('IN10',1,'Say nothing — the presentation is tomorrow and there is no time to fix it','{"integrity":1.0,"collaboration":1.5}'),
('IN10',2,'Tell the teammate privately that the data must be corrected before presenting, even if it means a lower grade','{"integrity":5.0,"collaboration":4.0,"eq_self_regulation":3.5}'),
('IN10',3,'Let the presentation happen but distance yourself from the fabricated section','{"integrity":2.5,"strategic_thinking":2.0}'),
('IN10',4,'Report the teammate to the professor without discussing it first','{"integrity":3.5,"collaboration":1.0}'),
('IN11',1,'Expose them publicly on social media to benefit your business','{"integrity":2.0,"strategic_thinking":2.0}'),
('IN11',2,'Report the violation through proper regulatory channels without exploiting it for competitive advantage','{"integrity":5.0,"eq_self_regulation":4.0,"strategic_thinking":3.5}'),
('IN11',3,'Use the information to win their customers by telling them about the violation','{"integrity":1.5,"strategic_thinking":2.5}'),
('IN11',4,'Ignore it — it is their problem not yours','{"integrity":2.5,"proactivity":0.5}'),
('IN12',1,'Take the promotion — it is a competitive world','{"integrity":1.0,"self_efficacy":2.0}'),
('IN12',2,'Accept the promotion only if your subordinate contribution is publicly acknowledged and they also benefit','{"integrity":5.0,"collaboration":4.5,"eq_self_regulation":4.0}'),
('IN12',3,'Decline the promotion entirely','{"integrity":4.0,"self_efficacy":2.0}'),
('IN12',4,'Take the promotion and privately thank the subordinate','{"integrity":2.0,"collaboration":2.5}'),
('IN13',1,'Fire the employee — the business cannot afford to lose 50 lakhs','{"integrity":1.0,"strategic_thinking":2.0}'),
('IN13',2,'Refuse to fire the employee based on client personal preference and work to either resolve the interpersonal issue or diversify clients','{"integrity":5.0,"strategic_thinking":4.0,"collaboration":4.5,"grit_perseverance":4.0}'),
('IN13',3,'Move the employee to a different project so the client does not interact with them','{"integrity":3.0,"strategic_thinking":3.5}'),
('IN13',4,'Put the employee on a performance improvement plan as a compromise','{"integrity":1.5,"strategic_thinking":2.5}'),
('IN14',1,'Stay quiet — it is above your pay grade','{"integrity":1.0,"proactivity":0.5}'),
('IN14',2,'Raise the concern formally with the compliance or ethics team with specific data','{"integrity":5.0,"proactivity":4.5,"eq_self_regulation":4.0}'),
('IN14',3,'Mention it informally to your manager','{"integrity":3.0,"proactivity":2.0}'),
('IN14',4,'Post about it anonymously on Glassdoor','{"integrity":2.0,"eq_self_regulation":1.5}'),
('IN15',1,'Stay silent — your career depends on this advisor','{"integrity":1.0,"self_efficacy":1.0}'),
('IN15',2,'Gather evidence carefully, consult the university ethics committee confidentially, and understand whistleblower protections before acting','{"integrity":5.0,"strategic_thinking":5.0,"eq_self_regulation":4.0,"grit_perseverance":4.0}'),
('IN15',3,'Confront the professor directly and demand they stop','{"integrity":4.0,"eq_self_regulation":1.5}'),
('IN15',4,'Quietly switch advisors without reporting the plagiarism','{"integrity":2.0,"strategic_thinking":2.5}')
) AS v(code, pos, text, weights) JOIN questions q ON q.code = v.code;

-- ═══════════════════════════════════════════════════════════
-- DIMENSION 7: STRATEGIC THINKING (15 questions)
-- ═══════════════════════════════════════════════════════════

INSERT INTO questions (code, dimension_id, scenario_type, difficulty, is_active) VALUES
('ST01', (SELECT id FROM dimensions WHERE code='strategic_thinking'), 'COLLEGE', 1, true),
('ST02', (SELECT id FROM dimensions WHERE code='strategic_thinking'), 'STARTUP', 1, true),
('ST03', (SELECT id FROM dimensions WHERE code='strategic_thinking'), 'WORK', 2, true),
('ST04', (SELECT id FROM dimensions WHERE code='strategic_thinking'), 'COLLEGE', 2, true),
('ST05', (SELECT id FROM dimensions WHERE code='strategic_thinking'), 'STARTUP', 2, true),
('ST06', (SELECT id FROM dimensions WHERE code='strategic_thinking'), 'WORK', 2, true),
('ST07', (SELECT id FROM dimensions WHERE code='strategic_thinking'), 'COLLEGE', 3, true),
('ST08', (SELECT id FROM dimensions WHERE code='strategic_thinking'), 'STARTUP', 3, true),
('ST09', (SELECT id FROM dimensions WHERE code='strategic_thinking'), 'WORK', 3, true),
('ST10', (SELECT id FROM dimensions WHERE code='strategic_thinking'), 'STARTUP', 3, true),
('ST11', (SELECT id FROM dimensions WHERE code='strategic_thinking'), 'COLLEGE', 3, true),
('ST12', (SELECT id FROM dimensions WHERE code='strategic_thinking'), 'WORK', 3, true),
('ST13', (SELECT id FROM dimensions WHERE code='strategic_thinking'), 'STARTUP', 4, true),
('ST14', (SELECT id FROM dimensions WHERE code='strategic_thinking'), 'WORK', 4, true),
('ST15', (SELECT id FROM dimensions WHERE code='strategic_thinking'), 'STARTUP', 5, true);

-- ST English variants
INSERT INTO question_variants (question_id, locale, scenario, prompt)
SELECT q.id, 'en', v.scenario, v.prompt FROM (VALUES
('ST01', 'You have 6 months before campus placements begin and need to decide which skills to develop.', 'How do you plan your preparation?'),
('ST02', 'Your startup has limited runway and must choose between building 3 features that customers are requesting.', 'How do you prioritize?'),
('ST03', 'Your team is asked to deliver a large project in 3 months. It normally takes 6 months. Resources cannot be increased.', 'What is your approach?'),
('ST04', 'You want to pursue both a competitive exam and campus placements but preparing for both simultaneously seems impossible.', 'How do you plan?'),
('ST05', 'Your startup operates in a market where a large company just announced entry with unlimited resources.', 'What is your strategy?'),
('ST06', 'Your department budget was cut by 30 percent but the deliverables remain the same.', 'How do you handle this?'),
('ST07', 'You need to choose your final year electives and the choices will significantly impact your career direction.', 'How do you decide?'),
('ST08', 'Your startup has traction in 3 different customer segments. You need to focus on one to scale effectively.', 'How do you choose?'),
('ST09', 'Two of your best team members want to leave for competitor companies at the same time.', 'What is your retention strategy?'),
('ST10', 'Your startup B2B product is selling well in India but international expansion is being demanded by investors.', 'How do you plan the expansion?'),
('ST11', 'You are the college fest organizing committee head with a budget of 5 lakhs but the previous year fest cost 8 lakhs.', 'How do you plan?'),
('ST12', 'Your company wants to enter the AI space but has no in-house AI expertise. Build, buy, or partner are the options.', 'What do you recommend and why?'),
('ST13', 'Your startup is being approached by 3 different acquirers simultaneously. Each offers different terms — cash, stock, and earnout.', 'How do you evaluate?'),
('ST14', 'The industry you work in is going through rapid technological disruption. Half the current skills may be obsolete in 3 years.', 'What is your strategic response?'),
('ST15', 'Your startup must choose between two fundamentally different business models — marketplace vs SaaS — each with different capital needs and timelines.', 'How do you make this decision?')
) AS v(code, scenario, prompt) JOIN questions q ON q.code = v.code;

-- ST Hindi variants
INSERT INTO question_variants (question_id, locale, scenario, prompt)
SELECT q.id, 'hi', v.scenario, v.prompt FROM (VALUES
('ST01', 'कैंपस प्लेसमेंट में 6 महीने बाकी हैं और तय करना है कि कौन से स्किल्स विकसित करें।', 'आप तैयारी की योजना कैसे बनाएंगे?'),
('ST02', 'स्टार्टअप का रनवे सीमित है और ग्राहक 3 फीचर्स मांग रहे हैं लेकिन सभी नहीं बना सकते।', 'आप प्राथमिकता कैसे तय करेंगे?'),
('ST03', 'टीम से 3 महीने में बड़ा प्रोजेक्ट डिलीवर करने को कहा गया जो सामान्यतः 6 महीने लेता है। संसाधन नहीं बढ़ा सकते।', 'आपका दृष्टिकोण क्या है?'),
('ST04', 'आप प्रतियोगी परीक्षा और कैंपस प्लेसमेंट दोनों करना चाहते हैं लेकिन दोनों की तैयारी एक साथ असंभव लगती है।', 'आप कैसे प्लान करेंगे?'),
('ST05', 'आपके मार्केट में एक बड़ी कंपनी ने असीमित संसाधनों के साथ प्रवेश की घोषणा की।', 'आपकी रणनीति क्या है?'),
('ST06', 'विभाग का बजट 30 प्रतिशत कट गया लेकिन डिलीवरेबल्स वही हैं।', 'आप इसे कैसे संभालेंगे?'),
('ST07', 'फाइनल ईयर इलेक्टिव चुनने हैं और ये चुनाव करियर की दिशा को काफी प्रभावित करेंगे।', 'आप कैसे फैसला करेंगे?'),
('ST08', 'स्टार्टअप को 3 अलग-अलग कस्टमर सेगमेंट्स में ट्रैक्शन मिल रहा है। स्केल के लिए एक पर फोकस करना होगा।', 'आप कैसे चुनेंगे?'),
('ST09', 'दो सबसे अच्छे टीम मेंबर एक साथ प्रतियोगी कंपनियों में जाना चाहते हैं।', 'आपकी रिटेंशन रणनीति क्या है?'),
('ST10', 'स्टार्टअप B2B प्रोडक्ट भारत में अच्छा बिक रहा है लेकिन निवेशक अंतरराष्ट्रीय विस्तार की मांग कर रहे हैं।', 'विस्तार की योजना कैसे बनाएंगे?'),
('ST11', 'कॉलेज फेस्ट ऑर्गनाइजिंग कमेटी के हेड हैं। बजट 5 लाख है लेकिन पिछले साल 8 लाख खर्च हुए थे।', 'आप कैसे प्लान करेंगे?'),
('ST12', 'कंपनी AI स्पेस में आना चाहती है लेकिन इन-हाउस AI विशेषज्ञता नहीं है। बनाओ, खरीदो, या पार्टनर करो — विकल्प हैं।', 'आपकी सिफारिश क्या है और क्यों?'),
('ST13', 'स्टार्टअप को 3 अलग-अलग कंपनियां एक साथ अधिग्रहण का प्रस्ताव दे रही हैं — कैश, स्टॉक, और अर्नआउट।', 'आप कैसे मूल्यांकन करेंगे?'),
('ST14', 'आपकी इंडस्ट्री तेज़ तकनीकी बदलाव से गुज़र रही है। मौजूदा आधे स्किल्स 3 साल में बेकार हो सकते हैं।', 'आपकी रणनीतिक प्रतिक्रिया क्या है?'),
('ST15', 'स्टार्टअप को दो मूलतः अलग बिज़नेस मॉडल — मार्केटप्लेस बनाम SaaS — में से चुनना है। दोनों की पूंजी ज़रूरतें और समयसीमा अलग हैं।', 'आप यह फैसला कैसे लेंगे?')
) AS v(code, scenario, prompt) JOIN questions q ON q.code = v.code;

-- ST Options (English)
INSERT INTO question_options (question_id, "position", locale, text, weights)
SELECT q.id, v.pos, 'en', v.text, v.weights::jsonb FROM (VALUES
('ST01',1,'Focus only on coding since tech companies pay the most','{"strategic_thinking":1.5,"growth_mindset":1.5}'),
('ST01',2,'Research which companies visit your campus, identify skill gaps against their requirements, and create a prioritized learning plan','{"strategic_thinking":5.0,"proactivity":4.5,"action_orientation":4.0}'),
('ST01',3,'Do what your seniors recommend without questioning','{"strategic_thinking":1.0,"collaboration":2.0}'),
('ST01',4,'Try to learn everything — coding, aptitude, communication, domain skills — equally','{"strategic_thinking":2.0,"grit_perseverance":2.5}'),
('ST02',1,'Build all three features simultaneously','{"strategic_thinking":1.0,"action_orientation":2.0}'),
('ST02',2,'Analyze which feature impacts the most customers, has the best retention potential, and aligns with long-term vision — then build that first','{"strategic_thinking":5.0,"proactivity":4.0,"innovativeness":3.5}'),
('ST02',3,'Build whichever is easiest first','{"strategic_thinking":1.5,"action_orientation":2.5}'),
('ST02',4,'Ask customers to vote on which feature they want most','{"strategic_thinking":3.0,"collaboration":3.5}'),
('ST03',1,'Tell management it is impossible and refuse the deadline','{"strategic_thinking":1.0,"grit_perseverance":0.5}'),
('ST03',2,'Identify the critical 60 percent of scope that delivers 90 percent of value, negotiate scope reduction, and create a phased delivery plan','{"strategic_thinking":5.0,"collaboration":4.0,"action_orientation":4.5}'),
('ST03',3,'Accept the deadline and work overtime to meet it','{"strategic_thinking":1.5,"grit_perseverance":3.5}'),
('ST03',4,'Hire contractors to fill the resource gap','{"strategic_thinking":2.5,"action_orientation":3.0}'),
('ST04',1,'Drop the competitive exam and focus entirely on placements','{"strategic_thinking":2.0,"risk_tolerance":1.0}'),
('ST04',2,'Map the overlapping skills, create a phased timeline with decision checkpoints, and keep the competitive exam as backup','{"strategic_thinking":5.0,"grit_perseverance":4.0,"risk_tolerance":3.5}'),
('ST04',3,'Try both simultaneously without a plan','{"strategic_thinking":0.5,"grit_perseverance":2.5}'),
('ST04',4,'Ask parents to decide which is more important','{"strategic_thinking":1.0,"self_efficacy":0.5}'),
('ST05',1,'Shut down — we cannot compete with a large company','{"strategic_thinking":0.5,"grit_perseverance":0.5}'),
('ST05',2,'Identify the niche they will ignore, move faster on customer relationships, and build switching costs before they catch up','{"strategic_thinking":5.0,"innovativeness":4.5,"action_orientation":4.0}'),
('ST05',3,'Lower prices to compete on cost','{"strategic_thinking":1.5}'),
('ST05',4,'Try to get acquired by the large company','{"strategic_thinking":3.0,"risk_tolerance":3.0}'),
('ST06',1,'Do less work — less budget means less output','{"strategic_thinking":1.0}'),
('ST06',2,'Audit all spending, eliminate low-impact activities, automate repetitive tasks, and negotiate vendor contracts','{"strategic_thinking":5.0,"innovativeness":4.0,"action_orientation":4.0}'),
('ST06',3,'Ask management for more budget','{"strategic_thinking":1.5,"proactivity":2.0}'),
('ST06',4,'Cut team headcount to fit the budget','{"strategic_thinking":2.0,"collaboration":0.5}'),
('ST07',1,'Choose whatever my friends are choosing','{"strategic_thinking":0.5,"collaboration":1.5}'),
('ST07',2,'Research industry trends, talk to alumni and professionals in target fields, and align electives with both interest and market demand','{"strategic_thinking":5.0,"proactivity":4.5,"growth_mindset":4.0}'),
('ST07',3,'Choose the easiest electives for a better GPA','{"strategic_thinking":1.5}'),
('ST07',4,'Choose purely based on personal interest without market research','{"strategic_thinking":2.0,"growth_mindset":3.0}'),
('ST08',1,'Focus on the segment with the most current revenue','{"strategic_thinking":2.5}'),
('ST08',2,'Evaluate each segment on market size, lifetime value, acquisition cost, competition, and strategic fit — then pick the one with the best overall score','{"strategic_thinking":5.0,"innovativeness":3.5,"risk_tolerance":3.5}'),
('ST08',3,'Try to serve all three segments at once','{"strategic_thinking":1.0}'),
('ST08',4,'Let investors decide which segment to focus on','{"strategic_thinking":1.5,"collaboration":2.0}'),
('ST09',1,'Let them go — people are replaceable','{"strategic_thinking":1.0,"collaboration":0.5}'),
('ST09',2,'Understand their motivations, address concerns proactively, offer growth paths, and ensure knowledge transfer while building team depth','{"strategic_thinking":5.0,"collaboration":4.5,"eq_self_regulation":4.0}'),
('ST09',3,'Counter-offer with higher salary','{"strategic_thinking":2.5}'),
('ST09',4,'Threaten them with non-compete agreements','{"strategic_thinking":1.0,"integrity":0.5}'),
('ST10',1,'Expand to every market simultaneously for maximum growth','{"strategic_thinking":1.0,"risk_tolerance":3.0}'),
('ST10',2,'Pick one target market based on cultural fit, regulatory ease, existing demand signals, and competition — run a 3-month pilot before committing','{"strategic_thinking":5.0,"risk_tolerance":3.5,"action_orientation":4.0}'),
('ST10',3,'Hire an international sales team immediately','{"strategic_thinking":2.0,"action_orientation":3.0}'),
('ST10',4,'Tell investors India is big enough and push back on expansion','{"strategic_thinking":2.5,"eq_self_regulation":2.5}'),
('ST11',1,'Scale everything down proportionally','{"strategic_thinking":2.0}'),
('ST11',2,'Identify the 3 events that drive maximum footfall and sponsorship, cut low-impact items, and negotiate better vendor rates and more sponsorships','{"strategic_thinking":5.0,"innovativeness":4.0,"action_orientation":4.0}'),
('ST11',3,'Ask the college to increase the budget','{"strategic_thinking":1.5,"proactivity":2.0}'),
('ST11',4,'Cancel the fest because the budget is too low','{"strategic_thinking":0.5}'),
('ST12',1,'Build an in-house AI team from scratch — it will take time but we will own it','{"strategic_thinking":2.5,"grit_perseverance":3.0}'),
('ST12',2,'Evaluate all three options against speed-to-market, cost, IP ownership, and competitive risk — likely start with a strategic partnership while building internal capability','{"strategic_thinking":5.0,"innovativeness":4.0,"collaboration":4.0}'),
('ST12',3,'Acquire an AI startup regardless of cost','{"strategic_thinking":2.0,"risk_tolerance":3.5}'),
('ST12',4,'Wait for AI tools to become commoditized','{"strategic_thinking":1.5}'),
('ST13',1,'Accept the highest cash offer for immediate safety','{"strategic_thinking":2.0,"risk_tolerance":1.5}'),
('ST13',2,'Create a weighted scorecard comparing total value, strategic fit, team retention, earn-out likelihood, and tax implications for each offer','{"strategic_thinking":5.0,"integrity":4.0,"collaboration":3.5}'),
('ST13',3,'Play acquirers against each other to drive up the price','{"strategic_thinking":3.0,"integrity":2.0}'),
('ST13',4,'Ask your investors to decide which offer is best','{"strategic_thinking":1.5,"self_efficacy":1.0}'),
('ST14',1,'Focus on current skills — predictions about the future are usually wrong','{"strategic_thinking":1.0}'),
('ST14',2,'Create a personal and team learning roadmap aligned with emerging technologies, allocate 20 percent time to future skills, and build a network in the new space','{"strategic_thinking":5.0,"growth_mindset":4.5,"proactivity":4.5}'),
('ST14',3,'Wait to see which direction the industry takes before investing in learning','{"strategic_thinking":2.0,"risk_tolerance":1.0}'),
('ST14',4,'Switch industries entirely to something more stable','{"strategic_thinking":2.0,"risk_tolerance":2.0}'),
('ST15',1,'Pick the one that requires less capital','{"strategic_thinking":2.0,"risk_tolerance":1.5}'),
('ST15',2,'Model both scenarios with detailed financial projections, validate assumptions with customer interviews, run small experiments for each, and decide based on data','{"strategic_thinking":5.0,"innovativeness":4.0,"action_orientation":4.5,"risk_tolerance":4.0}'),
('ST15',3,'Go with whatever your investors prefer','{"strategic_thinking":1.0,"self_efficacy":0.5}'),
('ST15',4,'Try to build a hybrid model that combines both','{"strategic_thinking":2.5,"innovativeness":3.0}')
) AS v(code, pos, text, weights) JOIN questions q ON q.code = v.code;

-- ═══════════════════════════════════════════════════════════
-- DIMENSION 8: COLLABORATION (15 questions)
-- ═══════════════════════════════════════════════════════════

INSERT INTO questions (code, dimension_id, scenario_type, difficulty, is_active) VALUES
('CO01', (SELECT id FROM dimensions WHERE code='collaboration'), 'COLLEGE', 1, true),
('CO02', (SELECT id FROM dimensions WHERE code='collaboration'), 'STARTUP', 1, true),
('CO03', (SELECT id FROM dimensions WHERE code='collaboration'), 'WORK', 2, true),
('CO04', (SELECT id FROM dimensions WHERE code='collaboration'), 'COLLEGE', 2, true),
('CO05', (SELECT id FROM dimensions WHERE code='collaboration'), 'STARTUP', 2, true),
('CO06', (SELECT id FROM dimensions WHERE code='collaboration'), 'WORK', 2, true),
('CO07', (SELECT id FROM dimensions WHERE code='collaboration'), 'COLLEGE', 3, true),
('CO08', (SELECT id FROM dimensions WHERE code='collaboration'), 'STARTUP', 3, true),
('CO09', (SELECT id FROM dimensions WHERE code='collaboration'), 'WORK', 3, true),
('CO10', (SELECT id FROM dimensions WHERE code='collaboration'), 'COLLEGE', 3, true),
('CO11', (SELECT id FROM dimensions WHERE code='collaboration'), 'STARTUP', 3, true),
('CO12', (SELECT id FROM dimensions WHERE code='collaboration'), 'WORK', 3, true),
('CO13', (SELECT id FROM dimensions WHERE code='collaboration'), 'STARTUP', 4, true),
('CO14', (SELECT id FROM dimensions WHERE code='collaboration'), 'WORK', 4, true),
('CO15', (SELECT id FROM dimensions WHERE code='collaboration'), 'COLLEGE', 5, true);

-- CO English variants
INSERT INTO question_variants (question_id, locale, scenario, prompt)
SELECT q.id, 'en', v.scenario, v.prompt FROM (VALUES
('CO01', 'You are assigned a group project with 4 classmates for your engineering course. One member consistently misses meetings and does not contribute.', 'How do you handle this?'),
('CO02', 'Your 3-person startup team has a major disagreement about product direction. Two want mobile-first and one wants web-first.', 'How do you resolve this?'),
('CO03', 'A new team member from a different cultural background joins your Bangalore office team and seems to be struggling to fit in.', 'What do you do?'),
('CO04', 'During a college hackathon, your teammate wants to use a technology stack you are completely unfamiliar with.', 'How do you respond?'),
('CO05', 'Your startup needs to onboard a critical hire but the person has very different working styles from the existing team.', 'How do you manage this?'),
('CO06', 'Two senior colleagues are in a conflict that is splitting the team into factions. Your manager is avoiding the situation.', 'What do you do?'),
('CO07', 'You are leading a cross-departmental college committee for an annual tech symposium. Different departments have conflicting priorities and schedules.', 'How do you manage?'),
('CO08', 'Your startup remote team across Bangalore, Delhi, and a US timezone is struggling with communication gaps and duplicate work.', 'How do you fix this?'),
('CO09', 'You strongly disagree with a decision your team has made through consensus. You believe it will lead to project failure.', 'How do you handle this?'),
('CO10', 'Your study group for GATE preparation has members with vastly different skill levels. The weaker members are slowing down the group.', 'What is your approach?'),
('CO11', 'Your startup co-founder wants to hire only people they already know. You believe the team needs diverse perspectives and skills.', 'How do you address this?'),
('CO12', 'You receive credit for a successful project but know that a quiet team member did most of the critical technical work.', 'What do you do?'),
('CO13', 'Your startup is merging with another small company. The two teams have very different cultures — one is formal and one is casual.', 'How do you handle the cultural integration?'),
('CO14', 'Your globally distributed team has members in India, UK, and US. Important decisions keep getting made in meetings that not everyone can attend due to timezone differences.', 'How do you solve this?'),
('CO15', 'Your college project team of 6 has fractured into 2 groups with opposing ideas. The submission deadline is in 3 weeks and no work is getting done.', 'How do you bring the team together?')
) AS v(code, scenario, prompt) JOIN questions q ON q.code = v.code;

-- CO Hindi variants
INSERT INTO question_variants (question_id, locale, scenario, prompt)
SELECT q.id, 'hi', v.scenario, v.prompt FROM (VALUES
('CO01', 'इंजीनियरिंग कोर्स के ग्रुप प्रोजेक्ट में 4 सहपाठी हैं। एक सदस्य लगातार मीटिंग्स मिस करता है और योगदान नहीं देता।', 'आप इसे कैसे संभालेंगे?'),
('CO02', '3 लोगों की स्टार्टअप टीम में प्रोडक्ट दिशा पर बड़ा मतभेद है। दो मोबाइल-फर्स्ट चाहते हैं, एक वेब-फर्स्ट।', 'आप इसे कैसे सुलझाएंगे?'),
('CO03', 'बैंगलोर ऑफिस टीम में अलग सांस्कृतिक पृष्ठभूमि का नया सदस्य शामिल होता है और उसे घुलने-मिलने में दिक्कत हो रही है।', 'आप क्या करेंगे?'),
('CO04', 'कॉलेज हैकाथॉन में टीममेट ऐसी टेक्नोलॉजी स्टैक इस्तेमाल करना चाहता है जिसके बारे में आपको बिल्कुल जानकारी नहीं।', 'आप कैसे जवाब देंगे?'),
('CO05', 'स्टार्टअप में एक ज़रूरी हायर को ऑनबोर्ड करना है लेकिन उसकी कार्यशैली मौजूदा टीम से बहुत अलग है।', 'आप इसे कैसे मैनेज करेंगे?'),
('CO06', 'दो सीनियर सहकर्मियों का विवाद टीम को गुटों में बांट रहा है। मैनेजर स्थिति से बच रहा है।', 'आप क्या करेंगे?'),
('CO07', 'वार्षिक टेक सिम्पोज़ियम के लिए क्रॉस-डिपार्टमेंट कॉलेज कमेटी का नेतृत्व कर रहे हैं। विभिन्न विभागों की प्राथमिकताएं और शेड्यूल टकरा रहे हैं।', 'आप कैसे मैनेज करेंगे?'),
('CO08', 'बैंगलोर, दिल्ली और US टाइमज़ोन में फैली रिमोट टीम में संचार अंतराल और डुप्लीकेट काम हो रहा है।', 'आप इसे कैसे ठीक करेंगे?'),
('CO09', 'टीम ने सहमति से जो फैसला लिया उससे आप सख्त असहमत हैं। आपको लगता है यह प्रोजेक्ट को फेल कर देगा।', 'आप इसे कैसे संभालेंगे?'),
('CO10', 'GATE तैयारी के स्टडी ग्रुप में सदस्यों के स्किल लेवल बहुत अलग-अलग हैं। कमज़ोर सदस्य ग्रुप को धीमा कर रहे हैं।', 'आपका दृष्टिकोण क्या है?'),
('CO11', 'स्टार्टअप को-फाउंडर केवल परिचित लोगों को हायर करना चाहता है। आपको लगता है टीम में विविध दृष्टिकोण और स्किल्स चाहिए।', 'आप इसे कैसे सुलझाएंगे?'),
('CO12', 'सफल प्रोजेक्ट का क्रेडिट आपको मिलता है लेकिन आप जानते हैं कि एक शांत टीम मेंबर ने ज़्यादातर महत्वपूर्ण टेक्निकल काम किया।', 'आप क्या करेंगे?'),
('CO13', 'स्टार्टअप का दूसरी छोटी कंपनी से विलय हो रहा है। दोनों टीमों की संस्कृतियां बहुत अलग हैं — एक औपचारिक, एक अनौपचारिक।', 'सांस्कृतिक एकीकरण कैसे करेंगे?'),
('CO14', 'भारत, UK और US में फैली टीम में टाइमज़ोन अंतर की वजह से सभी मीटिंग्स में शामिल नहीं हो पाते और महत्वपूर्ण फैसले बिना सबके हो जाते हैं।', 'आप इसे कैसे हल करेंगे?'),
('CO15', 'कॉलेज प्रोजेक्ट टीम के 6 सदस्य विरोधी विचारों वाले 2 गुटों में बंट गए हैं। सबमिशन 3 हफ्ते में है और काम नहीं हो रहा।', 'आप टीम को कैसे जोड़ेंगे?')
) AS v(code, scenario, prompt) JOIN questions q ON q.code = v.code;

-- CO Options (English)
INSERT INTO question_options (question_id, "position", locale, text, weights)
SELECT q.id, v.pos, 'en', v.text, v.weights::jsonb FROM (VALUES
('CO01',1,'Do their share of the work yourself to avoid conflict','{"collaboration":1.5,"grit_perseverance":2.5}'),
('CO01',2,'Have an honest conversation with them about expectations, understand their constraints, and redistribute tasks fairly','{"collaboration":5.0,"eq_self_regulation":4.0,"integrity":3.5}'),
('CO01',3,'Report them to the professor immediately','{"collaboration":1.5,"integrity":2.5}'),
('CO01',4,'Exclude them from the group and do the project with remaining members','{"collaboration":1.0,"action_orientation":2.5}'),
('CO02',1,'The majority should win — go with mobile-first since 2 people want it','{"collaboration":2.0,"strategic_thinking":1.5}'),
('CO02',2,'Facilitate a structured discussion where each side presents data-backed arguments, then decide based on customer evidence','{"collaboration":5.0,"strategic_thinking":4.5,"integrity":3.5}'),
('CO02',3,'As the founder you should just decide','{"collaboration":1.0,"self_efficacy":3.0}'),
('CO02',4,'Avoid the conflict and let it resolve itself','{"collaboration":0.5,"action_orientation":0.5}'),
('CO03',1,'It is their responsibility to adapt — we should not change for one person','{"collaboration":0.5,"eq_self_regulation":1.0}'),
('CO03',2,'Proactively include them in team activities, be a buddy during onboarding, and create space for diverse perspectives','{"collaboration":5.0,"eq_self_regulation":4.0,"proactivity":4.0}'),
('CO03',3,'Let HR handle the integration','{"collaboration":1.5,"proactivity":0.5}'),
('CO03',4,'Be polite but do not go out of your way to help','{"collaboration":2.0}'),
('CO04',1,'Insist on using the stack you already know','{"collaboration":1.0,"growth_mindset":0.5}'),
('CO04',2,'Be open to learning — ask them to give a quick tutorial and divide tasks so you learn while contributing','{"collaboration":5.0,"growth_mindset":4.5,"proactivity":3.5}'),
('CO04',3,'Agree but secretly work on a familiar technology','{"collaboration":0.5,"integrity":0.5}'),
('CO04',4,'Suggest dropping out and finding a different teammate','{"collaboration":0.5}'),
('CO05',1,'Ask the person to conform to existing team norms','{"collaboration":1.5,"eq_self_regulation":1.0}'),
('CO05',2,'Create a team charter together, find common ground, and establish flexible working norms that accommodate different styles','{"collaboration":5.0,"strategic_thinking":4.0,"eq_self_regulation":4.0}'),
('CO05',3,'Let the new person work independently and just check in for deliverables','{"collaboration":2.0,"action_orientation":2.5}'),
('CO05',4,'Hire someone who fits the culture better instead','{"collaboration":1.0,"strategic_thinking":2.0}'),
('CO06',1,'Pick a side based on who you agree with','{"collaboration":0.5,"integrity":1.0}'),
('CO06',2,'Bring the two colleagues together, facilitate a conversation focused on shared goals, and escalate to management if needed','{"collaboration":5.0,"eq_self_regulation":4.5,"proactivity":4.0}'),
('CO06',3,'Avoid both of them and stay neutral','{"collaboration":1.5,"eq_self_regulation":2.0}'),
('CO06',4,'Gossip about the situation with other team members','{"collaboration":0.5,"integrity":0.5}'),
('CO07',1,'Push your own department priorities since you are the head','{"collaboration":0.5,"integrity":1.0}'),
('CO07',2,'Hold a joint planning meeting, find common dates, create a shared document with all constraints, and negotiate compromises','{"collaboration":5.0,"strategic_thinking":4.5,"proactivity":4.0}'),
('CO07',3,'Ask the college administration to resolve scheduling conflicts','{"collaboration":2.0,"proactivity":1.5}'),
('CO07',4,'Tell departments that cannot fit the schedule to drop out','{"collaboration":1.0}'),
('CO08',1,'Force everyone to work in Indian Standard Time','{"collaboration":0.5,"eq_self_regulation":0.5}'),
('CO08',2,'Implement async communication tools, establish overlap hours, create clear documentation practices, and set up a rotating meeting schedule','{"collaboration":5.0,"strategic_thinking":4.5,"innovativeness":4.0}'),
('CO08',3,'Hire everyone in the same timezone going forward','{"collaboration":2.0,"strategic_thinking":2.5}'),
('CO08',4,'Send more emails to keep everyone informed','{"collaboration":2.0}'),
('CO09',1,'Accept the consensus silently and watch the project fail','{"collaboration":2.0,"integrity":1.5}'),
('CO09',2,'Respectfully voice your concerns with specific data, propose an alternative or a small test, and commit to the team decision once heard','{"collaboration":5.0,"integrity":4.5,"strategic_thinking":4.0}'),
('CO09',3,'Go behind the team and implement your own approach','{"collaboration":0.5,"integrity":0.5}'),
('CO09',4,'Disengage from the project emotionally','{"collaboration":0.5,"eq_self_regulation":1.0}'),
('CO10',1,'Leave the group and join a more advanced one','{"collaboration":0.5,"growth_mindset":1.0}'),
('CO10',2,'Create a structured study plan where stronger members teach weaker areas and everyone contributes their strengths','{"collaboration":5.0,"growth_mindset":4.0,"proactivity":4.0}'),
('CO10',3,'Tell weaker members to study on their own and come prepared','{"collaboration":1.5,"eq_self_regulation":1.5}'),
('CO10',4,'Reduce group study time and focus on individual preparation','{"collaboration":1.0}'),
('CO11',1,'Let the co-founder hire who they want — team harmony matters','{"collaboration":2.0,"strategic_thinking":1.5}'),
('CO11',2,'Present research on how diverse teams perform better, create a structured hiring process with clear criteria, and compromise on the approach','{"collaboration":5.0,"strategic_thinking":4.5,"integrity":4.0}'),
('CO11',3,'Hire your own candidates without consulting the co-founder','{"collaboration":0.5,"integrity":1.0}'),
('CO11',4,'Accept the current approach and plan to address diversity later','{"collaboration":2.5,"strategic_thinking":2.0}'),
('CO12',1,'Enjoy the recognition — you managed the project after all','{"collaboration":1.0,"integrity":1.0}'),
('CO12',2,'Publicly redirect credit to the team member, highlight their contribution to leadership, and ensure they are recognized','{"collaboration":5.0,"integrity":5.0,"eq_self_regulation":4.0}'),
('CO12',3,'Thank the team member privately but accept the public credit','{"collaboration":2.0,"integrity":2.0}'),
('CO12',4,'Share credit with the entire team generically','{"collaboration":3.0,"integrity":3.0}'),
('CO13',1,'Force the acquired team to adopt your culture','{"collaboration":0.5}'),
('CO13',2,'Co-create new shared values with input from both teams, run integration workshops, and preserve the best elements of each culture','{"collaboration":5.0,"strategic_thinking":4.5,"eq_self_regulation":4.0}'),
('CO13',3,'Let both teams keep their separate cultures','{"collaboration":2.0,"strategic_thinking":1.5}'),
('CO13',4,'Hire an external consultant to handle the merger culture','{"collaboration":2.5,"strategic_thinking":3.0}'),
('CO14',1,'Accept that some people will miss decisions — it is unavoidable with global teams','{"collaboration":1.5}'),
('CO14',2,'Establish a decision-making framework with async input windows, rotating meeting times, and documented decisions with comment periods','{"collaboration":5.0,"strategic_thinking":5.0,"innovativeness":4.0}'),
('CO14',3,'Record all meetings and send them to absent members','{"collaboration":3.0,"action_orientation":2.5}'),
('CO14',4,'Make all important decisions via email thread','{"collaboration":2.5}'),
('CO15',1,'Take over as the sole leader and force a single direction','{"collaboration":1.0,"self_efficacy":3.0}'),
('CO15',2,'Call an all-hands meeting, let each group present their idea with evidence, find common ground, and merge the best elements','{"collaboration":5.0,"eq_self_regulation":4.0,"strategic_thinking":4.5}'),
('CO15',3,'Report the deadlock to the professor and ask for intervention','{"collaboration":2.0,"proactivity":2.0}'),
('CO15',4,'Split into two separate project submissions','{"collaboration":1.0,"strategic_thinking":1.5}')
) AS v(code, pos, text, weights) JOIN questions q ON q.code = v.code;

-- ═══════════════════════════════════════════════════════════
-- DIMENSION 9: SELF-EFFICACY (15 questions)
-- ═══════════════════════════════════════════════════════════

INSERT INTO questions (code, dimension_id, scenario_type, difficulty, is_active) VALUES
('SE01', (SELECT id FROM dimensions WHERE code='self_efficacy'), 'COLLEGE', 1, true),
('SE02', (SELECT id FROM dimensions WHERE code='self_efficacy'), 'STARTUP', 1, true),
('SE03', (SELECT id FROM dimensions WHERE code='self_efficacy'), 'WORK', 2, true),
('SE04', (SELECT id FROM dimensions WHERE code='self_efficacy'), 'COLLEGE', 2, true),
('SE05', (SELECT id FROM dimensions WHERE code='self_efficacy'), 'STARTUP', 2, true),
('SE06', (SELECT id FROM dimensions WHERE code='self_efficacy'), 'WORK', 2, true),
('SE07', (SELECT id FROM dimensions WHERE code='self_efficacy'), 'COLLEGE', 3, true),
('SE08', (SELECT id FROM dimensions WHERE code='self_efficacy'), 'STARTUP', 3, true),
('SE09', (SELECT id FROM dimensions WHERE code='self_efficacy'), 'WORK', 3, true),
('SE10', (SELECT id FROM dimensions WHERE code='self_efficacy'), 'COLLEGE', 3, true),
('SE11', (SELECT id FROM dimensions WHERE code='self_efficacy'), 'STARTUP', 3, true),
('SE12', (SELECT id FROM dimensions WHERE code='self_efficacy'), 'WORK', 3, true),
('SE13', (SELECT id FROM dimensions WHERE code='self_efficacy'), 'STARTUP', 4, true),
('SE14', (SELECT id FROM dimensions WHERE code='self_efficacy'), 'WORK', 4, true),
('SE15', (SELECT id FROM dimensions WHERE code='self_efficacy'), 'COLLEGE', 5, true);

-- SE English variants
INSERT INTO question_variants (question_id, locale, scenario, prompt)
SELECT q.id, 'en', v.scenario, v.prompt FROM (VALUES
('SE01', 'You are selected to represent your college at a national debate competition but you have never participated in a debate before.', 'How do you feel and what do you do?'),
('SE02', 'You are a solo founder with no technical background and need to build an MVP for your edtech startup idea.', 'How do you approach this?'),
('SE03', 'Your company asks you to present the quarterly results to the board of directors. You have never presented to senior leadership before.', 'What is your response?'),
('SE04', 'You are the only student from a small-town college at an IIT-organized coding competition where everyone else seems highly experienced.', 'How do you feel?'),
('SE05', 'An influential industry leader offers to meet you but says she only has 10 minutes and wants to hear your startup pitch.', 'How do you prepare?'),
('SE06', 'You are assigned to lead a team of 8 people for the first time. Some team members are older and more experienced than you.', 'How do you approach this?'),
('SE07', 'You want to start a student startup but everyone tells you that you are too young and inexperienced to run a business.', 'How do you respond?'),
('SE08', 'Your startup is invited to pitch at a major conference alongside well-funded companies with polished products.', 'How do you prepare?'),
('SE09', 'You are asked to take over a failing project from a senior engineer who could not fix it.', 'What is your mindset?'),
('SE10', 'You want to apply for a prestigious scholarship that requires a research proposal. You have never written one before.', 'What do you do?'),
('SE11', 'Your startup needs to negotiate a partnership with a company 100 times your size. They have an army of lawyers and negotiators.', 'How do you approach the negotiation?'),
('SE12', 'You are the youngest person in a senior leadership meeting and are asked for your opinion on a critical business decision.', 'How do you respond?'),
('SE13', 'After raising your first round of funding, you realize the milestones you promised investors seem nearly impossible to achieve in the timeline.', 'How do you handle this?'),
('SE14', 'You are offered a role that requires skills you have at about 60 percent of the level needed. The hiring manager believes you can grow into it.', 'What do you decide?'),
('SE15', 'You are asked to give the keynote speech at your college annual function in front of 2000 people including parents and dignitaries. You have severe stage fright.', 'How do you handle this?')
) AS v(code, scenario, prompt) JOIN questions q ON q.code = v.code;

-- SE Hindi variants
INSERT INTO question_variants (question_id, locale, scenario, prompt)
SELECT q.id, 'hi', v.scenario, v.prompt FROM (VALUES
('SE01', 'राष्ट्रीय डिबेट प्रतियोगिता में कॉलेज का प्रतिनिधित्व करने के लिए चुने गए हैं लेकिन पहले कभी डिबेट में भाग नहीं लिया।', 'आप कैसा महसूस करते हैं और क्या करेंगे?'),
('SE02', 'बिना टेक्निकल बैकग्राउंड के सोलो फाउंडर हैं और एडटेक स्टार्टअप आइडिया के लिए MVP बनाना है।', 'आप कैसे आगे बढ़ेंगे?'),
('SE03', 'कंपनी बोर्ड ऑफ डायरेक्टर्स के सामने तिमाही नतीजे प्रस्तुत करने को कहती है। सीनियर लीडरशिप के सामने पहले कभी प्रेजेंट नहीं किया।', 'आपकी प्रतिक्रिया क्या है?'),
('SE04', 'IIT द्वारा आयोजित कोडिंग प्रतियोगिता में छोटे शहर के कॉलेज से अकेले हैं जबकि बाकी सब बहुत अनुभवी लगते हैं।', 'आप कैसा महसूस करते हैं?'),
('SE05', 'एक प्रभावशाली इंडस्ट्री लीडर मिलने को तैयार है लेकिन सिर्फ 10 मिनट हैं और आपकी स्टार्टअप पिच सुनना चाहती हैं।', 'आप कैसे तैयारी करेंगे?'),
('SE06', 'पहली बार 8 लोगों की टीम लीड करने को मिली है। कुछ सदस्य आपसे उम्र और अनुभव में बड़े हैं।', 'आप कैसे आगे बढ़ेंगे?'),
('SE07', 'स्टूडेंट स्टार्टअप शुरू करना चाहते हैं लेकिन सब कहते हैं कि बिज़नेस चलाने के लिए बहुत छोटे और अनुभवहीन हो।', 'आप कैसे जवाब देंगे?'),
('SE08', 'स्टार्टअप को बड़ी कॉन्फ्रेंस में अच्छी-खासी फंडेड कंपनियों के साथ पिच करने का न्योता मिला।', 'आप कैसे तैयारी करेंगे?'),
('SE09', 'एक सीनियर इंजीनियर जो ठीक नहीं कर पाया उस फेलिंग प्रोजेक्ट को संभालने को कहा गया है।', 'आपकी मानसिकता क्या है?'),
('SE10', 'प्रतिष्ठित स्कॉलरशिप के लिए अप्लाई करना चाहते हैं जिसमें रिसर्च प्रपोजल चाहिए। पहले कभी नहीं लिखा।', 'आप क्या करेंगे?'),
('SE11', 'स्टार्टअप को अपने से 100 गुना बड़ी कंपनी के साथ पार्टनरशिप नेगोशिएट करनी है। उनके पास वकीलों की फौज है।', 'आप नेगोशिएशन कैसे करेंगे?'),
('SE12', 'सीनियर लीडरशिप मीटिंग में सबसे कम उम्र के हैं और एक गंभीर बिज़नेस फैसले पर आपकी राय पूछी जाती है।', 'आप कैसे जवाब देंगे?'),
('SE13', 'पहला फंडिंग राउंड मिलने के बाद समझ आता है कि निवेशकों को दिए वादे तय समय में लगभग असंभव हैं।', 'आप इसे कैसे संभालेंगे?'),
('SE14', 'एक रोल ऑफर हुआ जिसमें ज़रूरी स्किल्स का करीब 60 प्रतिशत ही आपके पास है। हायरिंग मैनेजर को यकीन है कि आप सीख लेंगे।', 'आप क्या फैसला करेंगे?'),
('SE15', '2000 लोगों के सामने जिसमें माता-पिता और गणमान्य व्यक्ति शामिल हैं, कॉलेज वार्षिक समारोह में मुख्य भाषण देना है। आपको गंभीर स्टेज फ्राइट है।', 'आप इसे कैसे संभालेंगे?')
) AS v(code, scenario, prompt) JOIN questions q ON q.code = v.code;

-- SE Options (English)
INSERT INTO question_options (question_id, "position", locale, text, weights)
SELECT q.id, v.pos, 'en', v.text, v.weights::jsonb FROM (VALUES
('SE01',1,'Decline — I will embarrass myself without experience','{"self_efficacy":0.5,"risk_tolerance":0.5}'),
('SE01',2,'Accept the challenge, research debate techniques, practice daily, and find a mentor who has debated before','{"self_efficacy":5.0,"growth_mindset":4.5,"action_orientation":4.0}'),
('SE01',3,'Accept but hope the competition gets cancelled','{"self_efficacy":1.0}'),
('SE01',4,'Accept only if a more experienced student agrees to coach me','{"self_efficacy":2.5,"collaboration":3.5}'),
('SE02',1,'Give up the idea — I need a technical co-founder first','{"self_efficacy":1.0,"action_orientation":0.5}'),
('SE02',2,'Start learning no-code tools, build a basic prototype myself, and validate the idea with real users before hiring engineers','{"self_efficacy":5.0,"action_orientation":4.5,"growth_mindset":4.0,"innovativeness":3.5}'),
('SE02',3,'Outsource the entire development to an agency','{"self_efficacy":1.5,"strategic_thinking":2.5}'),
('SE02',4,'Wait until I find a technical co-founder','{"self_efficacy":1.0,"grit_perseverance":1.0}'),
('SE03',1,'Ask someone else to do the presentation','{"self_efficacy":0.5,"proactivity":0.5}'),
('SE03',2,'Prepare thoroughly, rehearse multiple times, seek feedback from experienced presenters, and deliver with confidence','{"self_efficacy":5.0,"proactivity":4.0,"grit_perseverance":4.0}'),
('SE03',3,'Agree but ask to present only a small section','{"self_efficacy":2.0,"strategic_thinking":2.0}'),
('SE03',4,'Do it but read directly from slides to avoid mistakes','{"self_efficacy":1.5}'),
('SE04',1,'Feel intimidated and consider withdrawing','{"self_efficacy":0.5,"grit_perseverance":0.5}'),
('SE04',2,'Focus on my own preparation, compete to learn rather than win, and use it as a benchmark to improve','{"self_efficacy":4.5,"growth_mindset":4.5,"grit_perseverance":4.0}'),
('SE04',3,'Assume I will lose and just attend for the experience','{"self_efficacy":2.0,"growth_mindset":2.5}'),
('SE04',4,'Compare myself negatively to others and feel out of place','{"self_efficacy":0.5,"eq_self_regulation":0.5}'),
('SE05',1,'Panic about the 10-minute limit and cancel the meeting','{"self_efficacy":0.5,"action_orientation":0.5}'),
('SE05',2,'Craft a crisp 7-minute pitch, practice until it is flawless, prepare for tough questions, and go in with confidence','{"self_efficacy":5.0,"strategic_thinking":4.5,"action_orientation":4.5}'),
('SE05',3,'Wing it — 10 minutes is not enough to prepare for','{"self_efficacy":2.0,"risk_tolerance":2.5}'),
('SE05',4,'Ask if the meeting can be rescheduled for a longer slot','{"self_efficacy":1.5,"proactivity":2.0}'),
('SE06',1,'Feel anxious about leading people older than me and doubt my ability','{"self_efficacy":0.5,"eq_self_regulation":1.0}'),
('SE06',2,'Lead with humility, leverage each team member strengths, be transparent about learning together, and earn respect through competence','{"self_efficacy":5.0,"collaboration":4.5,"eq_self_regulation":4.0}'),
('SE06',3,'Try to establish authority immediately by being strict','{"self_efficacy":2.0,"collaboration":0.5}'),
('SE06',4,'Treat it as a title only and avoid making difficult decisions','{"self_efficacy":1.0,"action_orientation":0.5}'),
('SE07',1,'Believe what everyone says and wait until I am older','{"self_efficacy":0.5,"action_orientation":0.5}'),
('SE07',2,'Start small, prove the concept, let results speak for themselves, and use youth as an advantage for energy and fresh perspective','{"self_efficacy":5.0,"proactivity":4.5,"innovativeness":4.0,"grit_perseverance":3.5}'),
('SE07',3,'Get discouraged and focus only on academics','{"self_efficacy":0.5,"grit_perseverance":0.5}'),
('SE07',4,'Wait for someone to validate my idea before starting','{"self_efficacy":1.5}'),
('SE08',1,'Consider declining — our product is not ready for such a stage','{"self_efficacy":1.0,"risk_tolerance":0.5}'),
('SE08',2,'Focus on our unique story, practice relentlessly, highlight what we do differently, and own our scrappy stage with authenticity','{"self_efficacy":5.0,"strategic_thinking":4.0,"grit_perseverance":4.0,"integrity":3.5}'),
('SE08',3,'Try to make the product look more polished than it is','{"self_efficacy":2.0,"integrity":1.0}'),
('SE08',4,'Ask to present last so fewer people see our pitch','{"self_efficacy":1.0,"strategic_thinking":1.5}'),
('SE09',1,'Feel overwhelmed — if a senior could not fix it how can I','{"self_efficacy":0.5,"growth_mindset":0.5}'),
('SE09',2,'See it as an opportunity to prove myself, approach the problem with fresh eyes, and systematically diagnose what went wrong','{"self_efficacy":5.0,"growth_mindset":4.0,"strategic_thinking":4.0,"action_orientation":4.0}'),
('SE09',3,'Accept but set low expectations with management','{"self_efficacy":2.0,"strategic_thinking":2.5}'),
('SE09',4,'Ask the senior engineer what they tried so I can avoid making the same mistakes','{"self_efficacy":3.0,"collaboration":3.5}'),
('SE10',1,'Do not apply — I have never written a research proposal so I will fail','{"self_efficacy":0.5}'),
('SE10',2,'Study successful proposals, seek guidance from professors, draft my own, get feedback, and submit a polished version','{"self_efficacy":5.0,"proactivity":4.5,"growth_mindset":4.0}'),
('SE10',3,'Apply with whatever I can write without much preparation','{"self_efficacy":2.0,"action_orientation":2.0}'),
('SE10',4,'Ask a professor to write the proposal for me','{"self_efficacy":1.0,"integrity":1.5}'),
('SE11',1,'We are too small — they will take advantage of us','{"self_efficacy":0.5,"strategic_thinking":1.0}'),
('SE11',2,'Research their business thoroughly, identify what unique value we bring, prepare our positions clearly, and negotiate from a place of confidence in our strengths','{"self_efficacy":5.0,"strategic_thinking":5.0,"proactivity":4.0}'),
('SE11',3,'Agree to whatever terms they offer just to get the partnership','{"self_efficacy":0.5,"strategic_thinking":0.5}'),
('SE11',4,'Hire an expensive lawyer to negotiate on our behalf','{"self_efficacy":2.0,"strategic_thinking":3.0}'),
('SE12',1,'Defer to the more experienced people in the room','{"self_efficacy":1.0,"collaboration":2.0}'),
('SE12',2,'Share your perspective confidently with supporting data, acknowledging that you bring a different viewpoint that could be valuable','{"self_efficacy":5.0,"integrity":4.0,"proactivity":4.0}'),
('SE12',3,'Give a vague answer to avoid being wrong','{"self_efficacy":1.0}'),
('SE12',4,'Say what you think the leaders want to hear','{"self_efficacy":0.5,"integrity":0.5}'),
('SE13',1,'Panic and consider returning the money','{"self_efficacy":0.5,"eq_self_regulation":0.5}'),
('SE13',2,'Reassess priorities ruthlessly, create a revised realistic plan, proactively communicate with investors about adjusted milestones, and execute with urgency','{"self_efficacy":5.0,"strategic_thinking":4.5,"integrity":4.5,"action_orientation":4.0}'),
('SE13',3,'Pretend everything is on track and hope for the best','{"self_efficacy":1.0,"integrity":0.5}'),
('SE13',4,'Blame external factors for the slow progress','{"self_efficacy":1.0,"integrity":1.0}'),
('SE14',1,'Decline — I will fail without full competency','{"self_efficacy":0.5,"risk_tolerance":0.5}'),
('SE14',2,'Accept with a clear learning plan, negotiate a 90-day ramp-up period, and proactively close skill gaps','{"self_efficacy":5.0,"growth_mindset":4.5,"risk_tolerance":4.0,"action_orientation":4.0}'),
('SE14',3,'Accept but worry constantly about being found out','{"self_efficacy":1.5,"eq_self_regulation":1.0}'),
('SE14',4,'Negotiate a lower title until I prove myself','{"self_efficacy":2.5,"strategic_thinking":2.5}'),
('SE15',1,'Decline the invitation due to stage fright','{"self_efficacy":0.5,"action_orientation":0.5}'),
('SE15',2,'Accept, work with a speaking coach, practice extensively in front of smaller groups, and use techniques to manage anxiety','{"self_efficacy":5.0,"grit_perseverance":4.5,"growth_mindset":4.0,"physical_mental_vitality":3.5}'),
('SE15',3,'Accept but read the entire speech from paper','{"self_efficacy":2.0}'),
('SE15',4,'Ask if I can do a pre-recorded video instead','{"self_efficacy":1.5,"innovativeness":2.0}')
) AS v(code, pos, text, weights) JOIN questions q ON q.code = v.code;

-- ═══════════════════════════════════════════════════════════
-- DIMENSION 10: INNOVATIVENESS (15 questions)
-- ═══════════════════════════════════════════════════════════

INSERT INTO questions (code, dimension_id, scenario_type, difficulty, is_active) VALUES
('IV01', (SELECT id FROM dimensions WHERE code='innovativeness'), 'COLLEGE', 1, true),
('IV02', (SELECT id FROM dimensions WHERE code='innovativeness'), 'STARTUP', 1, true),
('IV03', (SELECT id FROM dimensions WHERE code='innovativeness'), 'WORK', 2, true),
('IV04', (SELECT id FROM dimensions WHERE code='innovativeness'), 'COLLEGE', 2, true),
('IV05', (SELECT id FROM dimensions WHERE code='innovativeness'), 'STARTUP', 2, true),
('IV06', (SELECT id FROM dimensions WHERE code='innovativeness'), 'WORK', 2, true),
('IV07', (SELECT id FROM dimensions WHERE code='innovativeness'), 'COLLEGE', 3, true),
('IV08', (SELECT id FROM dimensions WHERE code='innovativeness'), 'STARTUP', 3, true),
('IV09', (SELECT id FROM dimensions WHERE code='innovativeness'), 'WORK', 3, true),
('IV10', (SELECT id FROM dimensions WHERE code='innovativeness'), 'COLLEGE', 3, true),
('IV11', (SELECT id FROM dimensions WHERE code='innovativeness'), 'STARTUP', 3, true),
('IV12', (SELECT id FROM dimensions WHERE code='innovativeness'), 'WORK', 3, true),
('IV13', (SELECT id FROM dimensions WHERE code='innovativeness'), 'STARTUP', 4, true),
('IV14', (SELECT id FROM dimensions WHERE code='innovativeness'), 'WORK', 4, true),
('IV15', (SELECT id FROM dimensions WHERE code='innovativeness'), 'STARTUP', 5, true);

-- IV English variants
INSERT INTO question_variants (question_id, locale, scenario, prompt)
SELECT q.id, 'en', v.scenario, v.prompt FROM (VALUES
('IV01', 'Your college assignment asks you to create a project using standard templates that everyone else is also using.', 'How do you approach this?'),
('IV02', 'You are building a fintech product for small shopkeepers in Tier-2 cities who are not comfortable with English-language apps.', 'How do you design the solution?'),
('IV03', 'Your team has been doing a manual reporting process that takes 3 hours every week for the past 2 years.', 'What do you suggest?'),
('IV04', 'Your professor assigns a research topic that has been extensively studied with no new angles apparent.', 'How do you approach it?'),
('IV05', 'Your startup is entering a market with 20 established competitors all offering similar features.', 'How do you differentiate?'),
('IV06', 'Your company customer support team is overwhelmed with repetitive queries that take up 70 percent of their time.', 'What solution do you propose?'),
('IV07', 'Your college canteen has a massive queue problem during lunch hour that frustrates students daily.', 'What innovative solution would you suggest?'),
('IV08', 'Your startup has built a SaaS tool but customer acquisition cost is too high for direct sales.', 'What creative distribution strategy would you try?'),
('IV09', 'Your company is losing customers to a competitor with an inferior product but better marketing.', 'What is your innovative response?'),
('IV10', 'Your college fest committee has a limited budget but wants to create an experience that goes viral on social media.', 'What do you propose?'),
('IV11', 'Your food delivery startup is struggling with last-mile delivery costs in dense Bangalore traffic.', 'What innovative solutions do you explore?'),
('IV12', 'Your company training program has low engagement — employees find it boring and irrelevant.', 'How do you redesign it?'),
('IV13', 'Your healthtech startup needs to reach rural patients who have feature phones and limited internet. Traditional app-based solutions will not work.', 'What do you build?'),
('IV14', 'Your company wants to reduce the office electricity bill by 40 percent without compromising employee comfort.', 'What innovative solutions do you propose?'),
('IV15', 'Your agricultural startup needs to help farmers predict crop disease but they do not have smartphones or internet in remote areas of Maharashtra.', 'How do you design a solution?')
) AS v(code, scenario, prompt) JOIN questions q ON q.code = v.code;

-- IV Hindi variants
INSERT INTO question_variants (question_id, locale, scenario, prompt)
SELECT q.id, 'hi', v.scenario, v.prompt FROM (VALUES
('IV01', 'कॉलेज असाइनमेंट में स्टैंडर्ड टेम्पलेट्स इस्तेमाल करके प्रोजेक्ट बनाना है जो सबको दिया गया है।', 'आप कैसे आगे बढ़ेंगे?'),
('IV02', 'टियर-2 शहरों के छोटे दुकानदारों के लिए फिनटेक प्रोडक्ट बना रहे हैं जो अंग्रेज़ी ऐप्स से सहज नहीं हैं।', 'आप समाधान कैसे डिज़ाइन करेंगे?'),
('IV03', 'टीम 2 साल से हर हफ्ते 3 घंटे का मैनुअल रिपोर्टिंग प्रोसेस कर रही है।', 'आपका सुझाव क्या है?'),
('IV04', 'प्रोफेसर ने ऐसा रिसर्च टॉपिक दिया है जिस पर पहले से बहुत काम हो चुका है और कोई नया कोण नहीं दिखता।', 'आप कैसे आगे बढ़ेंगे?'),
('IV05', 'स्टार्टअप ऐसे बाज़ार में प्रवेश कर रहा है जहां 20 स्थापित प्रतियोगी समान फीचर्स के साथ हैं।', 'आप कैसे अलग दिखेंगे?'),
('IV06', 'कंपनी की कस्टमर सपोर्ट टीम दोहराए जाने वाले प्रश्नों से परेशान है जो 70 प्रतिशत समय लेते हैं।', 'आप क्या समाधान प्रस्तावित करेंगे?'),
('IV07', 'कॉलेज कैंटीन में लंच आवर में भारी कतार की समस्या है जो छात्रों को रोज़ परेशान करती है।', 'कौन सा नवाचारी समाधान सुझाएंगे?'),
('IV08', 'स्टार्टअप ने SaaS टूल बनाया लेकिन डायरेक्ट सेल्स से कस्टमर एक्विज़िशन कॉस्ट बहुत ज़्यादा है।', 'कौन सी रचनात्मक वितरण रणनीति आज़माएंगे?'),
('IV09', 'कंपनी के ग्राहक एक ऐसे प्रतियोगी के पास जा रहे हैं जिसका प्रोडक्ट कमतर है लेकिन मार्केटिंग बेहतर।', 'आपकी नवाचारी प्रतिक्रिया क्या है?'),
('IV10', 'कॉलेज फेस्ट कमेटी का बजट सीमित है लेकिन सोशल मीडिया पर वायरल होने वाला अनुभव बनाना है।', 'आप क्या प्रस्तावित करेंगे?'),
('IV11', 'फूड डिलीवरी स्टार्टअप बैंगलोर ट्रैफिक में लास्ट-माइल डिलीवरी कॉस्ट से जूझ रहा है।', 'कौन से नवाचारी समाधान खोजेंगे?'),
('IV12', 'कंपनी के ट्रेनिंग प्रोग्राम में कम एंगेजमेंट है — कर्मचारी इसे उबाऊ और अप्रासंगिक पाते हैं।', 'आप इसे कैसे दोबारा डिज़ाइन करेंगे?'),
('IV13', 'हेल्थटेक स्टार्टअप को ग्रामीण मरीज़ों तक पहुंचना है जिनके पास फीचर फोन और सीमित इंटरनेट है। पारंपरिक ऐप-आधारित समाधान काम नहीं करेंगे।', 'आप क्या बनाएंगे?'),
('IV14', 'कंपनी कर्मचारियों के आराम से समझौता किए बिना ऑफिस का बिजली बिल 40 प्रतिशत कम करना चाहती है।', 'कौन से नवाचारी समाधान प्रस्तावित करेंगे?'),
('IV15', 'कृषि स्टार्टअप को महाराष्ट्र के दूरदराज़ क्षेत्रों में किसानों को फसल रोग की भविष्यवाणी में मदद करनी है लेकिन उनके पास स्मार्टफोन या इंटरनेट नहीं है।', 'आप समाधान कैसे डिज़ाइन करेंगे?')
) AS v(code, scenario, prompt) JOIN questions q ON q.code = v.code;

-- IV Options (English)
INSERT INTO question_options (question_id, "position", locale, text, weights)
SELECT q.id, v.pos, 'en', v.text, v.weights::jsonb FROM (VALUES
('IV01',1,'Use the standard template exactly as given — it is safest','{"innovativeness":0.5,"risk_tolerance":0.5}'),
('IV01',2,'Use the template as a base but add a unique twist — new data sources, creative presentation, or an unusual angle','{"innovativeness":5.0,"growth_mindset":3.5,"proactivity":3.5}'),
('IV01',3,'Ignore the template completely and do something entirely different','{"innovativeness":3.5,"risk_tolerance":4.0,"integrity":2.0}'),
('IV01',4,'Copy a senior student approach with minor modifications','{"innovativeness":1.0}'),
('IV02',1,'Build a standard English app and add Hindi translation later','{"innovativeness":1.0,"strategic_thinking":1.5}'),
('IV02',2,'Design a voice-first app in local languages with visual UX, WhatsApp integration for orders, and offline functionality','{"innovativeness":5.0,"strategic_thinking":4.5,"collaboration":3.5}'),
('IV02',3,'Train shopkeepers to use English apps','{"innovativeness":0.5}'),
('IV02',4,'Build an SMS-based system only','{"innovativeness":2.5,"strategic_thinking":3.0}'),
('IV03',1,'It works fine — do not fix what is not broken','{"innovativeness":0.5,"proactivity":0.5}'),
('IV03',2,'Build an automated dashboard that generates reports in minutes using existing data sources and schedule it to run weekly','{"innovativeness":5.0,"action_orientation":4.5,"strategic_thinking":4.0}'),
('IV03',3,'Suggest hiring an intern to do the reporting','{"innovativeness":1.0}'),
('IV03',4,'Create a better Excel template to speed it up slightly','{"innovativeness":2.0,"action_orientation":2.5}'),
('IV04',1,'Write a standard literature review and call it done','{"innovativeness":0.5}'),
('IV04',2,'Find an interdisciplinary angle, apply the topic to a new context like Indian rural conditions, or use novel data analysis methods','{"innovativeness":5.0,"strategic_thinking":4.5,"growth_mindset":4.0}'),
('IV04',3,'Ask the professor for a different topic','{"innovativeness":1.0,"proactivity":1.5}'),
('IV04',4,'Replicate an existing study with minor tweaks','{"innovativeness":1.5}'),
('IV05',1,'Compete on price — be the cheapest option','{"innovativeness":1.0,"strategic_thinking":1.5}'),
('IV05',2,'Identify an underserved micro-niche, build a radically different UX, or solve the problem in a way nobody has tried','{"innovativeness":5.0,"strategic_thinking":4.5,"risk_tolerance":4.0}'),
('IV05',3,'Copy the best features from all competitors into one product','{"innovativeness":1.0,"integrity":1.5}'),
('IV05',4,'Focus on marketing to stand out rather than product innovation','{"innovativeness":2.0,"strategic_thinking":2.5}'),
('IV06',1,'Hire more support agents to handle the volume','{"innovativeness":1.0}'),
('IV06',2,'Build an AI chatbot trained on past queries, create a smart self-service portal, and route only complex issues to humans','{"innovativeness":5.0,"strategic_thinking":4.5,"action_orientation":4.0}'),
('IV06',3,'Create a FAQ page and redirect customers there','{"innovativeness":2.0,"action_orientation":2.5}'),
('IV06',4,'Reduce support hours to manage the load','{"innovativeness":0.5,"collaboration":0.5}'),
('IV07',1,'Just open more counters during rush hour','{"innovativeness":1.0}'),
('IV07',2,'Build a pre-ordering app, implement a token system with estimated wait times, or set up staggered lunch breaks by department','{"innovativeness":5.0,"strategic_thinking":4.0,"proactivity":4.5}'),
('IV07',3,'Ask the college to extend lunch break timing','{"innovativeness":1.0,"proactivity":2.0}'),
('IV07',4,'Let students bring their own food','{"innovativeness":0.5}'),
('IV08',1,'Spend more on paid advertising','{"innovativeness":1.0,"strategic_thinking":1.5}'),
('IV08',2,'Create a freemium model, build integrations with popular tools, launch a referral program, or partner with complementary products for bundled distribution','{"innovativeness":5.0,"strategic_thinking":4.5,"collaboration":4.0}'),
('IV08',3,'Hire more salespeople','{"innovativeness":0.5}'),
('IV08',4,'Lower the price to attract more customers','{"innovativeness":1.0,"strategic_thinking":1.5}'),
('IV09',1,'Increase our advertising budget to match theirs','{"innovativeness":1.0}'),
('IV09',2,'Turn customers into advocates through exceptional experience, create viral content showing real product superiority, and build community','{"innovativeness":5.0,"strategic_thinking":4.5,"collaboration":3.5}'),
('IV09',3,'Copy their marketing strategy','{"innovativeness":0.5,"integrity":1.0}'),
('IV09',4,'Ignore the competitor and focus on product only','{"innovativeness":2.0,"strategic_thinking":1.5}'),
('IV10',1,'Do what was done last year but smaller','{"innovativeness":0.5}'),
('IV10',2,'Design interactive and shareable experiences like AR photo booths, social media challenges with prizes, or a live-streamed talent show','{"innovativeness":5.0,"strategic_thinking":4.0,"action_orientation":4.0}'),
('IV10',3,'Spend all the budget on one big celebrity performance','{"innovativeness":1.5,"risk_tolerance":3.0}'),
('IV10',4,'Cancel expensive events and focus on decoration','{"innovativeness":1.0}'),
('IV11',1,'Hire more delivery riders','{"innovativeness":0.5}'),
('IV11',2,'Explore micro-fulfillment centers in neighborhoods, bicycle delivery for short distances, batch delivery algorithms, or cloud kitchen partnerships','{"innovativeness":5.0,"strategic_thinking":4.5,"action_orientation":4.0}'),
('IV11',3,'Charge customers higher delivery fees','{"innovativeness":0.5}'),
('IV11',4,'Limit delivery radius to reduce costs','{"innovativeness":1.0,"strategic_thinking":2.5}'),
('IV12',1,'Make training mandatory and penalize non-attendance','{"innovativeness":0.5,"collaboration":0.5}'),
('IV12',2,'Gamify the learning with points and rewards, create micro-learning modules, use real company scenarios, and let employees choose their learning paths','{"innovativeness":5.0,"collaboration":4.0,"strategic_thinking":4.0}'),
('IV12',3,'Send more reminder emails about training','{"innovativeness":0.5}'),
('IV12',4,'Outsource training to an external vendor','{"innovativeness":1.5,"strategic_thinking":2.0}'),
('IV13',1,'Wait until smartphones become common in rural areas','{"innovativeness":0.5,"action_orientation":0.5}'),
('IV13',2,'Build an IVR-based health system with voice menus in local languages, SMS health tips, and integrate with ASHA workers who visit villages','{"innovativeness":5.0,"strategic_thinking":5.0,"collaboration":4.0}'),
('IV13',3,'Set up physical health camps instead of using technology','{"innovativeness":1.5,"action_orientation":3.0}'),
('IV13',4,'Build an app and distribute low-cost smartphones','{"innovativeness":2.5,"strategic_thinking":2.5}'),
('IV14',1,'Turn off air conditioning and ask people to manage','{"innovativeness":0.5,"collaboration":0.5}'),
('IV14',2,'Install smart sensors for occupancy-based lighting and cooling, use solar panels, implement green building practices, and create energy dashboards','{"innovativeness":5.0,"strategic_thinking":4.5,"action_orientation":4.0}'),
('IV14',3,'Switch to cheaper LED bulbs only','{"innovativeness":1.5,"action_orientation":2.0}'),
('IV14',4,'Ask employees to turn off lights when leaving rooms','{"innovativeness":1.0}'),
('IV15',1,'Wait for telecom companies to expand rural internet coverage','{"innovativeness":0.5,"action_orientation":0.5}'),
('IV15',2,'Create a low-tech solution using SMS alerts, community radio, trained village-level agents with tablets, and offline-capable simple devices with image-based disease detection','{"innovativeness":5.0,"strategic_thinking":5.0,"collaboration":4.5,"action_orientation":4.0}'),
('IV15',3,'Build a standard smartphone app and hope adoption grows','{"innovativeness":1.0,"strategic_thinking":1.0}'),
('IV15',4,'Partner with agricultural universities to send pamphlets','{"innovativeness":1.5,"collaboration":3.0}')
) AS v(code, pos, text, weights) JOIN questions q ON q.code = v.code;

-- ═══════════════════════════════════════════════════════════
-- DIMENSION 11: ACTION ORIENTATION (15 questions)
-- ═══════════════════════════════════════════════════════════

INSERT INTO questions (code, dimension_id, scenario_type, difficulty, is_active) VALUES
('AO01', (SELECT id FROM dimensions WHERE code='action_orientation'), 'COLLEGE', 1, true),
('AO02', (SELECT id FROM dimensions WHERE code='action_orientation'), 'STARTUP', 1, true),
('AO03', (SELECT id FROM dimensions WHERE code='action_orientation'), 'WORK', 2, true),
('AO04', (SELECT id FROM dimensions WHERE code='action_orientation'), 'COLLEGE', 2, true),
('AO05', (SELECT id FROM dimensions WHERE code='action_orientation'), 'STARTUP', 2, true),
('AO06', (SELECT id FROM dimensions WHERE code='action_orientation'), 'WORK', 2, true),
('AO07', (SELECT id FROM dimensions WHERE code='action_orientation'), 'COLLEGE', 3, true),
('AO08', (SELECT id FROM dimensions WHERE code='action_orientation'), 'STARTUP', 3, true),
('AO09', (SELECT id FROM dimensions WHERE code='action_orientation'), 'WORK', 3, true),
('AO10', (SELECT id FROM dimensions WHERE code='action_orientation'), 'STARTUP', 3, true),
('AO11', (SELECT id FROM dimensions WHERE code='action_orientation'), 'COLLEGE', 3, true),
('AO12', (SELECT id FROM dimensions WHERE code='action_orientation'), 'WORK', 3, true),
('AO13', (SELECT id FROM dimensions WHERE code='action_orientation'), 'STARTUP', 4, true),
('AO14', (SELECT id FROM dimensions WHERE code='action_orientation'), 'WORK', 4, true),
('AO15', (SELECT id FROM dimensions WHERE code='action_orientation'), 'COLLEGE', 5, true);

-- AO English variants
INSERT INTO question_variants (question_id, locale, scenario, prompt)
SELECT q.id, 'en', v.scenario, v.prompt FROM (VALUES
('AO01', 'You have an idea for a mobile app that could help college students find affordable PG accommodations in Bangalore.', 'What do you do with this idea?'),
('AO02', 'Your startup has spent 3 months planning the perfect product. Your co-founder wants another month of planning before building anything.', 'How do you respond?'),
('AO03', 'You identified a bug in production that is affecting users but your team is in the middle of a sprint with tight deadlines.', 'What do you do?'),
('AO04', 'You have been thinking about starting a college YouTube channel about exam preparation tips for 6 months but have not started.', 'What is holding you back and what do you do?'),
('AO05', 'Your startup idea needs customer validation but you have been perfecting the business plan for weeks without talking to a single potential customer.', 'What do you change?'),
('AO06', 'A new tool could save your team 5 hours per week but implementing it requires 2 days of setup that nobody has volunteered for.', 'What do you do?'),
('AO07', 'You notice that the college library does not have a digital catalog and students waste time searching for books manually.', 'What action do you take?'),
('AO08', 'Your startup MVP has 3 critical bugs and 20 nice-to-have features pending. Your first demo with a potential client is in 5 days.', 'How do you prioritize?'),
('AO09', 'A project you have been assigned has unclear requirements. You have emailed the stakeholder twice but received no reply.', 'What is your next step?'),
('AO10', 'You had a great networking conversation with a potential advisor at a Bangalore meetup 2 days ago. You have their card but have not followed up.', 'What do you do?'),
('AO11', 'Your college technical club has been planning an inter-college coding competition for 3 months. The plan is 90 percent complete but nobody has started execution.', 'What do you do?'),
('AO12', 'Your company has identified a market opportunity that requires quick execution but the decision-making committee meets only once a month.', 'How do you handle this?'),
('AO13', 'Your startup has been in stealth mode for 8 months. The product is 80 percent done. Your team wants to wait until it is 100 percent before launching.', 'What is your position?'),
('AO14', 'You have been asked to lead a digital transformation project. After 2 months of assessment, you have a comprehensive plan but no implementation has started.', 'What do you do?'),
('AO15', 'Your final year capstone project idea is ambitious — an AI-powered waste segregation system. You have 4 months, a team of 4, and zero AI experience.', 'How do you start?')
) AS v(code, scenario, prompt) JOIN questions q ON q.code = v.code;

-- AO Hindi variants
INSERT INTO question_variants (question_id, locale, scenario, prompt)
SELECT q.id, 'hi', v.scenario, v.prompt FROM (VALUES
('AO01', 'बैंगलोर में कॉलेज छात्रों को किफायती PG खोजने में मदद करने वाले मोबाइल ऐप का आइडिया है।', 'आप इस आइडिया के साथ क्या करेंगे?'),
('AO02', 'स्टार्टअप 3 महीने से परफेक्ट प्रोडक्ट प्लानिंग कर रहा है। को-फाउंडर कुछ बनाने से पहले एक महीने और प्लानिंग चाहता है।', 'आप कैसे जवाब देंगे?'),
('AO03', 'प्रोडक्शन में एक बग मिला जो यूज़र्स को प्रभावित कर रहा है लेकिन टीम टाइट डेडलाइन वाले स्प्रिंट के बीच में है।', 'आप क्या करेंगे?'),
('AO04', 'परीक्षा तैयारी टिप्स पर कॉलेज YouTube चैनल शुरू करने के बारे में 6 महीने से सोच रहे हैं लेकिन शुरू नहीं किया।', 'क्या रोक रहा है और क्या करेंगे?'),
('AO05', 'स्टार्टअप आइडिया को कस्टमर वैलिडेशन चाहिए लेकिन हफ्तों से बिज़नेस प्लान को परफेक्ट कर रहे हैं बिना किसी संभावित ग्राहक से बात किए।', 'आप क्या बदलेंगे?'),
('AO06', 'नया टूल टीम को हफ्ते में 5 घंटे बचा सकता है लेकिन 2 दिन का सेटअप चाहिए जिसके लिए किसी ने वॉलंटियर नहीं किया।', 'आप क्या करेंगे?'),
('AO07', 'कॉलेज लाइब्रेरी में डिजिटल कैटलॉग नहीं है और छात्र मैनुअल सर्च में समय बर्बाद करते हैं।', 'आप क्या कदम उठाएंगे?'),
('AO08', 'स्टार्टअप MVP में 3 गंभीर बग और 20 नाइस-टू-हैव फीचर्स पेंडिंग हैं। संभावित क्लाइंट के साथ पहला डेमो 5 दिन में है।', 'प्राथमिकता कैसे तय करेंगे?'),
('AO09', 'असाइन प्रोजेक्ट की रिक्वायरमेंट्स अस्पष्ट हैं। स्टेकहोल्डर को 2 बार ईमेल किया लेकिन कोई जवाब नहीं आया।', 'आपका अगला कदम क्या है?'),
('AO10', 'बैंगलोर मीटअप में 2 दिन पहले संभावित एडवाइज़र से अच्छी बातचीत हुई। कार्ड है लेकिन फॉलो-अप नहीं किया।', 'आप क्या करेंगे?'),
('AO11', 'कॉलेज टेक्निकल क्लब 3 महीने से इंटर-कॉलेज कोडिंग प्रतियोगिता की योजना बना रहा है। प्लान 90 प्रतिशत तैयार है लेकिन एक्ज़ीक्यूशन शुरू नहीं हुई।', 'आप क्या करेंगे?'),
('AO12', 'कंपनी ने तेज़ एक्ज़ीक्यूशन वाला मार्केट अवसर पहचाना है लेकिन निर्णय समिति महीने में एक बार मिलती है।', 'आप इसे कैसे संभालेंगे?'),
('AO13', 'स्टार्टअप 8 महीने से स्टेल्थ मोड में है। प्रोडक्ट 80 प्रतिशत तैयार है। टीम 100 प्रतिशत होने तक लॉन्च का इंतज़ार करना चाहती है।', 'आपकी स्थिति क्या है?'),
('AO14', 'डिजिटल ट्रांसफॉर्मेशन प्रोजेक्ट लीड करने को कहा गया। 2 महीने के आकलन के बाद व्यापक योजना है लेकिन इम्प्लीमेंटेशन शुरू नहीं हुई।', 'आप क्या करेंगे?'),
('AO15', 'फाइनल ईयर कैपस्टोन प्रोजेक्ट महत्वाकांक्षी है — AI-पावर्ड वेस्ट सेग्रिगेशन सिस्टम। 4 महीने, 4 लोगों की टीम, और AI का शून्य अनुभव।', 'कैसे शुरू करेंगे?')
) AS v(code, scenario, prompt) JOIN questions q ON q.code = v.code;

-- AO Options (English)
INSERT INTO question_options (question_id, "position", locale, text, weights)
SELECT q.id, v.pos, 'en', v.text, v.weights::jsonb FROM (VALUES
('AO01',1,'Think about it more and maybe act on it someday','{"action_orientation":0.5,"proactivity":0.5}'),
('AO01',2,'This weekend, talk to 10 PG-searching students, validate demand, and build a simple landing page to test interest','{"action_orientation":5.0,"proactivity":4.5,"strategic_thinking":4.0}'),
('AO01',3,'Write a detailed business plan first before doing anything','{"action_orientation":1.5,"strategic_thinking":3.0}'),
('AO01',4,'Tell friends about the idea and see if they want to build it','{"action_orientation":2.0,"collaboration":2.5}'),
('AO02',1,'Agree with the co-founder — planning prevents mistakes','{"action_orientation":0.5,"strategic_thinking":2.5}'),
('AO02',2,'Argue that we should build an MVP this week, test it with 5 real users, and iterate based on feedback rather than assumptions','{"action_orientation":5.0,"strategic_thinking":4.5,"innovativeness":3.5}'),
('AO02',3,'Wait for the co-founder to feel ready','{"action_orientation":0.5,"collaboration":2.0}'),
('AO02',4,'Start building secretly on your own','{"action_orientation":3.5,"collaboration":0.5}'),
('AO03',1,'Log the bug and address it in the next sprint','{"action_orientation":2.0,"strategic_thinking":2.5}'),
('AO03',2,'Fix the critical bug immediately — user impact takes priority, then negotiate scope adjustment for the current sprint','{"action_orientation":5.0,"strategic_thinking":4.0,"integrity":4.0}'),
('AO03',3,'Escalate to the manager and wait for direction','{"action_orientation":1.5,"proactivity":1.5}'),
('AO03',4,'Ignore it if it only affects a small number of users','{"action_orientation":0.5,"integrity":0.5}'),
('AO04',1,'Wait until I have professional equipment and a perfect plan','{"action_orientation":0.5}'),
('AO04',2,'Record the first video today on my phone, upload it tonight, and improve quality as I go','{"action_orientation":5.0,"self_efficacy":4.5,"growth_mindset":4.0}'),
('AO04',3,'Continue researching what makes successful YouTube channels','{"action_orientation":1.0,"strategic_thinking":2.0}'),
('AO04',4,'Wait for exam season when there is more demand','{"action_orientation":1.0}'),
('AO05',1,'Finish the business plan — it needs to be perfect before talking to customers','{"action_orientation":0.5,"strategic_thinking":1.5}'),
('AO05',2,'Stop planning today, list 20 potential customers, and start calling or visiting them this week for feedback','{"action_orientation":5.0,"proactivity":4.5,"strategic_thinking":4.0}'),
('AO05',3,'Send out a survey online and wait for responses','{"action_orientation":2.0,"proactivity":2.0}'),
('AO05',4,'Post about the idea on social media and see if anyone is interested','{"action_orientation":2.5,"proactivity":2.5}'),
('AO06',1,'Wait for management to assign someone','{"action_orientation":0.5,"proactivity":0.5}'),
('AO06',2,'Block 2 days on your calendar this week, set up the tool yourself, and train the team','{"action_orientation":5.0,"proactivity":4.5,"collaboration":4.0}'),
('AO06',3,'Send an email suggesting someone should do it','{"action_orientation":1.5,"proactivity":1.5}'),
('AO06',4,'Wait until the sprint has more slack time','{"action_orientation":1.0}'),
('AO07',1,'Wait for the library committee to build one','{"action_orientation":0.5}'),
('AO07',2,'This weekend build a simple spreadsheet-based catalog, digitize the most popular sections first, and get student volunteers to help','{"action_orientation":5.0,"proactivity":4.5,"innovativeness":4.0,"collaboration":3.5}'),
('AO07',3,'Write a suggestion to the dean about it','{"action_orientation":2.0,"proactivity":2.5}'),
('AO07',4,'Discuss the idea in the student council meeting','{"action_orientation":2.0,"collaboration":2.5}'),
('AO08',1,'Try to fix all bugs and add all features in 5 days','{"action_orientation":2.0,"strategic_thinking":0.5}'),
('AO08',2,'Fix the 3 critical bugs today, identify the 2 most impressive existing features, polish the demo flow, and practice the presentation','{"action_orientation":5.0,"strategic_thinking":5.0,"proactivity":4.0}'),
('AO08',3,'Ask to postpone the demo until the product is perfect','{"action_orientation":1.0}'),
('AO08',4,'Prepare slides to cover the bugs during the demo','{"action_orientation":2.5,"strategic_thinking":2.0}'),
('AO09',1,'Wait for the email reply — they will respond eventually','{"action_orientation":0.5}'),
('AO09',2,'Walk to their desk or call them directly today, get the key requirements verbally, and start building based on what you know','{"action_orientation":5.0,"proactivity":4.5,"collaboration":3.5}'),
('AO09',3,'Escalate to your manager about the non-responsive stakeholder','{"action_orientation":2.5,"proactivity":2.5}'),
('AO09',4,'Start working based on assumptions and hope for the best','{"action_orientation":3.0,"strategic_thinking":1.5}'),
('AO10',1,'Wait for them to reach out to me','{"action_orientation":0.5,"self_efficacy":0.5}'),
('AO10',2,'Send a personalized follow-up message today referencing our conversation and suggest a specific next step','{"action_orientation":5.0,"proactivity":4.5,"self_efficacy":4.0}'),
('AO10',3,'Add them on LinkedIn and hope they accept','{"action_orientation":2.0}'),
('AO10',4,'Plan to follow up next week when I have more time','{"action_orientation":1.5}'),
('AO11',1,'Continue refining the plan until it is perfect','{"action_orientation":0.5}'),
('AO11',2,'Call an emergency meeting today, assign specific tasks with deadlines, book venues, and start registration immediately','{"action_orientation":5.0,"proactivity":4.5,"collaboration":4.0,"strategic_thinking":3.5}'),
('AO11',3,'Ask the faculty advisor to push the team into action','{"action_orientation":1.5,"proactivity":1.5}'),
('AO11',4,'Suggest postponing to next semester for better planning','{"action_orientation":0.5}'),
('AO12',1,'Wait for the committee to meet and present the opportunity','{"action_orientation":0.5}'),
('AO12',2,'Prepare a one-page business case, get informal buy-in from key decision makers via 1-on-1s, and request an emergency meeting','{"action_orientation":5.0,"strategic_thinking":4.5,"proactivity":4.5}'),
('AO12',3,'Send an email to the committee about the urgency','{"action_orientation":2.0}'),
('AO12',4,'Start executing on your own and ask for forgiveness later','{"action_orientation":4.0,"risk_tolerance":4.0,"collaboration":1.0}'),
('AO13',1,'Agree with the team — launch only when 100 percent ready','{"action_orientation":0.5,"grit_perseverance":2.0}'),
('AO13',2,'Launch the 80 percent version now to real users, get feedback, and iterate rapidly. Perfect is the enemy of done.','{"action_orientation":5.0,"strategic_thinking":4.5,"risk_tolerance":4.0,"innovativeness":3.5}'),
('AO13',3,'Set a fixed launch date 2 weeks from now as a compromise','{"action_orientation":3.0,"collaboration":3.0}'),
('AO13',4,'Launch a private beta first with select users','{"action_orientation":3.5,"strategic_thinking":3.5}'),
('AO14',1,'Present the plan to leadership and wait for their approval to start','{"action_orientation":1.5,"strategic_thinking":2.0}'),
('AO14',2,'Identify one quick-win initiative from the plan, start it this week to show early results, and use momentum to drive the larger transformation','{"action_orientation":5.0,"strategic_thinking":5.0,"proactivity":4.5}'),
('AO14',3,'Hire external consultants to begin the implementation','{"action_orientation":2.5,"strategic_thinking":2.5}'),
('AO14',4,'Send the plan to all stakeholders for review and comments','{"action_orientation":1.5}'),
('AO15',1,'This is too ambitious — switch to a simpler project topic','{"action_orientation":0.5,"self_efficacy":0.5}'),
('AO15',2,'Split the project into weekly milestones, start Week 1 with dataset collection and basic image classification tutorials, and build incrementally','{"action_orientation":5.0,"strategic_thinking":4.5,"grit_perseverance":4.5,"growth_mindset":4.0}'),
('AO15',3,'Spend the first month learning AI theory before doing anything practical','{"action_orientation":1.5,"growth_mindset":2.5}'),
('AO15',4,'Find an existing AI model online and adapt it instead of building from scratch','{"action_orientation":3.5,"strategic_thinking":3.5}')
) AS v(code, pos, text, weights) JOIN questions q ON q.code = v.code;

-- ═══════════════════════════════════════════════════════════
-- DIMENSION 12: PHYSICAL & MENTAL VITALITY (15 questions)
-- ═══════════════════════════════════════════════════════════

INSERT INTO questions (code, dimension_id, scenario_type, difficulty, is_active) VALUES
('PV01', (SELECT id FROM dimensions WHERE code='physical_mental_vitality'), 'COLLEGE', 1, true),
('PV02', (SELECT id FROM dimensions WHERE code='physical_mental_vitality'), 'STARTUP', 1, true),
('PV03', (SELECT id FROM dimensions WHERE code='physical_mental_vitality'), 'WORK', 2, true),
('PV04', (SELECT id FROM dimensions WHERE code='physical_mental_vitality'), 'COLLEGE', 2, true),
('PV05', (SELECT id FROM dimensions WHERE code='physical_mental_vitality'), 'STARTUP', 2, true),
('PV06', (SELECT id FROM dimensions WHERE code='physical_mental_vitality'), 'WORK', 2, true),
('PV07', (SELECT id FROM dimensions WHERE code='physical_mental_vitality'), 'COLLEGE', 3, true),
('PV08', (SELECT id FROM dimensions WHERE code='physical_mental_vitality'), 'STARTUP', 3, true),
('PV09', (SELECT id FROM dimensions WHERE code='physical_mental_vitality'), 'WORK', 3, true),
('PV10', (SELECT id FROM dimensions WHERE code='physical_mental_vitality'), 'STARTUP', 3, true),
('PV11', (SELECT id FROM dimensions WHERE code='physical_mental_vitality'), 'COLLEGE', 3, true),
('PV12', (SELECT id FROM dimensions WHERE code='physical_mental_vitality'), 'WORK', 3, true),
('PV13', (SELECT id FROM dimensions WHERE code='physical_mental_vitality'), 'STARTUP', 4, true),
('PV14', (SELECT id FROM dimensions WHERE code='physical_mental_vitality'), 'WORK', 4, true),
('PV15', (SELECT id FROM dimensions WHERE code='physical_mental_vitality'), 'COLLEGE', 5, true);

-- PV English variants
INSERT INTO question_variants (question_id, locale, scenario, prompt)
SELECT q.id, 'en', v.scenario, v.prompt FROM (VALUES
('PV01', 'During exam season, you have been studying 14 hours a day for a week. You are exhausted, your back hurts, and you cannot concentrate.', 'What do you do?'),
('PV02', 'Your startup is going through a critical phase and you have been working 16-hour days for 3 months. You are constantly tired and irritable.', 'How do you handle this?'),
('PV03', 'Your company just started a quarterly crunch period. Your manager expects everyone to work weekends for the next month.', 'How do you respond?'),
('PV04', 'You have JEE Advanced coaching from 6 AM to 8 AM, college classes until 4 PM, and self-study until midnight. You barely sleep 5 hours.', 'How do you manage your energy?'),
('PV05', 'Your startup team celebrates success by ordering late-night biryani and pulling all-nighters. This culture of hustle is causing health issues.', 'What do you do?'),
('PV06', 'You notice that your afternoon productivity at work drops significantly every day. You feel sluggish and unfocused after lunch.', 'How do you address this?'),
('PV07', 'You are a college athlete on the cricket team but your academics are suffering because practice takes 3 hours daily.', 'How do you balance both?'),
('PV08', 'A co-founder is showing signs of burnout — missing meetings, making mistakes, and becoming withdrawn.', 'How do you address this?'),
('PV09', 'You feel anxious every Sunday evening about the upcoming work week. This has been happening for months.', 'What do you do about it?'),
('PV10', 'Your startup launched successfully but you have gained 10 kgs in 6 months due to stress eating and no exercise.', 'How do you course-correct?'),
('PV11', 'Your hostel friends mock you for going to bed early and exercising in the morning instead of staying up late socializing.', 'How do you handle the peer pressure?'),
('PV12', 'Your company offers no mental health benefits and the culture discourages taking breaks. You are feeling burned out.', 'What is your approach?'),
('PV13', 'Your startup is at a critical juncture — investor demo in 2 weeks. You are already sleep-deprived and getting sick. Pushing harder could mean either success or collapse.', 'What do you decide?'),
('PV14', 'You are leading a team through a major delivery. Three team members have already taken sick leave from overwork. The deadline cannot move.', 'How do you handle this?'),
('PV15', 'You are preparing for UPSC prelims while dealing with severe anxiety and insomnia. Doctors say you need rest but the exam is in 2 months.', 'How do you approach this?')
) AS v(code, scenario, prompt) JOIN questions q ON q.code = v.code;

-- PV Hindi variants
INSERT INTO question_variants (question_id, locale, scenario, prompt)
SELECT q.id, 'hi', v.scenario, v.prompt FROM (VALUES
('PV01', 'परीक्षा सीज़न में एक हफ्ते से रोज़ 14 घंटे पढ़ रहे हैं। थके हुए हैं, पीठ दर्द है, और ध्यान नहीं लग रहा।', 'आप क्या करेंगे?'),
('PV02', 'स्टार्टअप गंभीर दौर से गुज़र रहा है और 3 महीने से रोज़ 16 घंटे काम कर रहे हैं। लगातार थकान और चिड़चिड़ापन है।', 'आप इसे कैसे संभालेंगे?'),
('PV03', 'कंपनी में तिमाही क्रंच पीरियड शुरू हुआ है। मैनेजर अगले महीने सबसे वीकेंड पर काम की उम्मीद करता है।', 'आप कैसे जवाब देंगे?'),
('PV04', 'सुबह 6 से 8 बजे JEE एडवांस्ड कोचिंग, 4 बजे तक कॉलेज, और आधी रात तक सेल्फ-स्टडी। बमुश्किल 5 घंटे नींद।', 'अपनी ऊर्जा कैसे मैनेज करेंगे?'),
('PV05', 'स्टार्टअप टीम सफलता का जश्न देर रात बिरयानी और ऑल-नाइटर्स से मनाती है। इस हसल कल्चर से सेहत खराब हो रही है।', 'आप क्या करेंगे?'),
('PV06', 'ऑफिस में दोपहर के बाद हर दिन प्रोडक्टिविटी गिर जाती है। लंच के बाद सुस्ती और फोकस में कमी।', 'आप इसे कैसे हल करेंगे?'),
('PV07', 'कॉलेज क्रिकेट टीम में हैं लेकिन रोज़ 3 घंटे प्रैक्टिस से पढ़ाई प्रभावित हो रही है।', 'दोनों में संतुलन कैसे बनाएंगे?'),
('PV08', 'को-फाउंडर बर्नआउट के लक्षण दिखा रहा है — मीटिंग्स मिस, गलतियां, और अकेला रहना।', 'आप इसे कैसे संबोधित करेंगे?'),
('PV09', 'हर रविवार शाम आने वाले वर्क वीक को लेकर चिंता होती है। यह महीनों से चल रहा है।', 'आप इसके बारे में क्या करेंगे?'),
('PV10', 'स्टार्टअप सफलतापूर्वक लॉन्च हुआ लेकिन तनाव से खाने और व्यायाम न करने से 6 महीने में 10 किलो वज़न बढ़ गया।', 'कैसे सुधारेंगे?'),
('PV11', 'हॉस्टल के दोस्त जल्दी सोने और सुबह एक्सरसाइज़ करने का मज़ाक उड़ाते हैं क्योंकि वो देर रात सोशलाइज़ करते हैं।', 'पीयर प्रेशर कैसे संभालेंगे?'),
('PV12', 'कंपनी कोई मानसिक स्वास्थ्य लाभ नहीं देती और संस्कृति ब्रेक लेने से हतोत्साहित करती है। आप बर्नआउट महसूस कर रहे हैं।', 'आपका दृष्टिकोण क्या है?'),
('PV13', 'स्टार्टअप महत्वपूर्ण मोड़ पर है — 2 हफ्ते में निवेशक डेमो। पहले से नींद की कमी है और बीमार पड़ रहे हैं। ज़ोर लगाने का मतलब सफलता या गिरना हो सकता है।', 'आप क्या फैसला करेंगे?'),
('PV14', 'एक बड़ी डिलीवरी में टीम लीड कर रहे हैं। 3 टीम मेंबर ओवरवर्क से बीमार हो गए। डेडलाइन नहीं बढ़ सकती।', 'आप इसे कैसे संभालेंगे?'),
('PV15', 'UPSC प्रारंभिक की तैयारी कर रहे हैं लेकिन गंभीर चिंता और अनिद्रा से जूझ रहे हैं। डॉक्टर आराम कहते हैं लेकिन परीक्षा 2 महीने में है।', 'आप कैसे आगे बढ़ेंगे?')
) AS v(code, scenario, prompt) JOIN questions q ON q.code = v.code;

-- PV Options (English)
INSERT INTO question_options (question_id, "position", locale, text, weights)
SELECT q.id, v.pos, 'en', v.text, v.weights::jsonb FROM (VALUES
('PV01',1,'Push through — exams are more important than comfort','{"physical_mental_vitality":0.5,"grit_perseverance":2.5}'),
('PV01',2,'Take a structured break — walk for 30 minutes, sleep 7 hours tonight, and study in focused 90-minute blocks tomorrow','{"physical_mental_vitality":5.0,"strategic_thinking":4.0,"self_efficacy":3.5}'),
('PV01',3,'Take the entire day off and binge-watch shows','{"physical_mental_vitality":2.0,"grit_perseverance":0.5}'),
('PV01',4,'Drink more coffee and continue studying','{"physical_mental_vitality":0.5,"action_orientation":1.5}'),
('PV02',1,'This is startup life — hustle until we make it','{"physical_mental_vitality":0.5,"grit_perseverance":2.5}'),
('PV02',2,'Implement sustainable work rhythms — set core hours, take weekends off, exercise daily, and lead by example for the team','{"physical_mental_vitality":5.0,"strategic_thinking":4.5,"collaboration":4.0}'),
('PV02',3,'Take a vacation and hand everything to the co-founder','{"physical_mental_vitality":2.5,"collaboration":1.5}'),
('PV02',4,'Work the same hours but try to sleep more','{"physical_mental_vitality":2.0}'),
('PV03',1,'Agree to work all weekends without question','{"physical_mental_vitality":0.5,"collaboration":2.0}'),
('PV03',2,'Negotiate a sustainable schedule — offer high productivity during weekdays, protect at least one weekend day, and propose rotating weekend coverage','{"physical_mental_vitality":5.0,"strategic_thinking":4.0,"collaboration":4.0,"integrity":3.5}'),
('PV03',3,'Refuse all weekend work regardless of deadlines','{"physical_mental_vitality":3.0,"collaboration":0.5}'),
('PV03',4,'Work weekends but resent the company silently','{"physical_mental_vitality":1.0,"eq_self_regulation":1.0}'),
('PV04',1,'This schedule is necessary for success — I will sleep after the exam','{"physical_mental_vitality":0.5,"grit_perseverance":2.5}'),
('PV04',2,'Restructure the schedule to guarantee 7 hours of sleep, use active learning techniques to study efficiently, and include exercise','{"physical_mental_vitality":5.0,"strategic_thinking":4.5,"self_efficacy":3.5}'),
('PV04',3,'Drop coaching and prepare on my own to get more sleep','{"physical_mental_vitality":3.0,"strategic_thinking":2.0}'),
('PV04',4,'Take energy supplements to keep up with the schedule','{"physical_mental_vitality":0.5}'),
('PV05',1,'Go along with it — team bonding is important','{"physical_mental_vitality":0.5,"collaboration":2.5}'),
('PV05',2,'Propose healthier celebration alternatives, set reasonable work hours, and model balanced behavior as a leader','{"physical_mental_vitality":5.0,"collaboration":4.0,"integrity":4.0,"strategic_thinking":3.5}'),
('PV05',3,'Stop attending celebrations and isolate yourself','{"physical_mental_vitality":2.5,"collaboration":0.5}'),
('PV05',4,'Celebrate only on weekends when recovery is possible','{"physical_mental_vitality":3.0,"strategic_thinking":3.0}'),
('PV06',1,'Just push through the afternoon slump with willpower','{"physical_mental_vitality":1.0}'),
('PV06',2,'Optimize lunch choices for energy, take a 15-minute walk after lunch, schedule creative work in the morning and routine tasks in the afternoon','{"physical_mental_vitality":5.0,"strategic_thinking":4.0,"proactivity":3.5}'),
('PV06',3,'Drink energy drinks to stay alert','{"physical_mental_vitality":0.5}'),
('PV06',4,'Skip lunch to avoid the slump','{"physical_mental_vitality":1.0}'),
('PV07',1,'Quit the cricket team to focus on academics','{"physical_mental_vitality":2.0,"grit_perseverance":1.5}'),
('PV07',2,'Create a structured weekly schedule that allocates specific blocks for academics and practice, using weekends to catch up on studies','{"physical_mental_vitality":4.5,"strategic_thinking":4.5,"grit_perseverance":4.0}'),
('PV07',3,'Reduce study time and hope to pass with minimum grades','{"physical_mental_vitality":2.5,"integrity":1.0}'),
('PV07',4,'Try to study during team breaks and travel time','{"physical_mental_vitality":2.0,"action_orientation":2.5}'),
('PV08',1,'Ignore it — it is their personal problem','{"physical_mental_vitality":0.5,"collaboration":0.5}'),
('PV08',2,'Have a caring private conversation, offer to take on some of their workload temporarily, and encourage them to take a break','{"physical_mental_vitality":5.0,"collaboration":5.0,"eq_self_regulation":4.0}'),
('PV08',3,'Tell them to toughen up — startups are hard','{"physical_mental_vitality":0.5,"collaboration":0.5}'),
('PV08',4,'Suggest they leave the startup if they cannot handle it','{"physical_mental_vitality":1.0,"collaboration":0.5}'),
('PV09',1,'It is normal — everyone hates Mondays','{"physical_mental_vitality":1.0,"eq_self_regulation":1.0}'),
('PV09',2,'Recognize this as a sign something needs to change — identify the root cause, talk to a counselor, and take proactive steps to improve work-life balance','{"physical_mental_vitality":5.0,"eq_self_regulation":4.5,"proactivity":4.0}'),
('PV09',3,'Ignore it and hope it goes away','{"physical_mental_vitality":0.5}'),
('PV09',4,'Start job hunting immediately as the only solution','{"physical_mental_vitality":2.0,"action_orientation":2.5}'),
('PV10',1,'I will deal with health later — the startup needs me now','{"physical_mental_vitality":0.5}'),
('PV10',2,'Start a sustainable daily routine — 30 minutes of exercise, healthier meals, and set boundaries around work hours to prevent further decline','{"physical_mental_vitality":5.0,"self_efficacy":4.0,"strategic_thinking":3.5}'),
('PV10',3,'Go on a crash diet to lose weight quickly','{"physical_mental_vitality":1.5}'),
('PV10',4,'Hire someone to handle part of your work so you have time for health','{"physical_mental_vitality":3.0,"strategic_thinking":3.0}'),
('PV11',1,'Give in and stay up late with them to fit in','{"physical_mental_vitality":0.5,"self_efficacy":0.5}'),
('PV11',2,'Stick to my routine confidently, explain that this is what works for me, and invite friends to join morning exercise occasionally','{"physical_mental_vitality":5.0,"self_efficacy":4.5,"eq_self_regulation":4.0}'),
('PV11',3,'Avoid hostel friends and become isolated','{"physical_mental_vitality":2.5,"collaboration":0.5}'),
('PV11',4,'Change my routine to match theirs to avoid conflict','{"physical_mental_vitality":0.5,"collaboration":2.5}'),
('PV12',1,'Keep working and tough it out — everyone else seems fine','{"physical_mental_vitality":0.5}'),
('PV12',2,'Advocate for mental health resources, set personal boundaries around work hours, use PTO strategically, and seek external support','{"physical_mental_vitality":5.0,"proactivity":4.5,"integrity":4.0,"self_efficacy":4.0}'),
('PV12',3,'Quit the company immediately','{"physical_mental_vitality":2.5,"strategic_thinking":1.5}'),
('PV12',4,'Complain about the culture but change nothing','{"physical_mental_vitality":1.0,"proactivity":0.5}'),
('PV13',1,'Sleep is for after the demo — push through no matter what','{"physical_mental_vitality":0.5,"grit_perseverance":3.0}'),
('PV13',2,'Get 7 hours of sleep, delegate ruthlessly, focus only on the demo-critical path, and communicate honestly with the team about sustainable pace','{"physical_mental_vitality":5.0,"strategic_thinking":5.0,"collaboration":4.0,"integrity":4.0}'),
('PV13',3,'Postpone the demo to recover first','{"physical_mental_vitality":3.5,"strategic_thinking":2.0}'),
('PV13',4,'Work hard but take frequent coffee breaks','{"physical_mental_vitality":1.5}'),
('PV14',1,'Push the remaining team harder to compensate','{"physical_mental_vitality":0.5,"collaboration":0.5}'),
('PV14',2,'Re-scope the deliverables, bring in temporary help, enforce reasonable hours for the remaining team, and communicate risk to stakeholders','{"physical_mental_vitality":5.0,"strategic_thinking":4.5,"collaboration":4.5,"integrity":4.0}'),
('PV14',3,'Work harder yourself to make up for the sick team members','{"physical_mental_vitality":1.0,"grit_perseverance":3.0}'),
('PV14',4,'Tell stakeholders the deadline will slip and accept the consequences','{"physical_mental_vitality":3.0,"integrity":3.5}'),
('PV15',1,'Push through the anxiety with sheer willpower and study harder','{"physical_mental_vitality":0.5,"grit_perseverance":2.0}'),
('PV15',2,'Follow the doctor advice on sleep, integrate meditation and exercise into study routine, adjust study plan to be realistic, and seek therapy for anxiety','{"physical_mental_vitality":5.0,"strategic_thinking":4.5,"eq_self_regulation":4.5,"self_efficacy":4.0}'),
('PV15',3,'Skip this exam attempt and try next year when healthier','{"physical_mental_vitality":3.5,"grit_perseverance":1.0}'),
('PV15',4,'Self-medicate with sleeping pills to manage the insomnia','{"physical_mental_vitality":0.5}')
) AS v(code, pos, text, weights) JOIN questions q ON q.code = v.code;
