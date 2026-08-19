# 📄 Product Requirements Document (PRD)

**Project Name:** Stock-Tracker App  
**Document Status:** Approved  
**Author:** Shahidul Islam  
**Target Release Date:** Q3 2026 / 2026-08-31  
**Last Updated:** 2026-08-14  

---

## 1. 🎯 Overview & Purpose

### 1.1 Executive Summary
The Stock Tracker App is a modern full-stack web application designed for small-to-medium businesses and retail shops. It provides accurate management of inventory, stock-in operations, stock-out events (Sales, Damage, Lost), and category/company master setups. The application maintains real-time stock integrity and provides instant summary insights alongside date-filtered sales reporting.

### 1.2 Problem Statement
* **Current Issues:** Shop owners currently rely on manual register books or loose spreadsheets. This leads to frequent calculation errors during sales and losses, lack of visibility into reorder thresholds, and mismatched inventory counts.
* **Impact:** Businesses face inventory shortages, inaccurate stock records, and spend excessive time calculating daily sales and loss totals.

### 1.3 Business Value & Why Now?
* **Why Now:** Digitizing inventory tracking eliminates manual entry loss and ensures real-time stock updates required for purchasing decisions.
* **Business Goals:** Save operational time and costs through automated stock deductions, duplicate entry prevention, and accurate date-wise sales reporting.

---

## 2. 👥 Target Audience & User Personas

| Persona Name | Role / Description | Main Need / Pain Point |
| :--- | :--- | :--- |
| **System Admin** | Primary Store Owner or Manager | Needs single-point control to set up categories, companies, and items, execute stock entries, and review financial/sales reports. |

---

## 3. 🚀 Scope of Work

### 3.1 In-Scope (v1.0 Deliverables)
* **Single Admin Authentication:** Secure login using Email and Password with JWT token verification.
* **Master Setup:** Category, Company, and Item creation/updating with Unique Name validation.
* **Stock Operations:** Stock In entries and Stock Out processing (Sell, Damage, Lost) featuring a real-time temporary cart grid.
* **Reports:** Filterable Item Summary Report and Date-range Sales Report.

### 3.2 Out-of-Scope (Future Iterations)
* Multi-user role management or staff access control.
* Barcode scanner integration and receipt thermal printing.
* Automated SMS or Email notification system.

---

## 4. ⚙️ Functional Requirements

### Priority Levels:
* **P0 (Must Have):** Core functionality required for release.
* **P1 (Should Have):** Important business reporting features.
* **P2 (Nice to Have):** Non-critical enhancements.

---

### Feature 1: Admin Authentication System
* **Priority:** P0  
* **User Story:**  
  > *As an* Admin,  
  > *I want to* log in securely using my seeded credentials,  
  > *So that* unauthorized users cannot access or tamper with stock data.

* **Acceptance Criteria:**
  - [ ] **AC 1:** Admin can authenticate via seeded credentials, returning a signed JWT HTTP-only cookie or token.
  - [ ] **AC 2:** Invalid credentials trigger a clear "Invalid credentials" error response.
  - [ ] **AC 3:** Unauthenticated requests to protected API endpoints or UI routes are blocked and redirected to `/login`.

---

### Feature 2: Category & Company Setup
* **Priority:** P0  
* **User Story:**  
  > *As an* Admin,  
  > *I want to* manage unique categories and companies,  
  > *So that* I can organize inventory items logically.

* **Acceptance Criteria:**
  - [ ] **AC 1:** Category Name and Company Name must be strictly unique (return 400 bad request on duplicates).
  - [ ] **AC 2:** Admin can update/edit any existing category name.
  - [ ] **AC 3:** Display a data table listing all existing categories and companies.

---

### Feature 3: Item Setup
* **Priority:** P0  
* **User Story:**  
  > *As an* Admin,  
  > *I want to* create unique items under specific Categories and Companies with reorder levels,  
  > *So that* I can monitor minimum stock thresholds.

* **Acceptance Criteria:**
  - [ ] **AC 1:** Items are created by selecting Category and Company from dropdowns. Item names must be unique.
  - [ ] **AC 2:** Reorder level defaults to `0` and remains editable by the Admin.

---

### Feature 4: Stock In Operations
* **Priority:** P0  
* **User Story:**  
  > *As an* Admin,  
  > *I want to* add inward stock quantities for an item,  
  > *So that* current inventory reflects newly arrived products.

* **Acceptance Criteria:**
  - [ ] **AC 1:** Selecting an item displays its current Reorder Level and Available Stock instantly.
  - [ ] **AC 2:** Saving Stock In increments current inventory: `Current Stock = Current Stock + Inward Stock`

---

### Feature 5: Stock Out Operations (Sell / Damage / Lost)
* **Priority:** P0  
* **User Story:**  
  > *As an* Admin,  
  > *I want to* add items to a temporary UI grid and execute bulk stock-outs as Sell, Damage, or Lost,  
  > *So that* I can process multi-item sales and account for inventory loss accurately.

