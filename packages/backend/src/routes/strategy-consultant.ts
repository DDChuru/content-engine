/**
 * Strategy Consultant Agent Routes
 * AI-powered business strategy analysis with PeakFlow integration
 */

import express, { Request, Response } from 'express';
import { ClaudeService } from '../services/claude.js';
import { peakflowService } from '../services/peakflow.js';
import { powerPointGenerator } from '../services/powerpoint-generator.js';
import type {
  AnalysisRequest,
  AnalysisResponse,
  StrategySession,
  RFQRequest,
  Recommendation
} from '../types/strategy.js';

const router = express.Router();

// In-memory session storage (will be replaced with database)
const sessions = new Map<string, StrategySession>();

/**
 * System prompt for Strategy Consultant Agent
 */
const STRATEGY_CONSULTANT_PROMPT = `You are a strategic business consultant with expertise in financial analysis, operations optimization, and growth strategy. You have access to the client's complete financial and operational data through PeakFlow.

Your role is to:
1. Analyze business performance objectively
2. Identify opportunities and risks
3. Provide actionable recommendations
4. Prioritize by impact and effort
5. Use data to support every recommendation

Available data:
- Financial statements (P&L, balance sheet, cash flow)
- Vendor relationships and spending patterns
- Customer segments and revenue trends
- Industry benchmarks
- Historical performance

When analyzing:
- Always cite specific numbers from the data
- Compare to industry benchmarks
- Explain the "why" behind trends
- Quantify potential impact of recommendations
- Consider implementation feasibility

Output format:
- Executive summary (3-5 key insights)
- Detailed analysis by area
- Prioritized recommendations with:
  - Category (e.g., cost-optimization, growth, cash-flow)
  - Priority (high/medium/low)
  - Description (what to do)
  - Impact (quantified benefit)
  - Effort (low/medium/high)

Be concise, data-driven, and actionable. Focus on insights that drive business value.`;

