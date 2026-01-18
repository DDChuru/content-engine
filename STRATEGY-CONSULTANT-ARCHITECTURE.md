# Strategy Consultant Agent - Architecture

**Date:** 2025-10-24
**Status:** Design Phase
**Part of:** 30 Agents in 30 Days (Agent #4)

---

## Vision

An AI agent that analyzes business performance using **PeakFlow accounting data** and generates:
- Strategic recommendations
- Professional PowerPoint presentations
- RFQ/Proposal documents
- Competitive intelligence reports

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     AI Operating System                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐      ┌──────────────┐      ┌───────────┐ │
│  │   PeakFlow   │─────▶│   Strategy   │─────▶│ PowerPoint│ │
│  │     Data     │      │  Consultant  │      │ Generator │ │
│  │   (Source)   │      │    Agent     │      │  (Output) │ │
│  └──────────────┘      └──────────────┘      └───────────┘ │
│         │                     │                     │        │
│         │                     │                     │        │
│    Financials              Claude AI           Professional │
│    Vendors/Customers       Analysis            Documents    │
│    Performance             Insights                         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. Capture Layer (PeakFlow)
**Day-to-day operations:**
- Invoices, expenses, payments
- Vendor relationships
- Customer transactions
- Chart of accounts mapping
- Debtor/creditor records

### 2. Intelligence Layer (Strategy Consultant Agent)
**Periodic analysis:**
- Financial performance trends
- Profitability analysis
- Cash flow forecasting
- Vendor optimization
- Customer segmentation
- Competitive positioning

### 3. Action Layer (Document Generation)
**Strategic outputs:**
- PowerPoint presentations
- RFQ documents
- Proposal templates
- Board reports
- Investor updates

---

## Components

### 1. PeakFlow Service (`src/services/peakflow.ts`)

**Purpose:** Interface to PeakFlow accounting database

**Methods:**
```typescript
class PeakFlowService {
  // Financial data
  async getFinancials(companyId: string, period: string)
  async getProfitAndLoss(companyId: string, period: string)
  async getBalanceSheet(companyId: string, date: string)
  async getCashFlow(companyId: string, period: string)

  // Relationships
  async getVendors(companyId: string)
  async getCustomers(companyId: string)
  async getVendorSpend(companyId: string, vendorId: string)
  async getCustomerRevenue(companyId: string, customerId: string)

  // Performance
  async getKPIs(companyId: string, period: string)
  async getTrends(companyId: string, metric: string)
  async getBenchmarks(companyId: string, industry: string)
}
```

**Data Structure:**
```typescript
interface FinancialData {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  profitMargin: number;
  cashFlow: number;
}

interface VendorData {
  id: string;
  name: string;
  category: string;
  totalSpend: number;
  paymentTerms: string;
  performanceScore: number;
}

interface CustomerData {
  id: string;
  name: string;
  segment: string;
  totalRevenue: number;
  ltv: number;
  churnRisk: number;
}
```

---

### 2. PowerPoint Generator (`src/services/powerpoint-generator.ts`)

**Purpose:** Create professional slide decks with charts and data

**Technology:** Python script using `python-pptx`

**Template Types:**
- Strategic Analysis (18 slides)
- RFQ Proposal (12 slides)
- Board Report (10 slides)
- Investor Update (15 slides)

**Slide Components:**
```python
# Title Slide
# Executive Summary
# Financial Overview (charts)
# Performance Trends (line graphs)
# Customer Analysis (pie charts)
# Vendor Analysis (bar charts)
# Strategic Recommendations (bullet points)
# Action Plan (timeline)
# Financial Projections (tables)
# Risk Assessment (matrix)
# Next Steps (checklist)
```

**Features:**
- Professional templates (corporate colors)
- Auto-generated charts from data
- MathJax-style financial formulas
- Branded footer with date/company
- Speaker notes for each slide

---

### 3. Strategy Consultant Route (`src/routes/strategy-consultant.ts`)

**Purpose:** API endpoints for strategic analysis

**Endpoints:**

#### `POST /api/strategy/analyze`
Analyze business performance with PeakFlow data

**Request:**
```json
{
  "companyId": "peak-advisors-123",
  "analysisType": "quarterly" | "annual" | "custom",
  "period": "2024-Q4",
  "focus": ["profitability", "cash-flow", "vendors", "customers"]
}
```

**Response:**
```json
{
  "sessionId": "analysis_1761300000000",
  "insights": {
    "revenue": { "current": 500000, "trend": "up", "change": 15 },
    "profitMargin": { "current": 22, "benchmark": 18, "rating": "excellent" },
    "cashFlow": { "current": 75000, "forecast": 85000, "risk": "low" },
    "topVendors": [...],
    "topCustomers": [...]
  },
  "recommendations": [
    {
      "category": "cost-optimization",
      "priority": "high",
      "description": "Consolidate vendor spending...",
      "impact": "Save $15k annually",
      "effort": "medium"
    }
  ]
}
```

#### `POST /api/strategy/generate-powerpoint`
Generate professional PowerPoint presentation

**Request:**
```json
{
  "sessionId": "analysis_1761300000000",
  "template": "strategic-analysis",
  "title": "Q4 2024 Strategic Review",
  "audience": "board" | "investors" | "management"
}
```

**Response:**
```json
{
  "success": true,
  "file": {
    "path": "output/strategy/Q4_2024_Strategic_Review.pptx",
    "slides": 18,
    "size": "2.3 MB"
  },
  "downloadUrl": "/api/strategy/download/..."
}
```

#### `POST /api/strategy/generate-rfq`
Generate RFQ/Proposal document

**Request:**
```json
{
  "companyId": "peak-advisors-123",
  "opportunity": {
    "client": "Acme Corp",
    "service": "Financial advisory",
    "budget": 50000,
    "timeline": "6 months"
  },
  "includePricing": true
}
```

**Response:**
```json
{
  "success": true,
  "document": {
    "path": "output/rfq/Acme_Corp_Proposal.pptx",
    "sections": [
      "Executive Summary",
      "Our Approach",
      "Deliverables",
      "Pricing",
      "Timeline",
      "Team",
      "Case Studies",
      "Terms"
    ]
  }
}
```

#### `POST /api/strategy/chat`
Conversational strategy consulting (like Video Director)

**Request:**
```json
{
  "sessionId": "analysis_1761300000000",
  "message": "What's driving our profit margin increase?"
}
```

**Response:**
```json
{
  "reply": "Your profit margin increased from 18% to 22% due to...",
  "data": {
    "factors": [
      { "name": "Revenue growth", "impact": 40 },
      { "name": "Cost reduction", "impact": 35 },
      { "name": "Mix shift", "impact": 25 }
    ]
  },
  "suggestions": [
    "Would you like me to create a presentation showing this breakdown?",
    "Should we analyze which customers contributed most to this?"
  ]
}
```

---

### 4. Document Templates

**Strategic Analysis Template:**
```
Slide 1:  Title - "Q4 2024 Strategic Analysis"
Slide 2:  Executive Summary - Key metrics at a glance
Slide 3:  Financial Overview - Revenue, profit, cash flow
Slide 4:  Performance vs Target - Variance analysis
Slide 5:  Revenue Trends - 12-month line chart
Slide 6:  Expense Breakdown - Category pie chart
Slide 7:  Profit Margin Analysis - Comparison bar chart
Slide 8:  Cash Flow Forecast - 6-month projection
Slide 9:  Customer Segmentation - Top 10 customers
Slide 10: Customer Concentration - Risk assessment
Slide 11: Vendor Analysis - Top 10 vendors
Slide 12: Vendor Optimization - Savings opportunities
Slide 13: Strategic Recommendations - Prioritized list
Slide 14: Implementation Plan - Timeline gantt chart
Slide 15: Risk Assessment - Risk matrix
Slide 16: Financial Projections - 12-month forecast
Slide 17: Next Steps - Action checklist
Slide 18: Appendix - Detailed data tables
```

**RFQ/Proposal Template:**
```
Slide 1:  Cover - Professional title page
Slide 2:  Executive Summary - Value proposition
Slide 3:  Understanding Your Needs - Client analysis
Slide 4:  Our Approach - Methodology
Slide 5:  Scope of Work - Deliverables
Slide 6:  Timeline - Project phases
Slide 7:  Team - Key personnel
Slide 8:  Case Studies - Relevant experience
Slide 9:  Pricing - Fee structure
Slide 10: Value Delivered - ROI analysis
Slide 11: Terms & Conditions - Contract details
Slide 12: Next Steps - How to proceed
```

---

## Integration with PeakFlow

### Phase 1: Mock Data (Immediate)
```typescript
// Use sample financial data for testing
const mockFinancials = {
  revenue: 500000,
  expenses: 390000,
  profit: 110000,
  profitMargin: 22
};
```

### Phase 2: Database Integration (Week 2)
```typescript
// Connect to PeakFlow PostgreSQL database
import { Pool } from 'pg';

const peakflowDB = new Pool({
  host: process.env.PEAKFLOW_DB_HOST,
  database: process.env.PEAKFLOW_DB_NAME,
  user: process.env.PEAKFLOW_DB_USER,
  password: process.env.PEAKFLOW_DB_PASSWORD
});

async getFinancials(companyId: string) {
  const result = await peakflowDB.query(`
    SELECT
      SUM(CASE WHEN account_type = 'revenue' THEN amount ELSE 0 END) as revenue,
      SUM(CASE WHEN account_type = 'expense' THEN amount ELSE 0 END) as expenses
    FROM transactions
    WHERE company_id = $1 AND date >= $2 AND date <= $3
  `, [companyId, startDate, endDate]);

  return result.rows[0];
}
```

### Phase 3: Real-time Sync (Week 3)
```typescript
// WebSocket connection for live data updates
import { io } from 'socket.io-client';

const peakflowSocket = io(process.env.PEAKFLOW_WS_URL);

peakflowSocket.on('transaction', (data) => {
  // Update analysis in real-time
  updateAnalysis(data);
});
```

---

## PowerPoint Generation Implementation

### Python Script (`scripts/generate-powerpoint.py`)

```python
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE
import json
import sys

def create_strategic_analysis(data, output_path):
    prs = Presentation()
    prs.slide_width = Inches(16)
    prs.slide_height = Inches(9)

    # Title Slide
    title_slide = prs.slides.add_slide(prs.slide_layouts[0])
    title = title_slide.shapes.title
    title.text = data['title']
    subtitle = title_slide.placeholders[1]
    subtitle.text = data['company'] + " | " + data['period']

    # Executive Summary
    summary_slide = prs.slides.add_slide(prs.slide_layouts[1])
    summary_slide.shapes.title.text = "Executive Summary"

    # Financial Overview with Chart
    chart_slide = prs.slides.add_slide(prs.slide_layouts[5])
    chart_slide.shapes.title.text = "Financial Performance"

    # Create chart
    chart_data = CategoryChartData()
    chart_data.categories = ['Q1', 'Q2', 'Q3', 'Q4']
    chart_data.add_series('Revenue', data['revenue_by_quarter'])
    chart_data.add_series('Profit', data['profit_by_quarter'])

    x, y, cx, cy = Inches(2), Inches(2), Inches(6), Inches(4)
    chart = chart_slide.shapes.add_chart(
        XL_CHART_TYPE.COLUMN_CLUSTERED, x, y, cx, cy, chart_data
    ).chart

    # ... more slides ...

    prs.save(output_path)
    print(json.dumps({"success": True, "path": output_path}))

if __name__ == "__main__":
    data = json.loads(sys.argv[1])
    output_path = sys.argv[2]
    create_strategic_analysis(data, output_path)
```

### Node.js Service Wrapper

```typescript
import { spawn } from 'child_process';
import path from 'path';

class PowerPointGenerator {
  async generatePresentation(data: any, template: string): Promise<string> {
    const outputPath = path.join(
      process.cwd(),
      'output',
      'strategy',
      `${data.title.replace(/\s+/g, '_')}.pptx`
    );

    return new Promise((resolve, reject) => {
      const python = spawn('python3', [
        'scripts/generate-powerpoint.py',
        JSON.stringify(data),
        outputPath
      ]);

      let result = '';
      python.stdout.on('data', (data) => {
        result += data.toString();
      });

      python.on('close', (code) => {
        if (code === 0) {
          const parsed = JSON.parse(result);
          resolve(parsed.path);
        } else {
          reject(new Error('PowerPoint generation failed'));
        }
      });
    });
  }
}
```

---

## AI Analysis Patterns

### Claude System Prompt for Strategy Consultant

```
You are a strategic business consultant with expertise in financial analysis,
operations optimization, and growth strategy. You have access to the client's
complete financial and operational data through PeakFlow.

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
- Prioritized recommendations
- Implementation roadmap
- Risk assessment
```

### Example Analysis Flow

```typescript
const analysis = await claude.sendMessage([
  {
    role: 'user',
    content: `Analyze this business performance:

    Financial Data:
    - Revenue: $500k (Q4 2024)
    - Previous Quarter: $435k (Q3 2024)
    - Expenses: $390k
    - Profit: $110k
    - Profit Margin: 22%

    Top 3 Vendors:
    1. Office Supplies Inc: $45k (frequent small orders)
    2. IT Services Co: $38k (monthly retainer)
    3. Marketing Agency: $32k (project-based)

    Top 3 Customers:
    1. Enterprise Client A: $180k (40% of revenue)
    2. Mid-Market Client B: $95k
    3. Small Business C: $68k

    Industry: Professional Services
    Benchmark Profit Margin: 18%

    Provide strategic recommendations.`
  }
], undefined, strategyConsultantPrompt);

// Claude's response will include:
// - Customer concentration risk analysis
// - Vendor consolidation opportunities
// - Profitability improvement strategies
// - Growth recommendations
```

---

## Cost Estimates

### Per Analysis
- **PeakFlow data fetch:** Free (our database)
- **Claude analysis:** ~$0.15 (strategic reasoning)
- **PowerPoint generation:** Free (python-pptx)
- **Total:** ~$0.15

### Volume Pricing
- 10 analyses: $1.50
- 100 analyses: $15
- 1000 analyses: $150

### Compared to Consultants
- McKinsey strategic review: $50,000+
- Local consultant: $5,000-15,000
- **Our system:** $0.15 + human review

**ROI:** 99.9% cost reduction with 24/7 availability

---

## Success Metrics

### Technical
- [ ] PeakFlow integration working
- [ ] PowerPoint generation successful
- [ ] End-to-end API flow complete
- [ ] Data accuracy validated

### Business
- [ ] Analysis insights are actionable
- [ ] Recommendations are specific
- [ ] Presentations are professional
- [ ] Users adopt for strategic planning

### Scale
- [ ] Can analyze 100+ companies
- [ ] Sub-2-minute response time
- [ ] Professional-quality output
- [ ] Integration with existing workflows

---

## Development Phases

### Phase 1: MVP (Days 1-2)
- [x] Architecture design
- [ ] Mock PeakFlow data
- [ ] Basic PowerPoint generation
- [ ] Simple analysis endpoint
- [ ] Test with sample company

### Phase 2: Polish (Days 3-4)
- [ ] Professional templates
- [ ] Chart generation
- [ ] RFQ/Proposal templates
- [ ] Conversational interface
- [ ] Real PeakFlow integration

### Phase 3: Scale (Days 5-7)
- [ ] Multi-company support
- [ ] Historical analysis
- [ ] Benchmark database
- [ ] Automated reporting
- [ ] Dashboard UI

---

## Next Steps

1. **Install python-pptx:**
   ```bash
   pip3 install python-pptx
   ```

2. **Create PeakFlow service with mock data**

3. **Create PowerPoint generator script**

4. **Implement strategy-consultant route**

5. **Test end-to-end flow**

6. **Generate first strategic analysis**

---

## Files to Create

```
packages/backend/
├── src/
│   ├── routes/
│   │   └── strategy-consultant.ts       (NEW)
│   ├── services/
│   │   ├── peakflow.ts                  (NEW)
│   │   └── powerpoint-generator.ts      (NEW)
│   └── types/
│       └── strategy.ts                  (NEW)
├── scripts/
│   └── generate-powerpoint.py           (NEW)
└── output/
    └── strategy/                        (NEW)
```

---

**Status:** Architecture complete, ready for implementation!
**Next:** Create PeakFlow service and PowerPoint generator
**Goal:** First strategic analysis by end of day!
