# Tests

## Running Tests

```bash
npm test
```

## Test Files

### `src/__tests__/auditEngine.test.ts`
Covers the core audit engine logic.

| Test | Description |
|------|-------------|
| Cursor Business 2 seats → downgrade | Verifies overspending detected for small teams on Business plan |
| Cursor Pro 1 seat → optimal | Verifies right-sized plans are not flagged |
| GitHub Copilot Business 3 seats → downgrade | Verifies small team overspend detection |
| Claude Max writing use case → downgrade | Verifies use-case mismatch detection |
| Duplicate coding tools → consolidate | Verifies multiple coding assistants flagged |
| Total savings calculation | Verifies totalMonthlySavings sums correctly |
| Zero savings optimal result | Verifies optimal spend returns 0 savings |