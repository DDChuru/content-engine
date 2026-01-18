/**
 * PeakFlow Service
 * Interface to PeakFlow accounting data platform
 *
 * Phase 1: Mock data for testing
 * Phase 2: Database integration
 * Phase 3: Real-time sync
 */

import type { FinancialData, VendorData, CustomerData, BusinessInsights } from '../types/strategy.js';

interface KPIData {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

class PeakFlowService {
  /**
   * Get financial data for a company and period
   */
  async getFinancials(companyId: string, period: string): Promise<FinancialData> {
    // Mock data - will be replaced with database queries
    return {
      period,
      revenue: 500000,
      expenses: 390000,
      profit: 110000,
      profitMargin: 22,
      cashFlow: 110000
    };
  }

  /**
   * Get profit and loss statement
   */
  async getProfitAndLoss(companyId: string, period: string): Promise<any> {
    const financials = await this.getFinancials(companyId, period);

    return {
      period,
      revenue: {
        total: financials.revenue,
        breakdown: {
          'Consulting Services': 320000,
          'Software Licenses': 120000,
          'Training': 60000
        }
      },
      expenses: {
        total: financials.expenses,
        breakdown: {
          'Salaries': 250000,
          'Office & Operations': 65000,
          'Technology': 38000,
          'Marketing': 32000,
          'Other': 5000
        }
      },
      profit: financials.profit,
      profitMargin: financials.profitMargin
    };
  }

  /**
   * Get balance sheet
   */
  async getBalanceSheet(companyId: string, date: string): Promise<any> {
    return {
      date,
      assets: {
        cash: 250000,
        accountsReceivable: 85000,
        inventory: 0,
        equipment: 45000,
        total: 380000
      },
      liabilities: {
        accountsPayable: 42000,
        creditLine: 0,
        loans: 50000,
        total: 92000
      },
      equity: {
        retainedEarnings: 288000,
        total: 288000
      }
    };
  }

  /**
   * Get cash flow data
   */
  async getCashFlow(companyId: string, period: string): Promise<any> {
    return {
      period,
      operating: 110000,
      investing: -15000,
      financing: 0,
      netCashFlow: 95000,
      cashAtStart: 155000,
      cashAtEnd: 250000
    };
  }

  /**
   * Get vendor relationships and spending
   */
  async getVendors(companyId: string): Promise<VendorData[]> {
    // Mock vendor data
    return [
      {
        id: 'vend-001',
        name: 'Office Supplies Inc',
        category: 'Office',
        totalSpend: 45000,
        paymentTerms: 'Net 30',
        performanceScore: 8.5
      },
      {
        id: 'vend-002',
        name: 'IT Services Co',
        category: 'Technology',
        totalSpend: 38000,
        paymentTerms: 'Monthly',
        performanceScore: 9.2
      },
      {
        id: 'vend-003',
        name: 'Marketing Agency',
        category: 'Marketing',
        totalSpend: 32000,
        paymentTerms: 'Project-based',
        performanceScore: 8.8
      },
      {
        id: 'vend-004',
        name: 'Cloud Services Provider',
        category: 'Technology',
        totalSpend: 24000,
        paymentTerms: 'Monthly',
        performanceScore: 9.5
      },
      {
        id: 'vend-005',
        name: 'Professional Services',
        category: 'Consulting',
        totalSpend: 18000,
        paymentTerms: 'Net 45',
        performanceScore: 8.0
      }
    ];
  }

  /**
   * Get customer relationships and revenue
   */
  async getCustomers(companyId: string): Promise<CustomerData[]> {
    // Mock customer data
    return [
      {
        id: 'cust-001',
        name: 'Enterprise Client A',
        segment: 'Enterprise',
        totalRevenue: 180000,
        ltv: 500000,
        churnRisk: 0.1
      },
      {
        id: 'cust-002',
        name: 'Mid-Market Client B',
        segment: 'Mid-Market',
        totalRevenue: 95000,
        ltv: 250000,
        churnRisk: 0.2
      },
      {
        id: 'cust-003',
        name: 'Small Business C',
        segment: 'SMB',
        totalRevenue: 68000,
        ltv: 120000,
        churnRisk: 0.3
      },
      {
        id: 'cust-004',
        name: 'Enterprise Client D',
        segment: 'Enterprise',
        totalRevenue: 62000,
        ltv: 180000,
        churnRisk: 0.15
      },
      {
        id: 'cust-005',
        name: 'Mid-Market Client E',
        segment: 'Mid-Market',
        totalRevenue: 48000,
        ltv: 135000,
        churnRisk: 0.25
      },
      {
        id: 'cust-006',
        name: 'Small Business F',
        segment: 'SMB',
        totalRevenue: 47000,
        ltv: 90000,
        churnRisk: 0.35
      }
    ];
  }

  /**
   * Get vendor spending details
   */
  async getVendorSpend(companyId: string, vendorId: string, period?: string): Promise<any> {
    const vendors = await this.getVendors(companyId);
    const vendor = vendors.find(v => v.id === vendorId);

    if (!vendor) {
      throw new Error(`Vendor ${vendorId} not found`);
    }

    return {
      vendorId,
      vendorName: vendor.name,
      totalSpend: vendor.totalSpend,
      transactions: [
        { date: '2024-10-15', amount: 12000, description: 'Monthly services' },
        { date: '2024-11-15', amount: 13000, description: 'Monthly services + extras' },
        { date: '2024-12-15', amount: 13000, description: 'Monthly services' }
      ],
      averageMonthly: vendor.totalSpend / 3
    };
  }

