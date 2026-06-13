export interface CountryData {
  country: string;
  year: number;
  gsv: number;
  itc: number;
  composite: number;
  archetype: string;
  confidence: "High" | "Medium" | "Low";
  description: string;
  layers: {
    layer1: { // Demand / Household
      account_ownership: number;
      mobile_money_ownership: number;
      digital_payment_use: number;
      formal_savings: number;
    };
    layer2: { // Firm / SME
      firms_with_bank_loan: number;
      access_to_finance_obstacles: number; // inverse (lower is better obstacles)
      credit_constraints: number; // inverse
      informality_rate: number; // inverse
    };
    layer3: { // Institutional / Regulatory
      capital_adequacy: number;
      npl_ratio: number; // inverse (lower NPL is better)
      credit_bureau_coverage: number;
      payment_interoperability: boolean; // Yes/No
      banking_assets_gdp: number;
    };
    layer4: { // Infrastructure / Digital ID
      mobile_coverage: number;
      internet_penetration: number;
      electricity_access: number;
      digital_id_use: number;
    };
    layer6: { // Outcomes
      sme_lending_gdp: number;
      active_account_use_rate: number;
      cashless_transactions_gdp: number;
    };
  };
}

export interface PolicyEvent {
  id: string;
  country: string;
  date: string;
  type: string;
  title: string;
  description: string;
  expectedEffect: string;
  source: string;
  confidence: string;
}

