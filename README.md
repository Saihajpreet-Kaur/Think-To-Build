<!--
MARGIN README
Before publishing:
1. Replace YOUR_USERNAME and YOUR_VERCEL_URL below.
2. Add screenshots/GIFs to the assets/ folder using the filenames referenced here.
3. Confirm the stack and feature list match the final implementation.
-->

<div align="center">

<a href="https://github.com/YOUR_USERNAME/margin-finance">
  <img src="https://capsule-render.vercel.app/api?type=waving&height=220&color=0:090B10,45:172333,100:343B47&text=MARGIN&fontColor=F5F7FA&fontSize=74&fontAlignY=38&desc=Make%20room%20for%20what%20matters.&descAlignY=60&descSize=18" width="100%" alt="MARGIN — Make room for what matters" />
</a>

<a href="https://your-vercel-url.vercel.app"><img src="https://img.shields.io/badge/LIVE_DEMO-Open_MARGIN-9FE870?style=for-the-badge&logo=vercel&logoColor=090B10" alt="Live demo" /></a>
<a href="https://github.com/YOUR_USERNAME/margin-finance"><img src="https://img.shields.io/badge/SOURCE-GitHub-FFFFFF?style=for-the-badge&logo=github&logoColor=090B10" alt="GitHub source" /></a>
<img src="https://img.shields.io/badge/STATUS-Competition_Build-83B8FF?style=for-the-badge" alt="Competition build" />

<br />

<img src="https://readme-typing-svg.demolab.com?font=Space+Grotesk&weight=600&size=22&duration=2600&pause=900&color=9FE870&center=true&vCenter=true&width=760&lines=See+where+your+money+goes.;Understand+what+it+can+become.;Make+your+next+money+move+with+clarity." alt="MARGIN tagline animation" />

**A cinematic, money-first personal finance studio.**  
Track spending · Shape budgets · Forecast cashflow · Build savings · Make smarter decisions

</div>

---

## ✦ The experience

MARGIN makes personal finance feel tangible. It brings everyday money management into one immersive workspace, combining practical financial tools with a distinctive 3D visual identity, responsive interactions and motion-led storytelling.

> **The idea:** don't just show people where their money went. Help them understand what their money can do next.

<div align="center">

<!-- Add a looping screen recording/GIF at assets/margin-homepage.gif -->
<img src="./assets/margin-homepage.gif" width="100%" alt="MARGIN homepage preview — replace with your recorded homepage GIF" />

<sub>Homepage preview · Replace this placeholder with a short screen recording exported as a GIF.</sub>

</div>

## ✧ Explore MARGIN

| Experience | What it does |
|---|---|
| **Financial Command Center** | Brings balance, income, expenses, available margin, savings rate and recent activity together. |
| **Transaction Ledger** | Add, edit, remove, search, filter and organise income and expenses. |
| **Smart Budget Studio** | Set category limits, monitor utilisation and surface budget warnings. |
| **Future Money Forecast** | Explore estimated 30-, 60- and 90-day cashflow using balances and scheduled activity. |
| **Savings Goals** | Create goals, add contributions and track progress towards targets. |
| **Recurring Payments & Calendar** | Organise repeating bills, subscriptions, salary and upcoming payment dates. |
| **Decision Lens** | Simulate a purchase and see how it affects available money, budgets and savings goals. |
| **Money Intelligence** | Surface explainable spending patterns and useful insights from transaction history. |
| **Indian Language Interface** | Switch between supported Indian languages, with Punjabi placed first in the selector. |
| **Responsive Experience** | Use the application across desktop, tablet and mobile layouts. |

## ◈ Signature moments

<div align="center">

<table>
  <tr>
    <td width="50%" align="center">
      <img src="./assets/margin-3d-core.gif" width="100%" alt="MARGIN 3D financial core preview" />
      <b>THE FINANCIAL CORE</b><br />
      <sub>Spatial 3D environment, orbital elements and reactive financial visuals.</sub>
    </td>
    <td width="50%" align="center">
      <img src="./assets/margin-decision-lens.gif" width="100%" alt="MARGIN Decision Lens preview" />
      <b>THE DECISION LENS</b><br />
      <sub>Explore the real impact of a planned purchase before making it.</sub>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <img src="./assets/margin-forecast.gif" width="100%" alt="MARGIN cashflow forecast preview" />
      <b>FUTURE MONEY</b><br />
      <sub>See projected balances and upcoming financial commitments.</sub>
    </td>
    <td width="50%" align="center">
      <img src="./assets/margin-mobile.gif" width="100%" alt="MARGIN mobile experience preview" />
      <b>ON THE MOVE</b><br />
      <sub>A responsive finance workspace designed for smaller screens.</sub>
    </td>
  </tr>
