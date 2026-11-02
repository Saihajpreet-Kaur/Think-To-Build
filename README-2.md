<div align="center">

<img src="./assets/margin-motion-banner.gif" width="100%" alt="Animated MARGIN visual: metallic financial core, orbital coins and flowing money particles" />

# MARGIN
### Make room for what matters.

**A money-first personal finance studio for tracking, planning and making better decisions.**

<img src="https://img.shields.io/badge/PROJECT-Personal%20Finance-101722?style=for-the-badge" alt="Personal finance project" />
<img src="https://img.shields.io/badge/EXPERIENCE-3D%20%2B%20Motion-83B8FF?style=for-the-badge" alt="3D and motion experience" />
<img src="https://img.shields.io/badge/RUNS-Locally-9FE870?style=for-the-badge" alt="Runs locally" />

**No hosted demo yet — clone the project and run it locally.**

</div>

---

## ✦ What is MARGIN?

MARGIN is a personal finance and expense-tracking web app built around one simple idea: don't just show people where their money went; help them understand what their money can do next.

It combines practical money-management tools with an expressive visual identity: a spatial 3D financial environment, motion-led interactions, animated financial visualisations and a responsive interface.

## ◈ Motion showcase

The README includes looping visual previews so the repository has motion even before the app is launched. These are **illustrative README animations, not recordings of the running app**. The actual interactive 3D scene and cursor/scroll effects run in the application after starting the local development server.

<div align="center">

<img src="./assets/margin-money-flow.gif" width="100%" alt="Animated illustration of money flowing from income through financial decisions into savings" />

<sub>Money flow concept: income → decisions → savings.</sub>

</div>

### In the running application

- **Spatial 3D financial core:** metallic central object, orbital elements, particles, lighting and camera depth.
- **Scroll interactions:** motion-led section transitions, parallax and financial storytelling.
- **Pointer interactions:** cursor-reactive visuals and responsive hover states.
- **Financial feedback:** animated counters, chart transitions, budget progress and savings updates.

> GitHub README pages cannot execute the application's React components, JavaScript, WebGL or live Three.js scene. They can display animated image files such as GIFs. Run MARGIN locally to experience the real interactive animations.

## ✧ Features

| Feature | What it does |
|---|---|
| **Financial Command Center** | Overview of available balance, income, expenses, savings rate and recent activity. |
| **Transaction Ledger** | Add, edit, delete, search, filter and organise income and expenses. |
| **Smart Budget Studio** | Create category budgets and monitor spending against limits. |
| **Future Money Forecast** | Explore projected 30-, 60- and 90-day cashflow using scheduled activity and recurring items. |
| **Savings Goals** | Set targets, add contributions and track progress. |
| **Recurring Payments & Calendar** | Organise repeating bills, subscriptions, income and upcoming payment dates. |
| **Decision Lens** | Simulate a planned purchase and understand its impact on available money, budgets and savings goals. |
| **Money Intelligence** | Surface explainable spending patterns and useful insights from transaction history. |
| **Language Selector** | Indian language options with Punjabi listed first, subject to the translation dictionaries present in the build. |
| **Responsive Interface** | Layouts designed for desktop, tablet and mobile screens. |

## ✦ Signature experience: Decision Lens

Before making a purchase, enter its amount and category to compare the impact on your available balance, category budget and savings progress. Use the result to compare buying now, waiting or skipping the purchase.

## 🧭 Application sections

```text
MARGIN
├── Home
│   ├── Cinematic hero
│   ├── 3D financial visualisation
│   └── Product storytelling
│
└── Money Studio
    ├── Overview
    ├── Transactions
    ├── Budgets
    ├── Forecast
    ├── Goals
    ├── Calendar & Recurring Payments
    ├── Decision Lens
    ├── Insights
    └── Settings & Language
```

## 🛠️ Technology

The project is built as a modern React-based web application. Confirm exact packages and versions against `package.json` in the repository.

| Area | Technology |
|---|---|
| Web application | Next.js / React |
| Language | TypeScript |
| Styling | Tailwind CSS |
| 3D visuals | Three.js / React Three Fiber |
| Motion | Motion for React; GSAP where used |
| Charts | Recharts |
| State | Zustand |
| Validation | Zod |
| Icons | Lucide React |

## 🚀 Run locally

### Requirements

- Node.js (use a version compatible with the project's Next.js version)
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git
cd <YOUR_REPOSITORY_NAME>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open **http://localhost:3000**.

### 4. Build for production

```bash
npm run build
npm run start
```

Check the project's `package.json` for the exact scripts and any environment variables required by your implementation. Do not commit secrets or real financial credentials.

## 📱 Responsive experience

MARGIN is designed to adapt across desktop, tablet and mobile. The 3D experience may use reduced particle counts or simplified effects on smaller devices to preserve smooth performance while retaining its visual identity.

## 🌐 Language support

The language selector is intended to place Punjabi first, followed by other major Indian languages and English. Translation coverage depends on the dictionaries shipped with the current code. Review every page in each language before describing the translation as complete.

## 🔒 Demo data & privacy

- Use sample/demo records when presenting the project.
- In a local-first configuration, data may be stored in browser storage rather than connected to real bank accounts.
- Do not enter real banking credentials or sensitive financial information into a competition build.
- Check the actual persistence implementation in the source before making privacy or security claims.

## 🗺️ Roadmap

- [ ] Add screenshots or short screen recordings captured from the actual running application.
- [ ] Verify every feature and financial calculation end-to-end.
- [ ] Verify all language translations across every page.
- [ ] Complete accessibility and reduced-motion checks.
- [ ] Add automated unit and browser tests.

## 🤝 Contributing

1. Fork the repository.
2. Create a branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m "Describe your change"`.
4. Push your branch and open a pull request.

## 📄 License

Add a licence file before accepting external contributions. Until a licence is added, all rights remain with the repository owner.

---

<div align="center">

### MARGIN
**See every move. Understand every possibility.**

<sub>Built to make money management clearer, more tangible and more engaging.</sub>

</div>