export const countryPanels: CountryData[] = [
  // ETHIOPIA
  {
    country: "Ethiopia",
    year: 2011,
    gsv: 1.8,
    itc: 1.2,
    composite: 1.50,
    archetype: "Catalytic-Dependent / Fragile",
    confidence: "Medium",
    description: "Extremely low demand participation and nascent banking infrastructure. Monopolized telecom services and paper-based accounts.",
    layers: {
      layer1: { account_ownership: 7.8, mobile_money_ownership: 0.0, digital_payment_use: 1.5, formal_savings: 3.8 },
      layer2: { firms_with_bank_loan: 18.5, access_to_finance_obstacles: 45.2, credit_constraints: 75.0, informality_rate: 65.0 },
      layer3: { capital_adequacy: 10.5, npl_ratio: 6.8, credit_bureau_coverage: 2.0, payment_interoperability: false, banking_assets_gdp: 75.0 },
      layer4: { mobile_coverage: 35.0, internet_penetration: 0.5, electricity_access: 13.0, digital_id_use: 0.0 },
      layer6: { sme_lending_gdp: 5.0, active_account_use_rate: 10.0, cashless_transactions_gdp: 2.0 }
    }
  },
  {
    country: "Ethiopia",
    year: 2014,
    gsv: 2.8,
    itc: 1.5,
    composite: 2.15,
    archetype: "Catalytic-Dependent / Fragile",
    confidence: "Medium",
    description: "Slight expansion in branch networks but payment systems remain siloed. Initial discussion on mobile money regulations.",
    layers: {
      layer1: { account_ownership: 22.0, mobile_money_ownership: 2.1, digital_payment_use: 3.2, formal_savings: 8.5 },
      layer2: { firms_with_bank_loan: 22.0, access_to_finance_obstacles: 42.0, credit_constraints: 25.0, informality_rate: 62.0 },
      layer3: { capital_adequacy: 11.2, npl_ratio: 5.5, credit_bureau_coverage: 5.0, payment_interoperability: false, banking_assets_gdp: 52.0 },
      layer4: { mobile_coverage: 48.0, internet_penetration: 2.5, electricity_access: 24.0, digital_id_use: 0.0 },
      layer6: { sme_lending_gdp: 7.0, active_account_use_rate: 15.0, cashless_transactions_gdp: 5.0 }
    }
  },
  {
    country: "Ethiopia",
    year: 2017,
    gsv: 3.5,
    itc: 1.8,
    composite: 2.65,
    archetype: "Transitional / Instability Risks",
    confidence: "Medium",
    description: "Launch of first Financial Inclusion Strategy (NFIS I). Steady account growth driven by state-directed bank expansions.",
    layers: {
      layer1: { account_ownership: 34.8, mobile_money_ownership: 4.5, digital_payment_use: 8.5, formal_savings: 15.3 },
      layer2: { firms_with_bank_loan: 26.5, access_to_finance_obstacles: 38.5, credit_constraints: 22.0, informality_rate: 58.0 },
      layer3: { capital_adequacy: 12.5, npl_ratio: 5.2, credit_bureau_coverage: 12.0, payment_interoperability: false, banking_assets_gdp: 75.0 },
      layer4: { mobile_coverage: 62.0, internet_penetration: 8.5, electricity_access: 35.0, digital_id_use: 0.0 },
      layer6: { sme_lending_gdp: 8.5, active_account_use_rate: 18.0, cashless_transactions_gdp: 10.0 }
    }
  },
  {
    country: "Ethiopia",
    year: 2021,
    gsv: 4.6,
    itc: 2.1,
    composite: 3.35,
    archetype: "Premature Load-Bearing",
    confidence: "Medium",
    description: "Highly divergent profile: High nominal participation gains driven by state-directed mobile money but extremely low active usage (access-usage gap of ~29pp). Payment interoperability and instant retail switch completely absent.",
    layers: {
      layer1: { account_ownership: 43.5, mobile_money_ownership: 5.8, digital_payment_use: 14.2, formal_savings: 22.8 },
      layer2: { firms_with_bank_loan: 32.0, access_to_finance_obstacles: 32.0, credit_constraints: 18.0, informality_rate: 52.0 },
      layer3: { capital_adequacy: 13.8, npl_ratio: 5.8, credit_bureau_coverage: 25.0, payment_interoperability: true, banking_assets_gdp: 75.0 },
      layer4: { mobile_coverage: 75.0, internet_penetration: 15.0, electricity_access: 48.0, digital_id_use: 15.0 },
      layer6: { sme_lending_gdp: 9.0, active_account_use_rate: 21.0, cashless_transactions_gdp: 15.0 }
    }
  },
  {
    country: "Ethiopia",
    year: 2024,
    gsv: 5.5,
    itc: 3.2,
    composite: 4.35,
    archetype: "Premature Load-Bearing",
    confidence: "Medium",
    description: "Launch of EthioPay-IPS in late 2025. Mobile wallets rocketed to 139M+ registered, but active digital payment usage sits at 21%, revealing a massive 35pp access-usage spread. High NPL ratios near 8.5% threaten regulatory buffers.",
    layers: {
      layer1: { account_ownership: 63.0, mobile_money_ownership: 48.8, digital_payment_use: 28.0, formal_savings: 42.5 },
      layer2: { firms_with_bank_loan: 38.5, access_to_finance_obstacles: 28.5, credit_constraints: 15.0, informality_rate: 48.0 },
      layer3: { capital_adequacy: 15.0, npl_ratio: 8.5, credit_bureau_coverage: 42.0, payment_interoperability: true, banking_assets_gdp: 92.0 },
      layer4: { mobile_coverage: 85.0, internet_penetration: 38.0, electricity_access: 58.0, digital_id_use: 45.0 },
      layer6: { sme_lending_gdp: 11.0, active_account_use_rate: 28.0, cashless_transactions_gdp: 21.0 }
    }
  },
  {
    country: "Ethiopia",
    year: 2025,
    gsv: 5.8,
    itc: 3.5,
    composite: 4.65,
    archetype: "Transitioning out of Premature Load-Bearing",
    confidence: "Medium",
    description: "Regulatory sandbox expansion showing fruit, Safaricom money (M-Pesa) scales. Instant payments crossed 1M daily. SME credit remains tight.",
    layers: {
      layer1: { account_ownership: 68.0, mobile_money_ownership: 52.0, digital_payment_use: 33.0, formal_savings: 45.0 },
      layer2: { firms_with_bank_loan: 42.0, access_to_finance_obstacles: 25.0, credit_constraints: 12.0, informality_rate: 45.0 },
      layer3: { capital_adequacy: 15.0, npl_ratio: 8.0, credit_bureau_coverage: 55.0, payment_interoperability: true, banking_assets_gdp: 105.0 },
      layer4: { mobile_coverage: 90.0, internet_penetration: 45.0, electricity_access: 65.0, digital_id_use: 65.0 },
      layer6: { sme_lending_gdp: 12.0, active_account_use_rate: 33.0, cashless_transactions_gdp: 25.0 }
    }
  },

  // KENYA
  {
    country: "Kenya",
    year: 2011,
    gsv: 3.8,
    itc: 3.2,
    composite: 3.50,
    archetype: "Transitional",
    confidence: "High",
    description: "Early phase of mobile money explosion. M-Pesa establishing a solid base but credit translation lags and SME credit constraints are high.",
    layers: {
      layer1: { account_ownership: 42.0, mobile_money_ownership: 35.0, digital_payment_use: 28.0, formal_savings: 42.0 },
      layer2: { firms_with_bank_loan: 18.0, access_to_finance_obstacles: 38.5, credit_constraints: 22.0, informality_rate: 55.0 },
      layer3: { capital_adequacy: 14.5, npl_ratio: 5.8, credit_bureau_coverage: 15.0, payment_interoperability: false, banking_assets_gdp: 58.0 },
      layer4: { mobile_coverage: 65.0, internet_penetration: 11.0, electricity_access: 17.0, digital_id_use: 0.0 },
      layer6: { sme_lending_gdp: 10.0, active_account_use_rate: 35.0, cashless_transactions_gdp: 35.0 }
    }
  },
  {
    country: "Kenya",
    year: 2014,
    gsv: 4.2,
    itc: 3.8,
    composite: 4.00,
    archetype: "Transitional",
    confidence: "High",
    description: "Account ownership scales to 56%. Strong payment velocity but SME credit squeeze is visible as collateral requirements increase.",
    layers: {
      layer1: { account_ownership: 56.0, mobile_money_ownership: 43.0, digital_payment_use: 48.0, formal_savings: 65.0 },
      layer2: { firms_with_bank_loan: 32.5, access_to_finance_obstacles: 31.8, credit_constraints: 19.5, informality_rate: 52.0 },
      layer3: { capital_adequacy: 15.5, npl_ratio: 8.2, credit_bureau_coverage: 28.0, payment_interoperability: false, banking_assets_gdp: 72.0 },
      layer4: { mobile_coverage: 78.0, internet_penetration: 15.0, electricity_access: 23.0, digital_id_use: 0.0 },
      layer6: { sme_lending_gdp: 12.0, active_account_use_rate: 45.0, cashless_transactions_gdp: 50.0 }
    }
  },
  {
    country: "Kenya",
    year: 2017,
    gsv: 4.5,
    itc: 4.2,
    composite: 4.35,
    archetype: "Mature but Segmented",
    confidence: "High",
    description: "Deepened retail payments. Outstanding mobile transactional penetration but credit translation choked by high firm collateral (125%).",
    layers: {
      layer1: { account_ownership: 78.0, mobile_money_ownership: 72.0, digital_payment_use: 62.0, formal_savings: 72.0 },
      layer2: { firms_with_bank_loan: 30.0, access_to_finance_obstacles: 28.0, credit_constraints: 17.0, informality_rate: 48.0 },
      layer3: { capital_adequacy: 16.8, npl_ratio: 8.8, credit_bureau_coverage: 45.0, payment_interoperability: false, banking_assets_gdp: 102.0 },
      layer4: { mobile_coverage: 88.0, internet_penetration: 28.0, electricity_access: 32.0, digital_id_use: 0.0 },
      layer6: { sme_lending_gdp: 13.0, active_account_use_rate: 58.0, cashless_transactions_gdp: 65.0 }
    }
  },
  {
    country: "Kenya",
    year: 2021,
    gsv: 4.8,
    itc: 4.5,
    composite: 4.65,
    archetype: "Mature but Segmented",
    confidence: "High",
    description: "A digitally mature financial market with the deepest mobile penetration in the region. Outstanding retail payments velocity, but structural bottlenecks and credit contraction prevent high-multiplier SME credit lines.",
    layers: {
      layer1: { account_ownership: 79.2, mobile_money_ownership: 73.8, digital_payment_use: 68.4, formal_savings: 45.2 },
      layer2: { firms_with_bank_loan: 28.0, access_to_finance_obstacles: 25.0, credit_constraints: 13.5, informality_rate: 42.0 },
      layer3: { capital_adequacy: 17.2, npl_ratio: 7.5, credit_bureau_coverage: 68.0, payment_interoperability: true, banking_assets_gdp: 128.0 },
      layer4: { mobile_coverage: 92.0, internet_penetration: 48.0, electricity_access: 45.0, digital_id_use: 25.0 },
      layer6: { sme_lending_gdp: 15.0, active_account_use_rate: 62.0, cashless_transactions_gdp: 120.0 }
    }
  },
  {
    country: "Kenya",
    year: 2024,
    gsv: 5.6,
    itc: 5.2,
    composite: 5.40,
    archetype: "Mature / High Execution Alignment",
    confidence: "High",
    description: "FinAccess survey reports record access. Digital Credit Providers regulated, moderating predatory behavior. Interoperability fully operational through PesaLink. Grid stability constraints cost firms as outages hit 80% of local enterprise.",
    layers: {
      layer1: { account_ownership: 84.8, mobile_money_ownership: 82.0, digital_payment_use: 72.0, formal_savings: 72.0 },
      layer2: { firms_with_bank_loan: 35.0, access_to_finance_obstacles: 22.0, credit_constraints: 9.5, informality_rate: 38.0 },
      layer3: { capital_adequacy: 18.0, npl_ratio: 9.2, credit_bureau_coverage: 82.0, payment_interoperability: true, banking_assets_gdp: 155.0 },
      layer4: { mobile_coverage: 95.0, internet_penetration: 62.0, electricity_access: 58.0, digital_id_use: 85.0 },
      layer6: { sme_lending_gdp: 15.0, active_account_use_rate: 88.0, cashless_transactions_gdp: 150.0 }
    }
  },
  {
    country: "Kenya",
    year: 2025,
    gsv: 5.9,
    itc: 5.6,
    composite: 5.75,
    archetype: "Mature / High Execution Alignment",
    confidence: "High",
    description: "National ID transitioned to Maisha Namba digital standard. Mobile coverage near-universal. Bank assets growing, but high sovereign loan exposures remain a systemic watchpoint.",
    layers: {
      layer1: { account_ownership: 88.0, mobile_money_ownership: 86.0, digital_payment_use: 78.0, formal_savings: 76.0 },
      layer2: { firms_with_bank_loan: 38.0, access_to_finance_obstacles: 18.0, credit_constraints: 8.0, informality_rate: 35.0 },
      layer3: { capital_adequacy: 18.5, npl_ratio: 8.5, credit_bureau_coverage: 92.0, payment_interoperability: true, banking_assets_gdp: 175.0 },
      layer4: { mobile_coverage: 97.0, internet_penetration: 75.0, electricity_access: 65.0, digital_id_use: 85.0 },
      layer6: { sme_lending_gdp: 16.0, active_account_use_rate: 94.0, cashless_transactions_gdp: 180.0 }
    }
  },

  // RWANDA
  {
    country: "Rwanda",
    year: 2011,
    gsv: 2.2,
    itc: 2.8,
    composite: 2.50,
    archetype: "Transitional",
    confidence: "Medium",
    description: "Launch of mobile money pilot. State-led Umurenge SACCO program targets massive village mobilization. Microfinance expansion underway.",
    layers: {
      layer1: { account_ownership: 18.0, mobile_money_ownership: 15.0, digital_payment_use: 8.0, formal_savings: 42.0 },
      layer2: { firms_with_bank_loan: 15.0, access_to_finance_obstacles: 52.0, credit_constraints: 25.0, informality_rate: 68.0 },
      layer3: { capital_adequacy: 12.5, npl_ratio: 10.5, credit_bureau_coverage: 5.0, payment_interoperability: false, banking_assets_gdp: 28.0 },
      layer4: { mobile_coverage: 45.0, internet_penetration: 3.0, electricity_access: 13.0, digital_id_use: 5.0 },
      layer6: { sme_lending_gdp: 8.0, active_account_use_rate: 12.0, cashless_transactions_gdp: 10.0 }
    }
  },
  {
    country: "Rwanda",
    year: 2014,
    gsv: 3.2,
    itc: 3.5,
    composite: 3.35,
    archetype: "Transitional",
    confidence: "Medium",
    description: "Mobile wallet growth to 22%. Structured credit information sharing established via TransUnion credit bureau rollout.",
    layers: {
      layer1: { account_ownership: 32.0, mobile_money_ownership: 28.0, digital_payment_use: 22.0, formal_savings: 52.0 },
      layer2: { firms_with_bank_loan: 18.0, access_to_finance_obstacles: 42.0, credit_constraints: 18.0, informality_rate: 64.0 },
      layer3: { capital_adequacy: 13.5, npl_ratio: 9.8, credit_bureau_coverage: 12.0, payment_interoperability: false, banking_assets_gdp: 62.0 },
      layer4: { mobile_coverage: 68.0, internet_penetration: 8.5, electricity_access: 15.0, digital_id_use: 15.0 },
      layer6: { sme_lending_gdp: 11.0, active_account_use_rate: 25.0, cashless_transactions_gdp: 12.0 }
    }
  },
  {
    country: "Rwanda",
    year: 2017,
    gsv: 4.1,
    itc: 4.2,
    composite: 4.15,
    archetype: "Transitioning to High Execution",
    confidence: "High",
    description: "Launch of NFIS II. National retail payment interoperability strategy laid out by BNR. Centralized institutional coordination.",
    layers: {
      layer1: { account_ownership: 48.0, mobile_money_ownership: 32.0, digital_payment_use: 42.0, formal_savings: 58.0 },
      layer2: { firms_with_bank_loan: 24.0, access_to_finance_obstacles: 35.0, credit_constraints: 15.0, informality_rate: 62.0 },
      layer3: { capital_adequacy: 14.8, npl_ratio: 8.5, credit_bureau_coverage: 25.0, payment_interoperability: true, banking_assets_gdp: 78.0 },
      layer4: { mobile_coverage: 82.0, internet_penetration: 18.0, electricity_access: 22.0, digital_id_use: 35.0 },
      layer6: { sme_lending_gdp: 14.0, active_account_use_rate: 45.0, cashless_transactions_gdp: 45.0 }
    }
  },
  {
    country: "Rwanda",
    year: 2021,
    gsv: 4.7,
    itc: 4.8,
    composite: 4.75,
    archetype: "High-Execution alignment",
    confidence: "High",
    description: "Commanding structural alignment. Exceptionally strong regulatory execution under BNR centralized coordination, with eKash national payment system bridging mobile-to-bank networks. Microfinance sector NPLs dropped to 3.5%.",
    layers: {
      layer1: { account_ownership: 73.3, mobile_money_ownership: 47.5, digital_payment_use: 48.2, formal_savings: 38.5 },
      layer2: { firms_with_bank_loan: 45.0, access_to_finance_obstacles: 28.0, credit_constraints: 13.0, informality_rate: 54.0 },
      layer3: { capital_adequacy: 22.5, npl_ratio: 3.8, credit_bureau_coverage: 48.0, payment_interoperability: true, banking_assets_gdp: 98.0 },
      layer4: { mobile_coverage: 92.0, internet_penetration: 35.0, electricity_access: 48.0, digital_id_use: 65.0 },
      layer6: { sme_lending_gdp: 19.0, active_account_use_rate: 65.0, cashless_transactions_gdp: 180.0 }
    }
  },
  {
    country: "Rwanda",
    year: 2024,
    gsv: 5.8,
    itc: 5.7,
    composite: 5.75,
    archetype: "High-Execution alignment",
    confidence: "High",
    description: "Account ownership surged to 82.0% with active digital usage at 65.0%. Instant payment switch eKash fully digitized. 100% of microfiannce SACCOs integrated with unified core banking. SME lending reached records at 19% of GDP.",
    layers: {
      layer1: { account_ownership: 82.0, mobile_money_ownership: 68.0, digital_payment_use: 65.0, formal_savings: 78.0 },
      layer2: { firms_with_bank_loan: 48.0, access_to_finance_obstacles: 18.0, credit_constraints: 11.5, informality_rate: 45.0 },
      layer3: { capital_adequacy: 18.0, npl_ratio: 3.5, credit_bureau_coverage: 82.0, payment_interoperability: true, banking_assets_gdp: 145.0 },
      layer4: { mobile_coverage: 96.0, internet_penetration: 62.0, electricity_access: 65.0, digital_id_use: 85.0 },
      layer6: { sme_lending_gdp: 19.0, active_account_use_rate: 92.0, cashless_transactions_gdp: 301.5 }
    }
  },
  {
    country: "Rwanda",
    year: 2025,
    gsv: 6.2,
    itc: 6.0,
    composite: 6.10,
    archetype: "High-Execution alignment",
    confidence: "High",
    description: "Digital IDs coverage hit 92%. Seamless offline-online retail payments. Superb capital position combined with historic low NPL risk markers.",
    layers: {
      layer1: { account_ownership: 85.0, mobile_money_ownership: 75.0, digital_payment_use: 78.0, formal_savings: 82.0 },
      layer2: { firms_with_bank_loan: 52.0, access_to_finance_obstacles: 13.0, credit_constraints: 9.0, informality_rate: 38.0 },
      layer3: { capital_adequacy: 20.0, npl_ratio: 3.0, credit_bureau_coverage: 88.0, payment_interoperability: true, banking_assets_gdp: 165.0 },
      layer4: { mobile_coverage: 98.0, internet_penetration: 65.0, electricity_access: 70.0, digital_id_use: 92.0 },
      layer6: { sme_lending_gdp: 20.0, active_account_use_rate: 95.0, cashless_transactions_gdp: 350.0 }
    }
  },

  // SIERRA LEONE
  {
    country: "Sierra Leone",
    year: 2011,
    gsv: 1.2,
    itc: 1.5,
    composite: 1.35,
    archetype: "Catalytic-Dependent / Fragile",
    confidence: "Medium",
    description: "Severely restricted formal access (8.0%). Virtual absence of functional payment switches or mobile wallets.",
    layers: {
      layer1: { account_ownership: 8.0, mobile_money_ownership: 1.0, digital_payment_use: 1.5, formal_savings: 6.0 },
      layer2: { firms_with_bank_loan: 8.0, access_to_finance_obstacles: 68.0, credit_constraints: 52.0, informality_rate: 85.0 },
      layer3: { capital_adequacy: 9.5, npl_ratio: 14.5, credit_bureau_coverage: 2.0, payment_interoperability: false, banking_assets_gdp: 18.0 },
      layer4: { mobile_coverage: 25.0, internet_penetration: 0.1, electricity_access: 3.0, digital_id_use: 0.0 },
      layer6: { sme_lending_gdp: 1.5, active_account_use_rate: 5.0, cashless_transactions_gdp: 0.5 }
    }
  },
  {
    country: "Sierra Leone",
    year: 2014,
    gsv: 1.8,
    itc: 1.8,
    composite: 1.80,
    archetype: "Catalytic-Dependent / Fragile",
    confidence: "Medium",
    description: "Account ownership scales to 12%. Fragile institutional backdrop, high bank distress post-regional shock.",
    layers: {
      layer1: { account_ownership: 12.0, mobile_money_ownership: 6.0, digital_payment_use: 4.0, formal_savings: 9.0 },
      layer2: { firms_with_bank_loan: 10.0, access_to_finance_obstacles: 62.0, credit_constraints: 48.0, informality_rate: 82.0 },
      layer3: { capital_adequacy: 13.0, npl_ratio: 13.0, credit_bureau_coverage: 4.0, payment_interoperability: false, banking_assets_gdp: 20.0 },
      layer4: { mobile_coverage: 42.0, internet_penetration: 1.0, electricity_access: 5.0, digital_id_use: 0.0 },
      layer6: { sme_lending_gdp: 2.5, active_account_use_rate: 8.0, cashless_transactions_gdp: 1.0 }
    }
  },
  {
    country: "Sierra Leone",
    year: 2017,
    gsv: 2.2,
    itc: 2.0,
    composite: 2.10,
    archetype: "Catalytic-Dependent / Fragile",
    confidence: "Medium",
    description: "Early rollout of Africell Mobile Money trying to challenge Orange, but active engagement is constrained by trust.",
    layers: {
      layer1: { account_ownership: 18.0, mobile_money_ownership: 10.0, digital_payment_use: 6.0, formal_savings: 14.0 },
      layer2: { firms_with_bank_loan: 12.0, access_to_finance_obstacles: 55.0, credit_constraints: 42.0, informality_rate: 78.0 },
      layer3: { capital_adequacy: 12.0, npl_ratio: 11.5, credit_bureau_coverage: 8.0, payment_interoperability: false, banking_assets_gdp: 24.0 },
      layer4: { mobile_coverage: 58.0, internet_penetration: 1.5, electricity_access: 8.0, digital_id_use: 8.0 },
      layer6: { sme_lending_gdp: 3.0, active_account_use_rate: 12.0, cashless_transactions_gdp: 3.0 }
    }
  },
  {
    country: "Sierra Leone",
    year: 2021,
    gsv: 3.9,
    itc: 2.4,
    composite: 3.15,
    archetype: "Catalytic-Dependent / Fragile",
    confidence: "Medium",
    description: "Heavily reliant on external catalytic funding. National switch project financed by the $12M IDA loan, but true payment system integration, interoperable wallets and localized firm credit channels suffer prolonged delays.",
    layers: {
      layer1: { account_ownership: 23.5, mobile_money_ownership: 15.2, digital_payment_use: 12.5, formal_savings: 14.2 },
      layer2: { firms_with_bank_loan: 12.0, access_to_finance_obstacles: 48.0, credit_constraints: 35.0, informality_rate: 72.0 },
      layer3: { capital_adequacy: 12.8, npl_ratio: 18.5, credit_bureau_coverage: 8.0, payment_interoperability: false, banking_assets_gdp: 18.0 },
      layer4: { mobile_coverage: 67.0, internet_penetration: 3.0, electricity_access: 14.0, digital_id_use: 18.0 },
      layer6: { sme_lending_gdp: 5.0, active_account_use_rate: 15.0, cashless_transactions_gdp: 12.0 }
    }
  },
  {
    country: "Sierra Leone",
    year: 2024,
    gsv: 4.2,
    itc: 2.8,
    composite: 3.50,
    archetype: "Catalytic-Dependent / Fragile",
    confidence: "Medium",
    description: "Phase 2 of Instant Payment Switch delayed. Operational switch volumes stand at 512k against a 1M baseline. Vulnerabilities around digital cash persist as 2025 Global Findex lists security and network fears as major friction.",
    layers: {
      layer1: { account_ownership: 35.0, mobile_money_ownership: 35.0, digital_payment_use: 18.0, formal_savings: 15.0 },
      layer2: { firms_with_bank_loan: 15.0, access_to_finance_obstacles: 40.0, credit_constraints: 28.0, informality_rate: 65.0 },
      layer3: { capital_adequacy: 16.0, npl_ratio: 12.3, credit_bureau_coverage: 18.0, payment_interoperability: true, banking_assets_gdp: 32.0 },
      layer4: { mobile_coverage: 65.0, internet_penetration: 12.0, electricity_access: 17.0, digital_id_use: 25.0 },
      layer6: { sme_lending_gdp: 5.0, active_account_use_rate: 58.0, cashless_transactions_gdp: 35.0 }
    }
  },
  {
    country: "Sierra Leone",
    year: 2025,
    gsv: 4.5,
    itc: 3.1,
    composite: 3.80,
    archetype: "Catalytic-Dependent / Fragile",
    confidence: "Medium",
    description: "Launch of the Instant Payment Switch Phase 2 in Feb 2025 supports basic bank-wallets interoperability, though scale remains low and highly localized.",
    layers: {
      layer1: { account_ownership: 45.0, mobile_money_ownership: 42.0, digital_payment_use: 18.0, formal_savings: 18.0 },
      layer2: { firms_with_bank_loan: 18.0, access_to_finance_obstacles: 35.0, credit_constraints: 22.0, informality_rate: 58.0 },
      layer3: { capital_adequacy: 17.0, npl_ratio: 11.5, credit_bureau_coverage: 32.0, payment_interoperability: true, banking_assets_gdp: 45.0 },
      layer4: { mobile_coverage: 75.0, internet_penetration: 15.0, electricity_access: 18.0, digital_id_use: 45.0 },
      layer6: { sme_lending_gdp: 6.0, active_account_use_rate: 65.0, cashless_transactions_gdp: 40.0 }
    }
  }
];

