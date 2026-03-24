-- AEDHAS AI Collaboration Challenge Seed Data
-- Run in Supabase SQL Editor after schema.sql

-- ─── COMPUTER SCIENCE CHALLENGES ─────────────────────────────

INSERT INTO ai_challenges (code, domain, difficulty, target_role, title, description_en, description_hi, starter_context, expected_output_criteria, time_limit_minutes) VALUES
('CS_AI_L1', 'computer_science', 1, 'STUDENT',
  'Email Validator Function',
  'Build a function that validates email addresses. It should check for proper format (user@domain.tld), handle edge cases like missing @ symbol, consecutive dots, and return clear error messages for each invalid case.',
  'एक फ़ंक्शन बनाएं जो ईमेल पतों को मान्य करे। इसे सही प्रारूप (user@domain.tld) की जांच करनी चाहिए, लापता @ चिह्न, लगातार बिंदु जैसे किनारे के मामलों को संभालना चाहिए, और प्रत्येक अमान्य मामले के लिए स्पष्ट त्रुटि संदेश लौटाना चाहिए।',
  'Language: JavaScript/TypeScript. Use regex or string parsing. Must handle: valid emails, missing @, double dots, spaces, missing TLD.',
  '["handles valid emails correctly", "rejects missing @ symbol", "rejects consecutive dots", "returns specific error messages", "clean function structure"]'::jsonb,
  15),

('CS_AI_L2', 'computer_science', 2, 'STUDENT',
  'REST API for Todo List',
  'Create a REST API for a todo list application. Implement CRUD endpoints (GET all, GET by id, POST create, PUT update, DELETE). Include input validation, proper HTTP status codes, and error handling. Use an in-memory array as the data store.',
  'टोडो सूची एप्लिकेशन के लिए एक REST API बनाएं। CRUD एंडपॉइंट्स (GET सभी, GET आईडी से, POST बनाएं, PUT अपडेट, DELETE) लागू करें। इनपुट सत्यापन, उचित HTTP स्थिति कोड और त्रुटि हैंडलिंग शामिल करें।',
  'Use Express.js or similar. In-memory storage (array). Todos have: id, title, completed, createdAt.',
  '["all CRUD endpoints work", "proper HTTP status codes", "input validation present", "error handling for missing todos", "clean code structure"]'::jsonb,
  20),

('CS_AI_L3', 'computer_science', 3, 'STUDENT',
  'Debug Authentication Flow',
  'You are given a broken authentication system. The login endpoint sometimes returns 200 even with wrong passwords, the JWT token generation has a timing vulnerability, and the middleware fails to check token expiry. Find and fix all three bugs.',
  'आपको एक खराब प्रमाणीकरण प्रणाली दी गई है। लॉगिन एंडपॉइंट कभी-कभी गलत पासवर्ड के साथ भी 200 लौटाता है, JWT टोकन जनरेशन में एक टाइमिंग भेद्यता है, और मिडलवेयर टोकन समाप्ति की जांच करने में विफल रहता है। तीनों बग ढूंढें और ठीक करें।',
  E'// Bug 1: Password comparison\nasync function login(email, password) {\n  const user = await db.findUser(email);\n  if (password == user.passwordHash) { // HINT: wrong comparison\n    return generateToken(user);\n  }\n}\n\n// Bug 2: Token generation\nfunction generateToken(user) {\n  return jwt.sign({ id: user.id }, SECRET); // HINT: missing expiry\n}\n\n// Bug 3: Auth middleware\nfunction authMiddleware(req, res, next) {\n  const token = req.headers.authorization;\n  const decoded = jwt.verify(token, SECRET);\n  req.user = decoded; // HINT: no error handling\n  next();\n}',
  '["identifies password comparison bug", "fixes JWT expiry issue", "adds proper error handling to middleware", "explains security implications", "suggests additional security measures"]'::jsonb,
  30),

('CS_AI_L4', 'computer_science', 4, 'STUDENT',
  'Design a Caching Layer',
  'Design and implement a caching layer for a high-traffic REST API. Support TTL-based expiration, LRU eviction when cache is full, cache invalidation on writes, and a cache-aside pattern. The cache should work with any data source.',
  'उच्च-ट्रैफ़िक REST API के लिए एक कैशिंग लेयर डिज़ाइन और कार्यान्वित करें। TTL-आधारित समाप्ति, कैश भरने पर LRU निष्कासन, लिखने पर कैश अमान्यकरण, और कैश-असाइड पैटर्न का समर्थन करें।',
  'Implement in TypeScript. Must support: get(key), set(key, value, ttl), delete(key), clear(). LRU eviction when maxSize exceeded.',
  '["LRU eviction works correctly", "TTL expiration implemented", "cache-aside pattern used", "write-through invalidation", "generic interface works with any data source", "thread-safe considerations discussed"]'::jsonb,
  40),

