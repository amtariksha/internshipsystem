export const EDUCATIONAL_STAGES = ["PRE_COLLEGE", "COLLEGE", "GRADUATE"] as const;
export type EducationalStage = (typeof EDUCATIONAL_STAGES)[number];

export const EMPLOYMENT_STATUSES = ["UNEMPLOYED", "EMPLOYED", "FREELANCE"] as const;
export type EmploymentStatus = (typeof EMPLOYMENT_STATUSES)[number];

export const DOMAINS = [
  { code: "computer_science", nameKey: "domains.computer_science", category: "ENGINEERING" },
  { code: "information_technology", nameKey: "domains.information_technology", category: "ENGINEERING" },
  { code: "electronics_communication", nameKey: "domains.electronics_communication", category: "ENGINEERING" },
  { code: "mechanical_engineering", nameKey: "domains.mechanical_engineering", category: "ENGINEERING" },
  { code: "civil_engineering", nameKey: "domains.civil_engineering", category: "ENGINEERING" },
  { code: "electrical_engineering", nameKey: "domains.electrical_engineering", category: "ENGINEERING" },
  { code: "commerce_accounting", nameKey: "domains.commerce_accounting", category: "COMMERCE" },
  { code: "business_management", nameKey: "domains.business_management", category: "MANAGEMENT" },
  { code: "biotechnology", nameKey: "domains.biotechnology", category: "SCIENCE" },
  { code: "design", nameKey: "domains.design", category: "CREATIVE" },
  { code: "law", nameKey: "domains.law", category: "HUMANITIES" },
  { code: "media_communication", nameKey: "domains.media_communication", category: "CREATIVE" },
  { code: "data_science_ai", nameKey: "domains.data_science_ai", category: "ENGINEERING" },
] as const;

export type DomainCode = (typeof DOMAINS)[number]["code"];

export const DOMAIN_ASSESSMENT_CONFIG = {
  MIN_QUESTIONS: 8,
  MAX_QUESTIONS: 15,
  START_DIFFICULTY: 3,
  MIN_DIFFICULTY: 1,
  MAX_DIFFICULTY: 5,
  CONFIDENCE_THRESHOLD: 0.7,
  AI_PROBE_PROBABILITY: 0.3,
  AI_PROBE_ON_WRONG_MIN_DIFFICULTY: 3,
  MCQ_SCORE_WEIGHT: 0.7,
  AI_PROBE_WEIGHT: 0.3,
  MCQ_TIME_GUIDE_SECONDS: 60,
  AI_PROBE_TIME_GUIDE_SECONDS: 90,
} as const;

export const PROFICIENCY_LEVELS = {
  EXPERT: { min: 80, label: "Expert", nameKey: "domainAssessment.proficiency.EXPERT" },
  ADVANCED: { min: 60, label: "Advanced", nameKey: "domainAssessment.proficiency.ADVANCED" },
  INTERMEDIATE: { min: 40, label: "Intermediate", nameKey: "domainAssessment.proficiency.INTERMEDIATE" },
  BEGINNER: { min: 0, label: "Beginner", nameKey: "domainAssessment.proficiency.BEGINNER" },
} as const;

export type ProficiencyLevel = keyof typeof PROFICIENCY_LEVELS;

export function getProficiencyLevel(score: number): ProficiencyLevel {
  if (score >= PROFICIENCY_LEVELS.EXPERT.min) return "EXPERT";
  if (score >= PROFICIENCY_LEVELS.ADVANCED.min) return "ADVANCED";
  if (score >= PROFICIENCY_LEVELS.INTERMEDIATE.min) return "INTERMEDIATE";
  return "BEGINNER";
}

/** Which assessment modules each educational stage can access */
export const STAGE_MODULES = {
  PRE_COLLEGE: ["astro_career"] as const,
  COLLEGE: ["behavioral_assessment", "domain_knowledge", "astro_career"] as const,
  GRADUATE: ["behavioral_assessment", "domain_knowledge", "ai_collaboration", "astro_career"] as const,
} as const;

/** Domain subdomains for question categorization */
export const DOMAIN_SUBDOMAINS: Record<string, string[]> = {
  computer_science: ["algorithms", "data_structures", "operating_systems", "dbms", "networking", "software_engineering", "oops"],
  information_technology: ["web_technologies", "networking", "databases", "security", "cloud_computing"],
  electronics_communication: ["analog_circuits", "digital_circuits", "signals_systems", "communication_systems", "microprocessors"],
  mechanical_engineering: ["thermodynamics", "fluid_mechanics", "manufacturing", "machine_design", "materials_science"],
  civil_engineering: ["structural_engineering", "geotechnical", "hydraulics", "surveying", "construction_management"],
  electrical_engineering: ["power_systems", "control_systems", "electrical_machines", "power_electronics", "instrumentation"],
  commerce_accounting: ["financial_accounting", "cost_accounting", "business_law", "economics", "taxation", "auditing"],
  business_management: ["marketing", "finance", "human_resources", "operations", "strategy", "organizational_behavior"],
  biotechnology: ["molecular_biology", "genetics", "bioprocess_engineering", "bioinformatics", "immunology"],
  design: ["ui_design", "ux_research", "graphic_design", "typography", "design_thinking", "prototyping"],
  law: ["constitutional_law", "contract_law", "criminal_law", "corporate_law", "intellectual_property"],
  media_communication: ["journalism", "public_relations", "advertising", "digital_media", "film_studies"],
  data_science_ai: ["statistics", "machine_learning", "deep_learning", "nlp", "data_engineering", "visualization"],
};
