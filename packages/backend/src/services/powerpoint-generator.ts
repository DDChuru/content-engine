/**
 * PowerPoint Generator Service
 * Wraps Python script for generating professional slide decks
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import type { PowerPointData, PowerPointResult } from '../types/strategy.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PowerPointGenerator {
  private scriptsDir: string;
  private outputDir: string;

  constructor() {
    this.scriptsDir = path.join(__dirname, '../../scripts');
    this.outputDir = path.join(__dirname, '../../output/strategy');
  }

  /**
   * Generate PowerPoint presentation from data
   */
  async generatePresentation(
    data: PowerPointData,
    template: 'strategic-analysis' | 'rfq-proposal' = 'strategic-analysis'
  ): Promise<PowerPointResult> {
    try {
      // Prepare output filename
      const timestamp = Date.now();
      const safeName = data.title.replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `${safeName}_${timestamp}.pptx`;
      const outputPath = path.join(this.outputDir, filename);

      // Prepare data for Python script
      const scriptData = {
        ...data,
        template
      };

      console.log(`[PowerPoint] Generating ${template} presentation: ${filename}`);

      // Execute Python script
      const result = await this.executePythonScript(scriptData, outputPath);

      console.log(`[PowerPoint] Generated successfully: ${outputPath}`);

      return result;
    } catch (error) {
      console.error('[PowerPoint] Generation failed:', error);
      throw error;
    }
  }

  /**
   * Generate strategic analysis presentation
   */
  async generateStrategicAnalysis(data: PowerPointData): Promise<PowerPointResult> {
    return this.generatePresentation(data, 'strategic-analysis');
  }

  /**
   * Generate RFQ/Proposal presentation
   */
  async generateRFQProposal(data: PowerPointData): Promise<PowerPointResult> {
    return this.generatePresentation(data, 'rfq-proposal');
  }

  /**
   * Execute Python PowerPoint generation script
   */
  private executePythonScript(
    data: PowerPointData,
    outputPath: string
  ): Promise<PowerPointResult> {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(this.scriptsDir, 'generate-powerpoint.py');
      const dataJson = JSON.stringify(data);

      const python = spawn('python3', [scriptPath, dataJson, outputPath]);

      let stdout = '';
      let stderr = '';

      python.stdout.on('data', (chunk) => {
        stdout += chunk.toString();
      });

      python.stderr.on('data', (chunk) => {
        stderr += chunk.toString();
      });

      python.on('close', (code) => {
        if (code === 0) {
          try {
            const result: PowerPointResult = JSON.parse(stdout.trim());
            resolve(result);
          } catch (error) {
            reject(new Error(`Failed to parse Python output: ${stdout}`));
          }
        } else {
          reject(new Error(`Python script failed (code ${code}): ${stderr}`));
        }
      });

      python.on('error', (error) => {
        reject(new Error(`Failed to spawn Python process: ${error.message}`));
      });
    });
  }

  /**
   * Create sample strategic analysis data for testing
   */
  createSampleStrategicData(companyName: string = 'Peak Performance Advisors'): PowerPointData {
    return {
      title: 'Q4 2024 Strategic Analysis',
      company: companyName,
      period: 'Q4 2024',
      template: 'strategic-analysis',
      insights: {
        revenue: {
          current: 500000,
          trend: 'up',
          change: 15,
          benchmark: 450000,
          rating: 'excellent'
        },
        profitMargin: {
          current: 22,
          trend: 'up',
          change: 4,
          benchmark: 18,
          rating: 'excellent'
        },
        cashFlow: {
          current: 110000,
          forecast: 125000,
          risk: 'low'
        },
        topCustomers: [
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
            id: 'others',
            name: 'Others',
            segment: 'Various',
            totalRevenue: 157000,
            ltv: 300000,
            churnRisk: 0.25
          }
        ],
        topVendors: [
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
          }
        ]
      },
      recommendations: [
        {
          category: 'customer-diversification',
          priority: 'high',
          description: 'Reduce concentration risk - Top customer represents 36% of revenue. Target 3 new enterprise clients to balance portfolio.',
          impact: 'Reduce revenue volatility by 25%',
          effort: 'high'
        },
        {
          category: 'cost-optimization',
          priority: 'high',
          description: 'Consolidate vendor spending - Negotiate volume discounts by reducing vendor count from 15 to 8 strategic partners.',
          impact: 'Save $15k annually (3.8% expense reduction)',
          effort: 'medium'
        },
        {
          category: 'profitability',
          priority: 'medium',
          description: 'Increase pricing for SMB segment - Currently 12% below market rate. Gradual 8% increase over 2 quarters.',
          impact: 'Add $5.4k monthly revenue',
          effort: 'low'
        },
        {
          category: 'cash-flow',
          priority: 'medium',
          description: 'Improve payment terms - 40% of receivables over 45 days. Implement automated reminders and early payment incentives.',
          impact: 'Improve cash conversion by 15 days',
          effort: 'low'
        },
        {
          category: 'growth',
          priority: 'low',
          description: 'Expand service offerings - Customer surveys show demand for tax planning services. Pilot program with existing clients.',
          impact: 'Potential 20% revenue uplift',
          effort: 'high'
        }
      ],
      quarters: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
      revenue_by_quarter: [400000, 435000, 465000, 500000],
      profit_by_quarter: [75000, 85000, 95000, 110000],
      next_steps: [
        'Review and approve strategic recommendations',
        'Schedule customer diversification planning session',
        'Begin vendor consolidation analysis',
        'Implement payment terms improvement program',
        'Set up monthly performance review meetings'
      ]
    };
  }

  /**
   * Create sample RFQ proposal data for testing
   */
  createSampleRFQData(clientName: string = 'Acme Corporation'): PowerPointData {
    return {
      title: `Business Consulting Proposal for ${clientName}`,
      company: clientName,
      period: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      template: 'rfq-proposal',
      opportunity: {
        client: clientName,
        service: 'Strategic Business Consulting',
        budget: 50000,
        timeline: '6 months'
      },
      deliverables: [
        'Comprehensive business assessment and gap analysis',
        'Strategic roadmap with 18-month implementation plan',
        'Financial modeling and scenario planning',
        'Vendor optimization and cost reduction analysis',
        'Customer segmentation and growth strategy',
        'Monthly progress reviews and adjustments',
        'Executive summary reports for stakeholders',
        'Training and knowledge transfer sessions'
      ],
      includePricing: true,
      pricing: {
        services: 35000,
        support: 10000,
        training: 5000
      }
    };
  }
}

// Export singleton instance
export const powerPointGenerator = new PowerPointGenerator();
export default powerPointGenerator;
