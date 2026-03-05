# Task: Rebuild Financial & Expense System (SGT PRO)

The user wants to rebuild the expense management from scratch to ensure accuracy. Key requirements include tracking cost per KM (per event and monthly averages), automatic balance deduction for all spending (fuel, maintenance, food), and detailed reporting of inflows (reloads) and outflows (spending).

## Phase 1: Storage & Logic Layer
- [ ] Review `prisma/schema.prisma` (already seems sufficient with `Expense`, `CardTransaction`, `FuelLog`, `Maintenance`).
- [ ] Standardize the "Spending" logic. Every record that costs money (Fuel, Maintenance, Expense with 'cartao') must:
    - [ ] Deduct from `Technician.saldo_atual`.
    - [ ] Create a `CardTransaction` with `tipo: 'gasto'`.
    - [ ] Link via `referencia` (e.g., `fuel:123`, `maint:456`).
- [ ] Create a new action `getMonthlyFinancialStats` in `actions/expenses.ts` to calculate:
    - [ ] Total spent per category.
    - [ ] Total reloaded.
    - [ ] Avg cost per KM (Total Fuel Cost / Total KM covered) per Month/Tech/Moto.

## Phase 2: Action Refactoring
- [ ] Refactor `actions/expenses.ts`:
    - [ ] Clean up redundant functions.
    - [ ] Ensure `delete` operations correctly REVERT the balance (Refund/Reverse).
- [ ] Validate `actions/fuel.ts` and `actions/maintenance.ts` to ensure they follow the new standardized spending pattern.

## Phase 3: Premium UI Dashboard (`app/despesas/page.tsx`)
- [ ] **Header:** Total Company Balance (Master Wallet) + Quick Actions (Add Funds, Reload Cards).
- [ ] **Summary Cards:** 
    - [ ] Current Month Spending.
    - [ ] Avg Cost/KM this month.
    - [ ] Total Pending Approvals (for refunds).
- [ ] **Main Layout:**
    - [ ] **Inflows vs Outflows Chart:** Visual representation of financial movement.
    - [ ] **Technician Balance Grid:** List of techs with current balances and "Quick Reload" buttons.
    - [ ] **Unified Transaction History:** Filterable list showing "Recarga", "Combustível", "Manutenção", "Alimentação".
- [ ] **Performance Audit:** 
    - [ ] Add the requested "Média de Gasto por KM no Mês" summary table.

## Phase 4: Reporting
- [ ] Enhance components to allow exporting/generating a "Financial Summary" for a given month.

## Verification Criteria
- [ ] Adding a Fuel entry reduces tech balance and appears in Transaction History.
- [ ] Deleting a Fuel entry REVERTS tech balance.
- [ ] Monthly avg cost/KM calculates correctly (Fuel Value / KM delta).
- [ ] UI reflects "SGT PRO" premium design (Dark theme, neon accents, glassmorphism).