('CS_AI_L5', 'computer_science', 5, 'EXPERIENCED',
  'Real-time Notification Architecture',
  'Architect a real-time notification system that supports: WebSocket connections for live updates, a fan-out mechanism for broadcasting to thousands of users, message persistence and retry logic, priority queues for urgent notifications, and horizontal scaling considerations.',
  'एक रियल-टाइम नोटिफिकेशन सिस्टम आर्किटेक्ट करें जो समर्थन करे: लाइव अपडेट के लिए WebSocket कनेक्शन, हजारों उपयोगकर्ताओं को ब्रॉडकास्ट करने के लिए फैन-आउट मैकेनिज्म, संदेश स्थायित्व और पुनः प्रयास तर्क, तत्काल सूचनाओं के लिए प्राथमिकता कतारें, और क्षैतिज स्केलिंग विचार।',
  'Design the system architecture. Consider: WebSocket server, message queue (Redis/Kafka), database for persistence, connection manager. Provide code for critical components.',
  '["WebSocket connection management", "fan-out mechanism designed", "message persistence and retry", "priority queue implementation", "horizontal scaling strategy", "failure handling considered", "code for critical paths provided"]'::jsonb,
  45),

-- ─── COMMERCE CHALLENGES ─────────────────────────────────────

('COM_AI_L1', 'commerce_accounting', 1, 'STUDENT',
  'Profit/Loss Calculator',
  'Build a profit and loss calculator that takes revenue, cost of goods sold, operating expenses, and taxes as inputs. Calculate gross profit, operating profit, and net profit. Display results in a clear format with percentages.',
  'एक लाभ और हानि कैलकुलेटर बनाएं जो राजस्व, बिकी गई वस्तुओं की लागत, परिचालन व्यय और करों को इनपुट के रूप में ले। सकल लाभ, परिचालन लाभ और शुद्ध लाभ की गणना करें। प्रतिशत के साथ परिणाम स्पष्ट प्रारूप में प्रदर्शित करें।',
  'Use any language. Inputs: revenue, COGS, opex, tax_rate. Outputs: gross_profit, gross_margin%, operating_profit, operating_margin%, net_profit, net_margin%.',
  '["correct calculation formulas", "handles edge cases (zero revenue)", "clear output formatting", "percentage calculations accurate", "input validation"]'::jsonb,
  15),

('COM_AI_L3', 'commerce_accounting', 3, 'STUDENT',
  'GST Tax Calculation Engine',
  'Build a GST calculation engine for Indian businesses. Support CGST+SGST (intra-state) and IGST (inter-state) calculations. Handle multiple tax slabs (0%, 5%, 12%, 18%, 28%), input tax credit calculations, and generate a tax summary report.',
  'भारतीय व्यवसायों के लिए एक GST गणना इंजन बनाएं। CGST+SGST (राज्य के भीतर) और IGST (अंतर-राज्य) गणना का समर्थन करें। कई कर स्लैब (0%, 5%, 12%, 18%, 28%), इनपुट टैक्स क्रेडिट गणना को संभालें, और कर सारांश रिपोर्ट तैयार करें।',
  'Implement in Python or JavaScript. Must handle: intra-state vs inter-state, multiple tax slabs, ITC calculation, HSN code mapping.',
  '["correct CGST/SGST split", "IGST for inter-state", "all tax slabs handled", "ITC calculation works", "clear summary report", "handles reverse charge"]'::jsonb,
  30),

-- ─── DESIGN CHALLENGES ───────────────────────────────────────

('DES_AI_L2', 'design', 2, 'STUDENT',
  'Responsive Dashboard Layout',
  'Design and implement a responsive admin dashboard layout with: a collapsible sidebar navigation, a top header with user menu, a main content area with card grid, and mobile-friendly breakpoints. Use CSS Grid/Flexbox and ensure it works on mobile, tablet, and desktop.',
  'एक रिस्पॉन्सिव एडमिन डैशबोर्ड लेआउट डिज़ाइन और कार्यान्वित करें: एक संक्षिप्त करने योग्य साइडबार नेविगेशन, उपयोगकर्ता मेनू के साथ एक शीर्ष हेडर, कार्ड ग्रिड के साथ एक मुख्य सामग्री क्षेत्र, और मोबाइल-अनुकूल ब्रेकपॉइंट।',
  'Use HTML + CSS (Tailwind or vanilla). Must have: sidebar (collapsible), header, card grid (1-3 columns based on screen), mobile hamburger menu.',
  '["responsive at mobile/tablet/desktop", "sidebar collapses properly", "card grid adjusts columns", "accessible navigation", "clean visual hierarchy"]'::jsonb,
  20);