* **Acceptance Criteria:**
  - [ ] **AC 1:** Selecting item and quantity appends entry to a frontend state grid.
  - [ ] **AC 2:** System rejects entries where stock-out quantity exceeds available stock.
  - [ ] **AC 3:** Clicking "Sell", "Damage", or "Lost" saves records to `StockOut` history and decrements item quantity inside an atomic Mongoose Session Transaction: `Current Stock = Current Stock - Outward Stock`

---

### Feature 6: Search & View Items Summary Report
* **Priority:** P1  
* **User Story:**  
  > *As an* Admin,  
  > *I want to* filter items by Company, Category, or both,  
  > *So that* I can review stock levels across suppliers and categories.

* **Acceptance Criteria:**
  - [ ] **AC 1:** Admin can search using Company only, Category only, or both filters combined.
  - [ ] **AC 2:** Results display Item Name, Company, Category, Available Quantity, and Reorder Level.

---

### Feature 7: Date-wise Sales Report
* **Priority:** P1  
* **User Story:**  
  > *As an* Admin,  
  > *I want to* view sales totals within a selected date range,  
  > *So that* I can analyze product performance over time.

* **Acceptance Criteria:**
  - [ ] **AC 1:** Input validation ensures "From Date" is less than or equal to "To Date" (`From Date <= To Date`).
  - [ ] **AC 2:** Aggregates and displays sold items and their total sold quantities only (excluding Damage and Lost entries).

---

## 5. 💻 Proposed Tech Stack & Architecture

* **Frontend:** React.js, Tailwind CSS, Shadcn UI / Lucide Icons, React Router DOM.
* **Backend:** Node.js, Express.js, JSON Web Tokens (JWT) for Authentication, `bcryptjs` for password hashing.
* **Database:** MongoDB with Mongoose ORM (Utilizing Mongoose Session Transactions for atomic stock updates).
* **Package Manager & Tooling:** `pnpm`, `Vite`.

---

## 6. 🗄️ Database Models & Entity Overview

| Model / Entity | Core Attributes | Relationships & Constraints |
| :--- | :--- | :--- |
| **Admin** | `name`,`email`, `password` | Single user authentication model with hashed credentials. |
| **Category** | `name`, `description` | `name` must be strictly unique. `description` is optional. |
| **Company** | `name`, `description` | `name` must be strictly unique. `description` is optional. |
| **Item** | `name`, `categoryId`, `companyId`, `reorderLevel`, `availableQuantity` | References `Category` and `Company`. `name` must be unique. |
| **StockIn** | `itemId`, `quantity`, `createdAt` | References `Item`. Tracks inward stock additions. |
| **StockOut** | `itemId`, `quantity`, `type` (Sell / Damage / Lost), `createdAt` | References `Item`. Generated via atomic session transactions. |

---

## 7. 🛠️ Non-Functional Requirements

* **Performance:** API responses served under 500ms; atomic transaction support for concurrent operations.
* **Security & Compliance:** Passwords encrypted using `bcryptjs`; API routes protected via JWT middleware.
* **Compatibility:** Full responsive support across Mobile, Tablet, and Desktop browsers (Chrome, Edge, Safari, Firefox).

---

## 8. 🎨 UI/UX & Application Routes

* **Core Application Routes:**
  1. `/login` — Admin Authentication
  2. `/categories` — Category Management
  3. `/companies` — Company Management
  4. `/items` — Item Setup & Management
  5. `/stock-in` — Inward Stock Entry
  6. `/stock-out` — Outward Grid Processing (Sell/Damage/Lost)
  7. `/reports/summary` — Category/Company Summary View
  8. `/reports/sales` — Date-wise Sales Aggregation Report

---

## 9. 📈 Key Success Metrics

1. **Inventory Accuracy:** 100% data consistency between stock logs and item stock quantities.
2. **Transaction Speed:** Grid-based bulk stock-out processing under 1 second.
3. **Data Integrity:** Zero orphaned records or partial inventory updates during API errors.

---

## 10. ⚠️ Assumptions, Constraints & Risks

| Type | Description | Mitigation Strategy |
| :--- | :--- | :--- |
| **Assumption** | App runs under a single admin environment. | Environment variable-driven config and seed setup. |
| **Constraint** | pnpm blocks `esbuild` post-install scripts by default. | Include `onlyBuiltDependencies: ["esbuild"]` in `package.json`. |
| **Risk** | MongoDB SRV resolution failure (`ECONNREFUSED`). | Switch to standard connection string or set Google Public DNS (`8.8.8.8`). |

---

## 11. 📝 Revision History

| Date | Version | Description of Changes | Author |
| :--- | :--- | :--- | :--- |
| 2026-08-09 | v1.0 | Initial complete PRD release | Shahidul Islam |
| 2026-08-14 | v1.1 | Added explicit Tech Stack Overview and Database Entities/Relationships | Shahidul Islam |
