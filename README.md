# 🌐 Ludium Portal
**Talents Be Free.**

[Ludium Portal](https://www.ludium.world/) is an open platform that makes digital work more **accessible**, **collaborative**, and **trustless**.
It provides infrastructure for milestone-based programs, verifiable work execution, and transparent talent discovery.
By shifting trust from people to systems, Ludium enables anyone, anywhere, to collaborate without intermediaries.

---

## 🚀 What Is Ludium Portal?

Ludium Portal supports the full lifecycle of global digital talent.
It allows users to:

* Join or host milestone-based Recruitment, Funding, or Campaign programs
* Submit work and receive automated payouts through escrow contracts
* Build portable, verifiable credentials through completed work
* Explore profiles and organizations for collaboration
* Share and discover content through an integrated community layer

The Portal functions as a **trustless work execution and talent reputation layer**.

---

## 🧩 Core Features

### **Profile**
Dynamic on/off-chain resume showing skills, work history, milestone achievements, and future exportable credentials.

### **Programs**
Structured workflows for recruitment, freelance tasks, campaigns, payroll, grants, or project funding.
Built on milestone-escrow smart contracts for trustless payments.

### **Community**
Information hub with events, jobs, hackathons, and updates.
Future versions include automatic aggregation and builder-led content publishing.

### **Agents**
Directory for discovering builders and organizations.
Future roadmap includes AI-powered matching and organization-level collaboration spaces.

---

## 🧠 Use Cases

* **Education** — Bootcamps, sprints, and accelerators with verifiable assignments
* **Recruitment** — Milestone-based hiring pipelines with escrow-backed payouts
* **Investment** — Milestone-based funding for early teams or founders
* **Team Building** — Builders collaborate and build verified histories together
* **Career Management** — Portable reputation built on verified contributions

---

## 📊 Current Statistics *(as of Nov 2025)*

| Metric | Value |
| :--- | :--- |
| **Active Programs** | 20 |
| **Builders Engaged** | 150 |
| **Total Payout** | $78,000+ |
| **Supported Chains** | Arbitrum, Base, Educhain, Creditcoin |

---

## 🗺️ Roadmap

Ludium Portal continues evolving into a trustless work automation layer supported by on-chain verification and structured program logic.

| **Timeline** | **Technical Focus** | **Business Goal** |
| :--- | :--- | :--- |
| **2025 Q4** | Platform reconstruction for smoother UI/UX; improved recruitment flow; mobile optimization | **$100K+ payout volume** |
| **2026 Q1** | Talent data integration; expanded program formats (Recruitment, Payroll, Campaigns, Sprints); enhanced profiles | **$200K+ payout volume** |
| **2026 Q2** | Warranty contract integration; automated task validation; agent-assisted matching | **$500K+ payout volume** |

---

## 🧱 Tech Stack

### **Frontend**
* **Framework:** Vite, React
* **Language:** TypeScript
* **Styling:** Tailwind CSS, shadcn/ui
* **Data & State:** Apollo Client, GraphQL Codegen, Firebase
* **Web3 Integrations:** Privy, Wagmi, Coinbase OnchainKit, Ethers.js, Farcaster

### **Backend**
**API Service**
* **Language:** Node.js (TypeScript)
* **Framework:** Fastify
* **API:** GraphQL
* **ORM:** Drizzle ORM
* **Database:** PostgreSQL on Google Cloud SQL
* **Runtime:** Docker container on Google Cloud Run

**Relayer Service**
* **Language:** Node.js (TypeScript)
* **Framework:** NestJS
* **Runtime:** Docker container on Google Cloud Run

### **Smart Contracts**
* **Framework:** Solidity, Hardhat
* **Core Logic:** Milestone escrow contracts
* **OpenZeppelin Libraries:**
    * `AccessControlUpgradeable`
    * `ReentrancyGuardUpgradeable`
    * `OwnableUpgradeable`
    * `PausableUpgradeable`
    * `UUPSUpgradeable` (for proxy upgrade pattern)
    * `SafeERC20`
    * `ECDSA`, `MessageHashUtils` (for signature verification)

---

## 📚 References

* **Portal Mainnet:** [ludium.world](https://www.ludium.world/)

* **Portal Testnet:** [dev.ludium.world](https://dev.ludium.world/)

* **Portal Overview Deck:**
    [Google Slides Link](https://docs.google.com/presentation/d/1vtromU8KIKzvxaM0udoMO8QZ7ma3SYrb/edit?usp=sharing&ouid=114526068295441448956&rtpof=true&sd=true)

* **Portal Backend Repo:**
    [https://github.com/Ludium-Official/ludium-portal-backend](https://github.com/Ludium-Official/ludium-portal-backend)

* **Portal Contract Repo:**
    [https://github.com/Ludium-Official/ludium-portal-contract](https://github.com/Ludium-Official/ludium-portal-contract)

* **Portal Repository:**
    [https://github.com/Ludium-Official/ludium-portal](https://github.com/Ludium-Official/ludium-portal)

* **Project Board:**
    [https://github.com/orgs/Ludium-Official/projects/7](https://github.com/orgs/Ludium-Official/projects/7)

* **Figma Design System:**
    [https://www.figma.com/design/CM3IBQGqrX31ylYXL3PV5D/Ludium](https://www.figma.com/design/CM3IBQGqrX31ylYXL3PV5D/Ludium)

---

## 🔐 License

Ludium Portal is open-sourced under the **Business Source License (BUSL)**.
For more details:
[https://www.hashicorp.com/en/bsl](https://www.hashicorp.com/en/bsl)

---

👋 *Contributions are welcome via pull requests. For active tasks, see our Project Board.*
**Talents Be Free.**