</table>

</div>

> **Visual demo tip:** GitHub README files do not execute a live Three.js canvas or custom JavaScript. Use short looping GIFs for motion previews and link each preview to the live application. The actual interactive 3D experience runs on the deployed website.

## ⚡ What makes it different?

### 01 — Decision Lens

Enter a planned purchase and compare its impact before spending. MARGIN calculates the change to available money, the selected category's budget and the progress of a savings goal. The result is a practical scenario comparison, not a pretend AI answer.

### 02 — Future Money

Explore upcoming cashflow with projected income, recurring commitments and scheduled payments. Actual figures and estimates are presented separately so projections are not mistaken for current balances.

### 03 — A living financial interface

The 3D financial environment, animated data visualisations, scroll interactions and responsive transitions give MARGIN a recognisable visual identity while keeping financial information central.

### 04 — Built for Indian users

The language selector prioritises Punjabi and includes the other configured Indian language options. Currency and date presentation are designed around Indian usage.

## 🧭 Application map

```text
MARGIN
├── Home
│   ├── Cinematic hero and product story
│   ├── Financial visualisation
│   └── Entry to the money studio
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

> Keep this list aligned with the packages actually installed in `package.json`.

<div align="center">

<img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,threejs,nodejs,git,github,vercel" alt="Technology icons" />

</div>

| Layer | Technology | Purpose |
|---|---|---|
| Application | Next.js + React | Web application and routing |
| Language | TypeScript | Typed application code |
| Styling | Tailwind CSS | Responsive design system |
| 3D | Three.js / React Three Fiber | Spatial financial visuals |
| Motion | Motion for React / GSAP | Scroll, page and interaction animations |
| Charts | Recharts | Financial data visualisations |
| State | Zustand | Shared application state |
| Validation | Zod | Input validation |
| Persistence | localStorage | Local demo data persistence |
| Icons | Lucide React | Interface icons |

## 🚀 Run locally

### Requirements

- Node.js compatible with the version required by the installed Next.js release.
- npm.
- Git.

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/margin-finance.git
cd margin-finance
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

### 4. Create a production build

```bash
npm run build
npm run start
```

The current demo is designed to run locally with sample data and browser storage. If the implementation later adds external services, document their environment variables in `.env.example` and update this section.

## 🧪 Demo data & privacy

- The first launch should provide sample financial records so the experience can be explored immediately.
- In the local-first demo configuration, changes are stored in the browser rather than connected to a real bank account.
- Use the application's demo reset control to restore its sample state, if enabled.
- Do not enter real banking credentials or sensitive financial information into a competition demo.

## 📱 Responsive design

MARGIN is intended to adapt across:

- **Desktop:** full financial workspace, larger visualisations and spatial 3D scenes.
- **Tablet:** adaptive layouts and touch-friendly controls.
- **Mobile:** compact navigation, readable financial cards and performance-aware motion.

## 🌐 Language support

The language selector is designed to include Punjabi first, followed by Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Odia, Urdu, Assamese and English.

Translation coverage depends on the dictionaries implemented in the current build. Review every screen in each language before describing the translations as complete.

## 🗺️ Roadmap

- [x] Personal finance overview concept
- [x] Transaction and budget experience
- [x] Cashflow forecast and savings goal concepts
- [x] Decision Lens concept
- [x] 3D financial visual identity
- [ ] Add final product screenshots and optimised GIF previews
- [ ] Verify all language translations end-to-end
- [ ] Complete accessibility and reduced-motion audit
- [ ] Add automated unit and end-to-end test coverage

> Update the checklist to reflect the features that are actually implemented and tested in your submitted build.

## 🤝 Contributing

Contributions, bug reports and thoughtful feature suggestions are welcome.

1. Fork the repository.
2. Create a branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m "Add your feature"`.
4. Push the branch: `git push origin feature/your-feature`.
5. Open a pull request.

## 📄 License

Choose and add a licence before accepting external contributions. Until a licence is added, all rights remain with the repository owner.

---

<div align="center">

### Make room for what matters.

**MARGIN — See every move. Understand every possibility.**

<a href="https://your-vercel-url.vercel.app"><img src="https://img.shields.io/badge/Explore_Margin-Launch_Demo-9FE870?style=for-the-badge&logo=vercel&logoColor=090B10" alt="Launch MARGIN" /></a>

<img src="https://capsule-render.vercel.app/api?type=waving&height=110&section=footer&color=0:343B47,55:172333,100:090B10" width="100%" alt="" />

</div>
