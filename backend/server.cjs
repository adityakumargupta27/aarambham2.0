/**
 * AARAMBHA Backend Express Server (CommonJS Mirror)
 */
const express = require('express');
const { calculateDeterministicRisk } = require('./riskEngine.cjs');
const { processGroundedQuery } = require('./aiInvestigator.cjs');

const app = express();
app.use(express.json());

app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString(), version: '2.0.0-grounded' });
});

app.post('/api/v1/ai/query', (req, res) => {
  const { question = '' } = req.body || {};
  const result = processGroundedQuery(question);
  res.json(result);
});

app.post('/api/v1/risk/calculate', (req, res) => {
  const result = calculateDeterministicRisk(req.body || {});
  res.json(result);
});

module.exports = app;
