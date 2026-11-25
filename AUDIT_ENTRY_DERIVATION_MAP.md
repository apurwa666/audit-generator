# Audit report generator: entry vs derived-field design

This implementation uses `Durga Financial Report 2083.xlsx` as a **formula and reporting-layout reference**, not as a source of client-specific hard-coded balances. The sample workbook contains some hard-coded prior-year figures and several broken `#REF!` formulas; those must be reconciled by the auditor rather than copied into production logic.

## Entry fields (entered/imported from books, ledgers, invoices, tax records, or prior signed report)

### Entity / engagement
- Entity name, address, PAN, registration details, business type, accounting framework, reporting period and fiscal years.
- Auditor/firm details, report date/place, ICAN/COP and UDIN details.
- Opening balances imported from the prior year's signed financial statements/trial balance.

### Trading / operating records
- Sales and purchase totals when not linked to the VAT register.
- Opening stock and closing stock (or itemized stock rows: quantity and unit price).
- Freight/local transport and direct wages when they are part of cost of sales.
- Individual other-income items.
- Each expense ledger line, split by current and comparative year.
- Finance costs and finance income as distinct ledger lines (the current model combines some categories; see limitations below).

### Assets / liabilities / equity
- Fixed asset additions, disposals, opening gross cost/WDV, asset category, and prior-year balances from the fixed-asset register.
- Cash/bank balances, receivable/debtor balances, VAT receivable, advance tax, deposits/advances.
- Creditor balances, overdraft/short-term borrowing, other payables, TDS balances, accrued expenses and provisions.
- Capital, additional investment, drawings, share capital/reserves where applicable.
- VAT monthly return figures and payments; tax adjustments supported by the tax computation.

### Detail schedules
- Stock item description, quantity, unit and unit price.
- Individual debtor/creditor names and amounts.
- Payroll/leave/gratuity detail and asset register detail when those schedules are used.

## Derived fields (read-only; calculated from entries)

| Output / schedule | Formula reflected by the workbook |
|---|---|
| Stock line amount | `quantity × unit price` |
| Closing stock total | `SUM(item amounts)` |
| Debtors / creditors total | `SUM(individual party balances)` |
| Cost of goods available | `opening stock + purchases + direct freight + direct wages` |
| Cost of sales / COGS | `cost of goods available − closing stock` |
| Gross profit | `revenue from operations − cost of sales` |
| Total other income | `SUM(other-income ledger lines)` |
| Operating profit | `gross profit + other income − selling/distribution expenses − administrative expenses − other expenses` |
| Profit before tax | `operating profit − finance costs + finance income` |
| Taxable income | `book profit + tax add-backs − tax deductions` |
| Income tax provision | Taxable income × applicable rate/slabs, or explicitly entered manual provision |
| Net profit | `profit before tax − income tax provision` |
| Retained earnings / closing reserves | `opening retained earnings + current-year net profit − distributions/drawings` (entity-specific treatment required) |
| PPE closing net book value | `closing gross cost − accumulated depreciation/impairment` |
| Total non-current assets | `SUM(non-current asset lines)` |
| Total current assets | `SUM(current asset lines)` |
| Total assets | `non-current assets + current assets` |
| Total equity | `SUM(equity components)` |
| Total liabilities | `SUM(non-current liabilities + current liabilities)` |
| Total equity and liabilities | `total equity + total liabilities` |
| Balance check | `total assets − total equity and liabilities`; expected zero |
| Cash flow subtotals | Sum of operating, investing and financing cash flows; closing cash reconciles to statement of financial position |
| VAT totals | Sum monthly return values; net payable/receivable from output VAT, input VAT, payments and adjustments |

## Formula mapping from the provided workbook

- **SoFP**: totals in rows 22, 30, 31, 40, 48, 56, 58 and 59 are derived totals. PPE, inventory, receivables, tax balances, cash, capital and retained earnings are linked from detailed schedules.
- **SoPL**: gross profit (`D11-D12`), operating profit (`D14+D16-D17-D18-D19`), profit before tax (`D21-D23+D24`) and net profit (`D26-D28`) are derived.
- **SCF**: activity subtotals and net cash movement are sums/differences of underlying operating, investing and financing lines.
- **Notes 15–16**: sales, purchases, opening/closing stock and cost of sales; `COGS = opening stock + purchases − closing stock` plus any direct cost lines.
- **Stock**: each row amount is `quantity × price`, and total closing inventory is a sum of item amounts.
- **Debtors / Creditors**: party rows are entries; grand total is a sum.
- **Tax Calculation**: book profit is linked from P&L; depreciation, disallowed expenses, gratuity/leave adjustments and tax deductions feed taxable income; tax expense is derived from the applicable tax treatment.
- **PPE schedule**: additions/disposals and opening balances are entries; accumulated depreciation, depreciation expense and net book value are derived from the detailed asset movement schedule.

## Important safeguards / known model gaps

1. The workbook includes broken `#REF!` formulas and fixed numbers. Rebuild formulas from the intended accounting logic, not from those broken cells.
2. A previous-year depreciation figure cannot safely be inferred as 25% of previous-year net book value. It needs prior-year asset movement/depreciation detail. In this pass, the unsupported 25% estimate has been removed; comparative depreciation is set to zero because the existing data model has no reliable prior-year depreciation amount. Comparative prior-year profit therefore still needs the actual depreciation figure before a final report is issued.
3. Tax rates, thresholds, deductible items, and tax depreciation rules must be confirmed for the relevant entity and fiscal year by a Nepal tax professional. The workbook's tax sheet is not a complete legal specification.
4. For companies, retained earnings and proprietor drawings are not interchangeable. The current data model is oriented partly toward sole proprietorships; company-specific equity and cash-flow handling needs separate configuration.
5. VAT sales/purchase totals are used only when the user explicitly enables VAT-register totals. Avoid adding the same sales/purchases again as manual entries.
6. Every imported prior-year figure should be reviewed against the prior signed financial statements. A sample workbook's hard-coded values are not reusable defaults.
