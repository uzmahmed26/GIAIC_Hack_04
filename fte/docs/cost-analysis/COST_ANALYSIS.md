# Cost Analysis — Course Companion FTE
**GIAIC Agent Factory Hackathon IV**

---

## Phase 1: Zero-Backend-LLM

### Infrastructure Costs (10,000 users/month)

| Component | Unit Cost | Monthly |
|-----------|-----------|---------|
| Cloudflare R2 | $0.015/GB + $0.36/M ops | $5 |
| Neon PostgreSQL | Free tier (up to 0.5GB) | $0 |
| Fly.io Compute | Shared CPU, 512MB RAM | $7 |
| Domain + SSL | $12/year | $1 |
| **Total** | | **$13/month** |
| **Cost per user** | | **$0.0013** |

> **ChatGPT costs: $0 to developer.**
> Users access via their own ChatGPT Plus subscription ($20/mo).
> Developer pays nothing for AI inference in Phase 1.

### Phase 1 Savings vs Human Tutor

| | Human Tutor | Phase 1 FTE |
|--|-------------|-------------|
| Monthly cost | $2,000–$5,000 | $13 |
| Students served | 20–50 | Unlimited |
| Hours/week | 40 | 168 |
| Cost per student | $100–$250 | $0.0013 |

**Savings: 99.7% cost reduction**

---

## Phase 2: Hybrid Intelligence

### LLM Costs (1,000 Pro users, 5 premium calls each/month)

| Feature | Model | Tokens/call | Cost/call | Monthly (5K calls) |
|---------|-------|-------------|-----------|-------------------|
| Adaptive Path | Claude Sonnet | 2,000 | $0.018 | $90 |
| LLM Assessment | Claude Sonnet | 1,500 | $0.014 | $70 |
| **Total LLM cost** | | | | **$160/month** |

### Token breakdown (Claude Sonnet pricing)
- Input: $3.00 per 1M tokens ($0.000003/token)
- Output: $15.00 per 1M tokens ($0.000015/token)

### Phase 2 Revenue vs Cost

| Metric | Value |
|--------|-------|
| Revenue — 1,000 Pro users × $19.99 | $19,990/month |
| LLM infrastructure cost | $160/month |
| LLM cost as % of revenue | **0.8%** |
| Gross margin | **99.2%** |

---

## Phase 3: Web App Additional Costs

| Component | Monthly |
|-----------|---------|
| Vercel frontend | $0 (Hobby free tier) |
| Clerk auth | $0 (free under 10K MAU) |
| **Additional cost** | **$0** |

---

## Total Cost Scaling

| Users | Monthly Cost | Revenue Potential | Margin |
|-------|-------------|-------------------|--------|
| 100 | $13 | $0–$999 | Variable |
| 1,000 | $20 | ~$10,000 | 99.8% |
| 10,000 | $45 | ~$100,000 | 99.95% |
| 100,000 | $200 | ~$1,000,000 | 99.98% |

---

## Key Insight

At 10,000 users our infrastructure cost is **$45/month**.

A single human tutor costs $2,000–$5,000/month and handles 20–50 students.
Course Companion FTE handles 10,000 students at $45/month.

| Metric | Human Tutor | Course Companion FTE |
|--------|-------------|----------------------|
| Cost per tutoring session | $25–$100 | $0.0045 |
| Hours available/day | 8 | 24 |
| Students served simultaneously | 1 | 10,000+ |
| Consistency | Variable | 100% |

**Cost per session reduction: 99%+**
**Availability increase: 3× (24/7 vs 8hr/day)**
**Concurrent capacity increase: 10,000×**

---

## Cost Protection — Constitutional Rule

Every Phase 2 LLM call is:
1. **Gated** — tier check fires before API call (free = 403, no tokens used)
2. **Logged** — `cost_logs` table records every call with tokens + cost_usd
3. **Auditable** — query `SELECT SUM(cost_usd) FROM cost_logs WHERE user_id = $1`

This ensures the 0.8% LLM cost ratio is maintained and never surprises.