/**
 * POST /api/strategy/analyze
 * Analyze business performance and generate strategic insights
 */
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { companyId, analysisType, period, focus }: AnalysisRequest = req.body;

    if (!companyId || !analysisType || !period) {
      return res.status(400).json({
        error: 'Missing required fields: companyId, analysisType, period'
      });
    }

    console.log(`[Strategy] Starting analysis for ${companyId}, period ${period}`);

    // Create session
    const sessionId = `analysis_${Date.now()}`;

    // Get data from PeakFlow
    const [insights, company, kpis, trends] = await Promise.all([
      peakflowService.getBusinessInsights(companyId, period),
      peakflowService.getCompanyInfo(companyId),
      peakflowService.getKPIs(companyId, period),
      peakflowService.getTrends(companyId, 'revenue')
    ]);

    // Prepare analysis context for Claude
    const analysisContext = `
Company: ${company.name}
Industry: ${company.industry}
Period: ${period}

Financial Performance:
- Revenue: $${insights.revenue?.current.toLocaleString()} (${insights.revenue?.trend} ${insights.revenue?.change}%)
- Profit Margin: ${insights.profitMargin?.current}% (Industry benchmark: ${insights.profitMargin?.benchmark}%)
- Cash Flow: $${insights.cashFlow?.current.toLocaleString()} (${insights.cashFlow?.risk} risk)

Top 3 Customers:
${insights.topCustomers?.map((c, i) => `${i + 1}. ${c.name}: $${c.totalRevenue.toLocaleString()} (${Math.round(c.totalRevenue / insights.revenue!.current * 100)}% of revenue)`).join('\n')}

Top 3 Vendors:
${insights.topVendors?.map((v, i) => `${i + 1}. ${v.name} (${v.category}): $${v.totalSpend.toLocaleString()}`).join('\n')}

Key Performance Indicators:
${kpis.map(kpi => `- ${kpi.name}: ${kpi.value}${kpi.unit} (${kpi.trend} ${kpi.change}%)`).join('\n')}

Revenue Trend:
${trends.periods.map((p: string, i: number) => `${p}: $${trends.values[i].toLocaleString()}`).join(', ')}

Analyze this business and provide:
1. Executive summary (3-5 key insights)
2. Strategic recommendations (5-7 specific actions with impact and effort estimates)
3. Risk assessment
4. Growth opportunities
`;

    // Get Claude's analysis
    const claudeService = new ClaudeService(process.env.ANTHROPIC_API_KEY!);
    const response = await claudeService.sendMessage(
      [{ role: 'user', content: analysisContext }],
      undefined,
      STRATEGY_CONSULTANT_PROMPT
    );

    // Parse recommendations from Claude's response
    const recommendations = parseRecommendations(response);

    // Create session
    const session: StrategySession = {
      sessionId,
      companyId,
      analysisType,
      period,
      insights,
      recommendations,
      conversationHistory: [
        { role: 'user', content: analysisContext },
        { role: 'assistant', content: response }
      ],
      createdAt: new Date()
    };

    sessions.set(sessionId, session);

    console.log(`[Strategy] Analysis complete: ${sessionId}`);

    const analysisResponse: AnalysisResponse = {
      sessionId,
      insights,
      recommendations
    };

    return res.json({
      ...analysisResponse,
      analysis: response,
      company: company.name
    });

  } catch (error) {
    console.error('[Strategy] Analysis failed:', error);
    return res.status(500).json({
      error: 'Failed to analyze business',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/strategy/generate-powerpoint
 * Generate PowerPoint presentation from analysis
 */
router.post('/generate-powerpoint', async (req: Request, res: Response) => {
  try {
    const { sessionId, template, title, audience } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Missing sessionId' });
    }

    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    console.log(`[Strategy] Generating PowerPoint for session ${sessionId}`);

    // Get company info
    const company = await peakflowService.getCompanyInfo(session.companyId);

    // Get trend data
    const [revenueTrends, profitTrends] = await Promise.all([
      peakflowService.getTrends(session.companyId, 'revenue'),
      peakflowService.getTrends(session.companyId, 'profit')
    ]);

    // Prepare PowerPoint data
    const pptData = {
      title: title || `${session.period} Strategic Analysis`,
      company: company.name,
      period: session.period,
      template: template || 'strategic-analysis',
      insights: session.insights,
      recommendations: session.recommendations,
      quarters: revenueTrends.periods,
      revenue_by_quarter: revenueTrends.values,
      profit_by_quarter: profitTrends.values,
      next_steps: [
        'Review and approve strategic recommendations',
        'Assign owners to priority initiatives',
        'Set up monthly performance review meetings',
        'Begin implementation of top 3 recommendations',
        'Schedule quarterly strategy review'
      ]
    };

    // Generate PowerPoint
    const result = await powerPointGenerator.generatePresentation(
      pptData,
      template || 'strategic-analysis'
    );

    console.log(`[Strategy] PowerPoint generated: ${result.path}`);

    return res.json({
      success: true,
      file: {
        path: result.path,
        slides: result.slides,
        template: result.template
      },
      sessionId
    });

  } catch (error) {
    console.error('[Strategy] PowerPoint generation failed:', error);
    return res.status(500).json({
      error: 'Failed to generate PowerPoint',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/strategy/generate-rfq
 * Generate RFQ/Proposal document
 */
router.post('/generate-rfq', async (req: Request, res: Response) => {
  try {
    const rfqRequest: RFQRequest = req.body;

    if (!rfqRequest.companyId || !rfqRequest.opportunity) {
      return res.status(400).json({
        error: 'Missing required fields: companyId, opportunity'
      });
    }

    console.log(`[Strategy] Generating RFQ for ${rfqRequest.opportunity.client}`);

    // Prepare RFQ data
    const pptData = {
      title: `Business Proposal for ${rfqRequest.opportunity.client}`,
      company: rfqRequest.opportunity.client,
      period: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      template: 'rfq-proposal' as const,
      opportunity: rfqRequest.opportunity,
      deliverables: rfqRequest.deliverables || [
        'Comprehensive business assessment',
        'Strategic recommendations',
        'Implementation roadmap',
        'Ongoing support'
      ],
      includePricing: rfqRequest.includePricing,
      pricing: rfqRequest.pricing
    };

    // Generate PowerPoint
    const result = await powerPointGenerator.generateRFQProposal(pptData);

    console.log(`[Strategy] RFQ generated: ${result.path}`);

    return res.json({
      success: true,
      document: {
        path: result.path,
        slides: result.slides
      }
    });

  } catch (error) {
    console.error('[Strategy] RFQ generation failed:', error);
    return res.status(500).json({
      error: 'Failed to generate RFQ',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/strategy/chat
 * Conversational strategy consulting
 */
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: 'Missing sessionId or message' });
    }

    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    console.log(`[Strategy] Chat message for session ${sessionId}`);

    // Add user message to history
    session.conversationHistory.push({
      role: 'user',
      content: message
    });

    // Get Claude's response
    const claudeService = new ClaudeService(process.env.ANTHROPIC_API_KEY!);
    const response = await claudeService.sendMessage(
      session.conversationHistory,
      undefined,
      STRATEGY_CONSULTANT_PROMPT
    );

    // Add assistant response to history
    session.conversationHistory.push({
      role: 'assistant',
      content: response
    });

    // Update session
    sessions.set(sessionId, session);

    return res.json({
      reply: response,
      sessionId
    });

  } catch (error) {
    console.error('[Strategy] Chat failed:', error);
    return res.status(500).json({
      error: 'Chat failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/strategy/session/:sessionId
 * Get session details
 */
router.get('/session/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    return res.json(session);

  } catch (error) {
    console.error('[Strategy] Failed to get session:', error);
    return res.status(500).json({
      error: 'Failed to get session',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/strategy/demo
 * Generate demo strategic analysis and PowerPoint
 */
router.post('/demo', async (req: Request, res: Response) => {
  try {
    console.log('[Strategy] Generating demo analysis...');

    // Use sample data
    const companyId = 'demo-company-001';
    const period = 'Q4 2024';

    // Create demo session
    const sessionId = `demo_${Date.now()}`;

    const insights = await peakflowService.getBusinessInsights(companyId, period);

    const recommendations: Recommendation[] = [
      {
        category: 'customer-diversification',
        priority: 'high',
        description: 'Reduce concentration risk - Top customer represents 36% of revenue. Target 3 new enterprise clients.',
        impact: 'Reduce revenue volatility by 25%',
        effort: 'high'
      },
      {
        category: 'cost-optimization',
        priority: 'high',
        description: 'Consolidate vendor spending - Negotiate volume discounts.',
        impact: 'Save $15k annually',
        effort: 'medium'
      },
      {
        category: 'pricing',
        priority: 'medium',
        description: 'Increase pricing for SMB segment by 8%.',
        impact: 'Add $5.4k monthly revenue',
        effort: 'low'
      }
    ];

    const session: StrategySession = {
      sessionId,
      companyId,
      analysisType: 'quarterly',
      period,
      insights,
      recommendations,
      conversationHistory: [],
      createdAt: new Date()
    };

    sessions.set(sessionId, session);

    // Generate PowerPoint
    const pptData = powerPointGenerator.createSampleStrategicData('Peak Performance Advisors');
    const pptResult = await powerPointGenerator.generateStrategicAnalysis(pptData);

    console.log('[Strategy] Demo complete!');

    return res.json({
      success: true,
      sessionId,
      insights,
      recommendations,
      powerpoint: {
        path: pptResult.path,
        slides: pptResult.slides
      },
      message: 'Demo strategic analysis and PowerPoint generated successfully!'
    });

  } catch (error) {
    console.error('[Strategy] Demo failed:', error);
    return res.status(500).json({
      error: 'Demo failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Parse recommendations from Claude's response
 */
function parseRecommendations(analysisText: string): Recommendation[] {
  // Simple parsing - will be enhanced with more sophisticated extraction
  const recommendations: Recommendation[] = [];

  // Look for numbered recommendations
  const lines = analysisText.split('\n');
  let currentRec: Partial<Recommendation> | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Look for category headers or numbered items
    if (trimmed.match(/^\d+\./)) {
      if (currentRec && currentRec.description) {
        recommendations.push(currentRec as Recommendation);
      }

      currentRec = {
        description: trimmed.replace(/^\d+\./, '').trim(),
        priority: 'medium',
        effort: 'medium',
        impact: 'TBD',
        category: 'general'
      };
    } else if (currentRec && trimmed.toLowerCase().includes('impact')) {
      currentRec.impact = trimmed;
    } else if (currentRec && trimmed.toLowerCase().includes('effort')) {
      if (trimmed.toLowerCase().includes('high')) currentRec.effort = 'high';
      if (trimmed.toLowerCase().includes('low')) currentRec.effort = 'low';
    }
  }

  if (currentRec && currentRec.description) {
    recommendations.push(currentRec as Recommendation);
  }

  // If no recommendations were parsed, return defaults
  if (recommendations.length === 0) {
    return [
      {
        category: 'analysis',
        priority: 'high',
        description: 'Review detailed analysis and identify key action items',
        impact: 'Strategic clarity',
        effort: 'low'
      }
    ];
  }

  return recommendations;
}

export default router;