export const policyEvents: PolicyEvent[] = [
  // ETHIOPIA
  {
    id: "PE-ET-2015-001",
    country: "Ethiopia",
    date: "2015-02-01",
    type: "Licensing",
    title: "Mobile Money Licensing (HelloCash & M-Birr)",
    description: "NBE licensed helloCash and M-Birr as the first mobile money operators under the National Bank guidelines. This launched early financial digitisation, enabling agent-based cash collection networks, but operations were bank-bound and heavily limited.",
    expectedEffect: "Increase retail financial access (Layer 1) & test regulatory oversight.",
    source: "National Bank of Ethiopia (NBE)",
    confidence: "High"
  },
  {
    id: "PE-ET-2017-001",
    country: "Ethiopia",
    date: "2017-01-01",
    type: "Structural",
    title: "Financial Inclusion Strategy I (NFIS I)",
    description: "Ethiopia launched its first National Financial Inclusion Strategy, aiming to expand physical access, enhance financial literacy, and improve the regulatory environment.",
    expectedEffect: "Establish formal national targets for physical and digital banking reach.",
    source: "NBE / Government of Ethiopia",
    confidence: "High"
  },
  {
    id: "PE-ET-2018-001",
    country: "Ethiopia",
    date: "2018-06-01",
    type: "Regulatory Directive",
    title: "NBE Banking Capital Raising Mandate",
    description: "The central bank issued high capital requirement minimums for licensed banks to withstand credit shocks and consolidate internal system buffers in anticipation of sector opening.",
    expectedEffect: "Reinforce banking sector capitalization and solvency ratios (Layer 3).",
    source: "National Bank of Ethiopia (NBE)",
    confidence: "High"
  },
  {
    id: "PE-ET-2020-001",
    country: "Ethiopia",
    date: "2020-04-01",
    type: "Regulatory Directive",
    title: "NBE Licensing of Non-Bank Mobile Money (Telebirr Catalyst)",
    description: "The National Bank of Ethiopia issued Directive ON補助/01/2020, allowing non-bank financial institutions and telecommunications operators to register and operate mobile money wallets. This paved the structural runway for Ethio Telecom to build and launch Telebirr, unlocking massive grassroots account openings.",
    expectedEffect: "Decisive catalyst for Ethiopia's exponential account registration expansion (GSV).",
    source: "National Bank of Ethiopia (NBE)",
    confidence: "High"
  },
  {
    id: "PE-ET-2021-001",
    country: "Ethiopia",
    date: "2021-03-01",
    type: "Licensing",
    title: "Fintech & Mobile Wallet Reforms",
    description: "NBE implemented deep regulatory sandbox policies, granting licensing routes to private and non-bank payment system operators (PSOs) and mobile issuers.",
    expectedEffect: "Unshackle private retail transaction platforms and increase digital velocity.",
    source: "NBE Sector Reforms",
    confidence: "High"
  },
  {
    id: "PE-ET-2021-002",
    country: "Ethiopia",
    date: "2021-10-01",
    type: "Structural",
    title: "Safaricom commercial launch",
    description: "Entering of Safaricom Ethiopia ended the state-owned telecom monopoly, driving heavy physical telecom mast upgrades and laying groundwork for M-Pesa's secondary entry.",
    expectedEffect: "Upgrading national network coverage and digital infrastructure base.",
    source: "Ministry of Communications / Safaricom",
    confidence: "High"
  },
  {
    id: "PE-ET-2022-001",
    country: "Ethiopia",
    date: "2022-04-01",
    type: "Structural",
    title: "National Instant Payment Switch Delay",
    description: "Technical and integration challenges between public clearing house systems and private legacy banking networks caused the central retail instant switch to suffer major deployment slide.",
    expectedEffect: "Prolonged payment fragmentation and localized loop constraints.",
    source: "NBE Operations Review",
    confidence: "High"
  },
  {
    id: "PE-ET-2024-001",
    country: "Ethiopia",
    date: "2024-05-01",
    type: "Regulatory Directive",
    title: "Capital Adequacy & Supervision Alerts",
    description: "With retail inclusion indices reaching the 30.3% systemic risk threshold documented in local stability research, NBE issued strict NPL mitigation rules as default stress rose (8.5%).",
    expectedEffect: "Emergency prudential backstops to protect retail deposit buffers.",
    source: "NBE Financial Stability Report",
    confidence: "High"
  },

  // KENYA
  {
    id: "PE-KE-2011-001",
    country: "Kenya",
    date: "2011-01-01",
    type: "Licensing",
    title: "M-Pesa Scale & Early Agent Guidelines",
    description: "Central Bank of Kenya formalized agency banking rules to govern M-Pesa's explosive distribution grid, allowing non-bank retail storefronts to process physical cash-in/cash-out safely.",
    expectedEffect: "Accelerated local liquidity nodes and grassroots account velocity.",
    source: "Central Bank of Kenya (CBK)",
    confidence: "High"
  },
  {
    id: "PE-KE-2017-001",
    country: "Kenya",
    date: "2017-06-01",
    type: "Structural",
    title: "PesaLink Interoperability Rollout",
    description: "Kenya's commercial banks co-launched PesaLink, enabling real-time peer-to-peer retail bank transfers outside card schemes, bridging mobile money wallets directly to formal checking accounts.",
    expectedEffect: "Massive boost to formal banking assets and clearing efficiency.",
    source: "Integrated Payment Services Ltd / CBK",
    confidence: "High"
  },
  {
    id: "PE-KE-2020-001",
    country: "Kenya",
    date: "2020-08-01",
    type: "Regulatory Directive",
    title: "Inter-Operator Wallet Interoperability",
    description: "CBK mandated cross-compatible retail QR standards and wallet transfers, preventing closed-loop merchant lock-ins across Safaricom M-Pesa, Airtel Money, and T-Kash.",
    expectedEffect: "Increase merchant digital receipts and digital circulation.",
    source: "Central Bank of Kenya",
    confidence: "High"
  },
  {
    id: "PE-KE-2023-001",
    country: "Kenya",
    date: "2023-03-01",
    type: "Licensing",
    title: "Digital Credit Providers (DCP) Regulation",
    description: "CBK cracked down on unregulated mobile loan sharks, requiring formal licenses for all Digital Credit Providers. Under the law, DCPs have to clear pricing criteria and data protection limits.",
    expectedEffect: "Protect consumer solvency, reduce consumer default spikes.",
    source: "CBK Regulatory Enforcement",
    confidence: "High"
  },

  // RWANDA
  {
    id: "PE-RW-2011-001",
    country: "Rwanda",
    date: "2011-03-01",
    type: "Licensing",
    title: "MTN Mobile Money Licensing",
    description: "BNR approved MTN Rwanda to launch the nation's inaugural mobile money framework, launching early digital cash trails.",
    expectedEffect: "Primary demand-side inclusion driver across rural sectors.",
    source: "National Bank of Rwanda (BNR)",
    confidence: "High"
  },
  {
    id: "PE-RW-2014-001",
    country: "Rwanda",
    date: "2014-06-01",
    type: "Structural",
    title: "Umurenge SACCO Automation",
    description: "A centralized, government-funded campaign automated first-mile village cooperatives, merging regional SACCO registries into the central supervisory interface.",
    expectedEffect: "Dramatic lift in formal savings, lowering informal interest traps.",
    source: "Ministry of Finance / BNR",
    confidence: "High"
  },
  {
    id: "PE-RW-2019-001",
    country: "Rwanda",
    date: "2019-05-01",
    type: "Structural",
    title: "eKash National Payment Integration",
    description: "Rwanda operationalized its National Digital Payment System (RNDPS), creating eKash. This successfully merged telco wallets with clearing banks onto a single instant payment switch.",
    expectedEffect: "Perfected settlement efficiency, reducing physical liquidity costs.",
    source: "BNR Monetary Strategy Report",
    confidence: "High"
  },
  {
    id: "PE-RW-2023-001",
    country: "Rwanda",
    date: "2023-01-01",
    type: "Regulatory Directive",
    title: "SACCO Centralization and Microfinance Oversight",
    description: "BNR implemented consolidated oversight of SACCO networks under district-level banking structures, cutting default margins and system risk.",
    expectedEffect: "Strengthen System Resilience (Layer 3) and SME capital pathways.",
    source: "BNR Advisory",
    confidence: "High"
  },

  // SIERRA LEONE
  {
    id: "PE-SL-2011-001",
    country: "Sierra Leone",
    date: "2011-09-01",
    type: "Regulatory Directive",
    title: "Prudential Capital Adequacy Raise",
    description: "BSL significantly raised banking reserve assets to counter persistent credit distress, high NPL rates, and structural capital deficiencies in local banks.",
    expectedEffect: "Shield fragile depository units from market shocks.",
    source: "Bank of Sierra Leone (BSL)",
    confidence: "High"
  },
  {
    id: "PE-SL-2015-001",
    country: "Sierra Leone",
    date: "2015-09-01",
    type: "Structural",
    title: "$12M World Bank IDA Inclusion Funding",
    description: "International Development Association approved a long-term concessional credit scheme to construct Sierra Leone's national clearing systems and microfinance registries.",
    expectedEffect: "Introduce modern processing lines for retail payments.",
    source: "World Bank / BSL Agreement",
    confidence: "High"
  },
  {
    id: "PE-SL-2021-001",
    country: "Sierra Leone",
    date: "2021-06-01",
    type: "Structural",
    title: "National Switch Implementation Bottleneck",
    description: "Persistent fiscal constraints and procurement friction delayed the live operationalization of the national instant payment rails, continuing structural loops fragmentation.",
    expectedEffect: "Prolonged reliance on cash, high interbank clearing times.",
    source: "BSL Strategic Project Review",
    confidence: "High"
  },
  {
    id: "PE-SL-2025-001",
    country: "Sierra Leone",
    date: "2025-02-01",
    type: "Structural",
    title: "Instant Payment Switch Phase 2 Live",
    description: "Phase 2 of the national instant switch finally went live after years of delay, enabling basic peer-to-peer interoperability between select mobile wallets and banks.",
    expectedEffect: "Early stage boost to digital payment velocity, reducing cash dependency.",
    source: "Bank of Sierra Leone Release",
    confidence: "High"
  }
];