  /**
   * Get customer revenue details
   */
  async getCustomerRevenue(companyId: string, customerId: string, period?: string): Promise<any> {
    const customers = await this.getCustomers(companyId);
    const customer = customers.find(c => c.id === customerId);

    if (!customer) {
      throw new Error(`Customer ${customerId} not found`);
    }

    return {
      customerId,
      customerName: customer.name,
      totalRevenue: customer.totalRevenue,
      transactions: [
        { date: '2024-10-01', amount: 60000, service: 'Consulting' },
        { date: '2024-11-01', amount: 60000, service: 'Consulting' },
        { date: '2024-12-01', amount: 60000, service: 'Consulting' }
      ],
      averageMonthly: customer.totalRevenue / 3
    };
  }

  /**
   * Get key performance indicators
   */
  async getKPIs(companyId: string, period: string): Promise<KPIData[]> {
    const financials = await this.getFinancials(companyId, period);

    return [
      {
        name: 'Revenue Growth',
        value: 15,
        unit: '%',
        trend: 'up',
        change: 5
      },
      {
        name: 'Profit Margin',
        value: financials.profitMargin,
        unit: '%',
        trend: 'up',
        change: 4
      },
      {
        name: 'Customer Acquisition Cost',
        value: 8500,
        unit: '$',
        trend: 'down',
        change: -12
      },
      {
        name: 'Customer Lifetime Value',
        value: 185000,
        unit: '$',
        trend: 'up',
        change: 8
      },
      {
        name: 'Cash Runway',
        value: 18,
        unit: 'months',
        trend: 'stable',
        change: 0
      }
    ];
  }

  /**
   * Get performance trends over time
   */
  async getTrends(companyId: string, metric: string, periods: number = 12): Promise<any> {
    // Mock trend data
    const trendData: Record<string, any> = {
      revenue: {
        periods: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
        values: [400000, 435000, 465000, 500000]
      },
      profit: {
        periods: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
        values: [75000, 85000, 95000, 110000]
      },
      profitMargin: {
        periods: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
        values: [18.75, 19.54, 20.43, 22.00]
      },
      cashFlow: {
        periods: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
        values: [65000, 75000, 95000, 110000]
      }
    };

    return trendData[metric] || { periods: [], values: [] };
  }

  /**
   * Get industry benchmarks
   */
  async getBenchmarks(companyId: string, industry: string): Promise<any> {
    // Mock benchmark data
    return {
      industry,
      benchmarks: {
        profitMargin: {
          p25: 15,
          p50: 18,
          p75: 24,
          p90: 30
        },
        revenueGrowth: {
          p25: 8,
          p50: 12,
          p75: 18,
          p90: 25
        },
        customerConcentration: {
          p25: 15,
          p50: 25,
          p75: 35,
          p90: 45
        }
      }
    };
  }

  /**
   * Get comprehensive business insights
   * Combines multiple data sources for strategic analysis
   */
  async getBusinessInsights(companyId: string, period: string): Promise<BusinessInsights> {
    const [financials, vendors, customers, kpis, benchmarks] = await Promise.all([
      this.getFinancials(companyId, period),
      this.getVendors(companyId),
      this.getCustomers(companyId),
      this.getKPIs(companyId, period),
      this.getBenchmarks(companyId, 'professional-services')
    ]);

    // Calculate top vendors and customers
    const topVendors = vendors.slice(0, 3);
    const topCustomers = customers.slice(0, 3);

    // Assess performance vs benchmarks
    const profitMarginRating = this.getRating(
      financials.profitMargin,
      benchmarks.benchmarks.profitMargin
    );

    return {
      revenue: {
        current: financials.revenue,
        trend: 'up',
        change: 15,
        benchmark: 435000,
        rating: 'excellent'
      },
      profitMargin: {
        current: financials.profitMargin,
        trend: 'up',
        change: 4,
        benchmark: benchmarks.benchmarks.profitMargin.p50,
        rating: profitMarginRating
      },
      cashFlow: {
        current: financials.cashFlow,
        forecast: 125000,
        risk: 'low'
      },
      topVendors,
      topCustomers
    };
  }

  /**
   * Get rating based on percentile benchmarks
   */
  private getRating(value: number, benchmarks: any): 'excellent' | 'good' | 'fair' | 'poor' {
    if (value >= benchmarks.p75) return 'excellent';
    if (value >= benchmarks.p50) return 'good';
    if (value >= benchmarks.p25) return 'fair';
    return 'poor';
  }

  /**
   * Get company metadata
   */
  async getCompanyInfo(companyId: string): Promise<any> {
    // Mock company data
    return {
      id: companyId,
      name: 'Peak Performance Advisors',
      industry: 'professional-services',
      founded: '2019',
      employees: 12,
      location: 'Austin, TX'
    };
  }
}

// Export singleton instance
export const peakflowService = new PeakFlowService();
export default peakflowService;
