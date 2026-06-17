// ============================================================
// COUNTRY-TO-PRIVACY-PACK MAPPING
// Maps country codes to their respective privacy compliance packs
// Used by `ges init` to auto-select the correct privacy pack
// ============================================================

export interface CountryPrivacyPack {
  code: string;
  name: string;
  region: "Europe" | "Asia-Pacific" | "Americas" | "Africa" | "Middle East";
  packId: string;
  frameworkName: string;
  lawName: string;
  regulator: string;
}

export const PRIVACY_COUNTRIES: CountryPrivacyPack[] = [

  // --- Europe ---
  {
    code: "GB",
    name: "United Kingdom",
    region: "Europe",
    packId: "uk-gdpr",
    frameworkName: "UK-GDPR",
    lawName: "UK GDPR & Data Protection Act 2018",
    regulator: "ICO (Information Commissioner's Office)",
  },
  {
    code: "CH",
    name: "Switzerland",
    region: "Europe",
    packId: "ch-fadp",
    frameworkName: "FADP",
    lawName: "Federal Act on Data Protection (revFADP 2023)",
    regulator: "FDPIC (Federal Data Protection and Information Commissioner)",
  },
  {
    code: "EU",
    name: "European Union (EEA)",
    region: "Europe",
    packId: "gdpr",
    frameworkName: "GDPR",
    lawName: "EU GDPR (Regulation 2016/679)",
    regulator: "Lead Supervisory Authority (e.g., CNIL, DPC, BfDI)",
  },

  // --- Asia-Pacific ---
  {
    code: "SG",
    name: "Singapore",
    region: "Asia-Pacific",
    packId: "sg-pdpa",
    frameworkName: "PDPA-SG",
    lawName: "Personal Data Protection Act 2012 (amended 2020/2021)",
    regulator: "PDPC (Personal Data Protection Commission)",
  },
  {
    code: "PH",
    name: "Philippines",
    region: "Asia-Pacific",
    packId: "ph-dpa",
    frameworkName: "DPA-PH",
    lawName: "Data Privacy Act of 2012",
    regulator: "NPC (National Privacy Commission)",
  },
  {
    code: "JP",
    name: "Japan",
    region: "Asia-Pacific",
    packId: "jp-appi",
    frameworkName: "APPI",
    lawName: "Act on the Protection of Personal Information (APPI 2022)",
    regulator: "PPC (Personal Information Protection Commission)",
  },
  {
    code: "KR",
    name: "South Korea",
    region: "Asia-Pacific",
    packId: "kr-pipa",
    frameworkName: "PIPA",
    lawName: "Personal Information Protection Act (PIPA 2023)",
    regulator: "PIPC (Personal Information Protection Commission)",
  },
  {
    code: "CN",
    name: "China",
    region: "Asia-Pacific",
    packId: "cn-pipl",
    frameworkName: "PIPL",
    lawName: "Personal Information Protection Law (PIPL 2021)",
    regulator: "CAC (Cyberspace Administration of China)",
  },
  {
    code: "IN",
    name: "India",
    region: "Asia-Pacific",
    packId: "in-dpdpa",
    frameworkName: "DPDPA",
    lawName: "Digital Personal Data Protection Act 2023",
    regulator: "Data Protection Board of India",
  },

  // --- Americas ---
  {
    code: "BR",
    name: "Brazil",
    region: "Americas",
    packId: "br-lgpd",
    frameworkName: "LGPD",
    lawName: "Lei Geral de Proteção de Dados (Law 13,709/2018)",
    regulator: "ANPD (Autoridade Nacional de Proteção de Dados)",
  },
  {
    code: "CA",
    name: "Canada",
    region: "Americas",
    packId: "ca-pipeda",
    frameworkName: "PIPEDA",
    lawName: "PIPEDA (S.C. 2000, c. 5)",
    regulator: "OPC (Office of the Privacy Commissioner)",
  },
  {
    code: "US-CA",
    name: "United States (California)",
    region: "Americas",
    packId: "us-cpra",
    frameworkName: "CPRA",
    lawName: "CCPA as amended by CPRA (2020)",
    regulator: "CPPA (California Privacy Protection Agency)",
  },

  // --- Africa ---
  {
    code: "ZA",
    name: "South Africa",
    region: "Africa",
    packId: "za-popia",
    frameworkName: "POPIA",
    lawName: "Protection of Personal Information Act (Act 4 of 2013)",
    regulator: "Information Regulator",
  },

  // --- Middle East ---
  {
    code: "AE",
    name: "United Arab Emirates",
    region: "Middle East",
    packId: "ae-pdpl",
    frameworkName: "PDPL-UAE",
    lawName: "Federal Decree-Law No. 45 of 2021",
    regulator: "UAE Data Office",
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    region: "Middle East",
    packId: "sa-pdpl",
    frameworkName: "PDPL-SA",
    lawName: "Personal Data Protection Law (Royal Decree M/19, amended M/148/2023)",
    regulator: "NDMO (National Data Management Office / SDAIA)",
  },
];

export function getCountryByCode(code: string): CountryPrivacyPack | undefined {
  return PRIVACY_COUNTRIES.find(c => c.code.toUpperCase() === code.toUpperCase());
}

export function getCountryPackId(code: string): string | undefined {
  return getCountryByCode(code)?.packId;
}

export function getCountriesByRegion(region: CountryPrivacyPack["region"]): CountryPrivacyPack[] {
  return PRIVACY_COUNTRIES.filter(c => c.region === region);
}
