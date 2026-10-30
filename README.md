# RythuMitra (రైతుమిత్ర) — Your Trusted Friend in Farming

Smart agricultural supply-chain platform connecting farmers, buyers, and market administrators with bilingual **English & Telugu** support, live market price comparisons, road transport & spoilage estimation, and expected net profit calculation.

---

## Running Locally in VS Code

### 1. Prerequisites
- **Node.js** (v18 or v20+ recommended)
- **VS Code**

### 2. Project Folder Structure
```text
rythumitra/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── index.css
    ├── types.ts
    ├── i18n.ts
    ├── App.tsx
    ├── data/
    │   └── seedData.ts
    └── components/
        ├── AuthGate.tsx
        ├── ProfitCalculatorView.tsx
        ├── RequestsAndChatView.tsx
        ├── MarketAdminView.tsx
        └── MainAdminView.tsx
```

### 3. Install & Start Development Server
Open the terminal in VS Code (`Ctrl + ~`) and run:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000` (or the URL shown in your terminal) in your browser.

---

## Pre-Configured Demo Accounts

| Role | Username | Password | Location |
| :--- | :--- | :--- | :--- |
| **Farmer** | `ramarao` | `password123` | Madanapalle, Annamayya Dist., AP |
| **Farmer** | `venkat_farmer` | `password123` | Prathipadu, Guntur Dist., AP |
| **Buyer** | `harish_buyer` | `password123` | Tiruchanur, Tirupati Dist., AP |
| **Buyer** | `padma_buyer` | `password123` | Balanagar, Hyderabad, Telangana |
| **Market Administrator** | `srinivas_admin` | `password123` | Madanapalle APMC Yard (Approved) |
| **Market Administrator** | `narasimha_admin` | `password123` | Kurnool APMC Yard (Pending Approval) |
| **Main Administrator** | `mainadmin` | `password123` | State Directorate, Vijayawada |
