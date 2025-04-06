
export type Defect = {
  id: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  position: { x: number; y: number };
  imageId: string;
};

export type Damage = {
  damage: number;
  description: string;
  type: 'minor' | 'major';
  repair_cost: string;
  coordinates: Array<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }>;
};

export type LegalStatus = {
  insurance: {
    status: string;
    expiry_date: string;
    insurance_company: string;
    policy_number: string;
  };
  registration: {
    status: string;
    expiry_date: string;
    registration_number: string;
  };
  challans: Array<{
    challan_number: string;
    fine_amount: string;
    status: string;
    date: string;
  }>;
  percentage: number;
};

export type FullAnalysisResult = {
  damages: {
    dent?: Damage;
    scratch?: Damage;
    headlight?: Damage;
    [key: string]: Damage | undefined;
  };
  plate_number: string | null;
  legal_status: LegalStatus;
  vehicle: {
    make: string;
    model: string;
    color: string;
    price: string;
  };
  market_value_range: {
    low_price: string;
    average_price: string;
    high_price: string;
    recommended_price: string;
  };
  physical_condition: number;
  total_repair_cost: string;
};

export type AnalysisResult = {
  physicalScore: number;
  legalScore: number;
  marketValue: {
    low: number;
    average: number;
    high: number;
  };
  recommendedPrice: number;
  defects: Defect[];
  legalIssues: string[];
};

export type ConditionAnalysisProps = {
  images: Array<{ id: string; preview: string }>;
  analysisResult?: AnalysisResult;
  fullAnalysisResult?: FullAnalysisResult;
  loading: boolean;
};
