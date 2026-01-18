/**
 * Type definitions for Strategy Consultant Agent
 */

export interface FinancialData {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  profitMargin: number;
  cashFlow: number;
}

export interface VendorData {
  id: string;
  name: string;
  category: string;
  totalSpend: number;
  paymentTerms: string;
  performanceScore: number;
}

export interface CustomerData {
  id: string;
  name: string;
  segment: string;
  totalRevenue: number;
  ltv: number;
  churnRisk: number;
}

export interface PerformanceMetric {
  current: number;
  trend?: 'up' | 'down' | 'stable';
  change?: number;
  benchmark?: number;
  rating?: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface BusinessInsights {
  revenue?: PerformanceMetric;
  profitMargin?: PerformanceMetric;
  cashFlow?: {
    current: number;
    forecast?: number;
    risk?: 'low' | 'medium' | 'high';
  };
  topVendors?: VendorData[];
  topCustomers?: CustomerData[];
}

export interface Recommendation {
  category: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
}

export interface AnalysisRequest {
  companyId: string;
  analysisType: 'quarterly' | 'annual' | 'custom';
  period: string;
  focus?: ('profitability' | 'cash-flow' | 'vendors' | 'customers')[];
}

export interface AnalysisResponse {
  sessionId: string;
  insights: BusinessInsights;
  recommendations: Recommendation[];
}

export interface PowerPointData {
  title: string;
  company?: string;
  period?: string;
  template?: 'strategic-analysis' | 'rfq-proposal';
  insights?: BusinessInsights;
  recommendations?: Recommendation[];
  quarters?: string[];
  revenue_by_quarter?: number[];
  profit_by_quarter?: number[];
  next_steps?: string[];
}

export interface PowerPointResult {
  success: boolean;
  path?: string;
  slides?: number;
  template?: string;
  error?: string;
}

export interface RFQOpportunity {
  client: string;
  service: string;
  budget?: number;
  timeline: string;
}

export interface RFQRequest {
  companyId: string;
  opportunity: RFQOpportunity;
  includePricing?: boolean;
  deliverables?: string[];
  pricing?: {
    services?: number;
    support?: number;
    training?: number;
  };
}

export interface StrategySession {
  sessionId: string;
  companyId: string;
  analysisType: string;
  period: string;
  insights?: BusinessInsights;
  recommendations?: Recommendation[];
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  createdAt: Date;
}
