# 🏛️ Ludium: Onchain Freelancer Platform

## 🌍 Overview
![Overview](./images/Ludium%20-%20Web3%20Talent%20Platform_CoreDAO.pptx%20(1).png)
The digital native world opens new doors for the great opportunity for freelancers. For one, it is **geographically agnostic**. Two, it allows **asynchronous** project management. And finally, it promotes **pluralistic contribution.** We imagine a world where we are free to **work from anywhere at anytime with anyone** and **enjoy the highest compensation** based on contributions.

To enter the new world, we demand a new system. The system that allows **faster, cheaper, and more reliable** freelancers to congregate. We believe that the system must incorporate the **liquidity of builder capital based on task performances**. For this, we develop **accessible, collaborative and trustless** freelancer platform for the liberty of the builders.

## ❗ Problem - No Country For Freelancers
![Problem](./images/Ludium%20-%20Web3%20Talent%20Platform_CoreDAO.pptx%20(2).png)
The traditional talent-matching system is centralized. In such systems, **it’s difficult to fully reflect what skills someone has or what projects they’ve contributed to**, with resumes and interviews being the main — and often limited — tools for assessment. This information remains fragmented across isolated data silos.

This structure is particularly inadequate for Web3, where **decentralized communities and autonomous contributions are the norm**. Additionally, freelancers and project-based agents currently lack clear standards for establishing trust and maintaining long-term collaboration. While anyone can apply to contribute to a project, **there’s no standardized framework for identifying who is trustworthy, how contributions should be evaluated, or how rewards should be distributed**. As a result, we often see contributors not getting paid or requesters disappearing without results. **An automated system of trust and settlement is urgently needed.**

## ✅ Solution - Trustless Talent Matching Platform
![Platform Overview](./images/Ludium%20-%20Web3%20Talent%20Platform_CoreDAO.pptx%20(3).png)
To solve these problems, Ludium proposes an onchain-based talent matching platform. Builders can **create a profile based on their skills and experience**, and **build trust through verifiable onchain credentials**, such as past project settlements or milestone completions. These profiles go beyond resumes — they are **performance-based assets tied to individual projects**.
![Contract](./images/Ludium%20-%20Web3%20Talent%20Platform_CoreDAO.pptx%20(4).png)
**Sponsors** can create programs by depositing budgets into escrow and setting conditions (e.g., minimum voucher amounts, validator staking, etc.).

**Builders** apply and **submit milestones upon task completion**.

**Validators** review and approve the work. The entire flow is automated via smart contracts —**when deliverables are submitted and approved, payments are released automatically; if tasks fail, penalties and slashing mechanisms refund part of the deposit to the sponsor**.

This system is **optimized for project-based collaboration** and replaces trust with a **dual mechanism: contract terms + validator reputation**. It enables fair and transparent participation, with each contributor’s performance permanently recorded onchain for future opportunities.

## 🧡 Ludium in its CORE
![CoreDAO Integration](./images/Ludium%20-%20Web3%20Talent%20Platform_CoreDAO.pptx%20(5).png)

### 🧪 Summary of Integration Flow

1. **User Onboards** via Privy → EVM-compatible wallet created on CoreDAO.
2. **Wallet Connects** to CoreDAO Testnet → On-chain actions routed through Wagmi.
3. **Escrow Smart Contract** enables milestone funding & release via tCore.
4. **BTC Payments** supplement CoreDAO-based escrow, currently as off-chain/manual fallback.

### 1. **Social Login via Privy (CoreDAO Wallet Connection)**

- **Technology**: [Privy](https://www.privy.io/) is used as a Web3 onboarding solution.
- **Integration Details:** Users authenticate using **OAuth (Google)** or **email login**, which generates an **embedded smart wallet** compatible with EVM chains. Custom **CoreDAO chain config** added to Wagmi client to support Privy wallets on the Core Testnet.
- **Outcome**: Users unfamiliar with wallets or seed phrases can sign in with email/socials and interact with on-chain contracts seamlessly via CoreDAO.

---

### 2. **Escrow Contract (Deployed on CoreDAO Testnet)**

- **Purpose**: Secure milestone-based payments between **project managers** and **freelancers/builders**.
- **Key Features**: Funds are deposited into the escrow contract in **tCore (testnet Core token)**. It supports the full features for the **milestone based escrow payment system** on Portal
- **Deployment**: Smart contract deployed to **CoreDAO Testnet**.
- **Security Note**: Still under testnet environment for audit and UX refinement.

---

### 3. **BTC Payment (BTC Address Generation via CoreDAO-based Interface)**

- **Use Case**: Allow off-chain **BTC payments** as part of escrow or direct builder contributions.
- **Mechanism**: Users can choose BTC option during the program setup. Once the task is
- **Future Consideration**: May use **CoreDAO-BTC bridges** or **native BTC bridges** for on-chain proof in later versions.

## 📊 Market Adoption - 2025 Highlight
![Highlight](./images/Ludium%20-%20Web3%20Talent%20Platform_CoreDAO.pptx%20(6).png)

Ludium has seen significant growth in Q1 2025.

- **User Growth**: Newsletter subscribers have rapidly increased, and the weekly letter sharing open positions and collaborative projects has become a key gateway for builders.
- **Sponsor Acquisition**: More institutions are setting up programs through Ludium, including hackathons, incubation programs, and research bounties — not just Web3 foundations but also startups and enterprises running pilot programs.
- **Revenue Growth**: Ludium charges an average 30% operational fee based on escrow settlements. This is more sustainable than one-off fees since it is tied to actual performance. Some programs have already processed funds in the millions of KRW per engagement.

## 📈 Projection - 2025 Outlook
![Outlook](./images/Ludium%20-%20Web3%20Talent%20Platform_CoreDAO.pptx%20(7).png)

- By the end of 2025, Ludium is focused on **enhancing visibility of performance through automated onchain activity and user conversion**. Contribution history, settlement outcomes, and feedback are all recorded onchain, turning in-platform activity into real career value.
- On the sponsor side, there’s a shift from short-term tasks to **long-term contracts** (e.g., quarterly talent matching, recurring partner programs). Current discussions include global NGOs, public sector collaborations, and venture funds — with budgets potentially reaching tens of millions of KRW per program.
- Overall, 2025 is expected to be the year when **“performance-based liquidity” built on “technology-based trust” truly activates** — and Ludium aims to be a central player in that transformation.

## 🛣️ Roadmap - TAMP (Trustless Agent Matching Protocol)
![TAMP Roadmap](./images/Ludium%20-%20Web3%20Talent%20Platform_CoreDAO.pptx%20(8).png)

To expand into a full-scale Web3 HR infrastructure, Ludium is developing **TAMP (Trustless Agent Matching Protocol)** — a protocol that enables automated matching and settlements based on onchain identity and performance.

TAMP is built on three pillars:

- **Agent Workstation**: Builders, validators, and sponsors can be either humans or AI with various roles and skills. Each agent takes on tasks and submits results.
- **Verifiable Onchain Credentials (VOC)**: Unlike traditional resumes, credentials are based on actual project contributions and onchain settlement results.
- **Trustless Settlement**: Smart contracts distribute rewards based on contribution and validation. Penalties and slashing apply for failed tasks.

TAMP is ideally suited for the fast-growing Web3 use cases like DAOs, contributor-driven hackathons, and decentralized research networks. Ludium’s aim is to establish TAMP as the **standard for turning task-based labor into digital assets**.

## 🔮 Roadmap - Future Development Plans
![Roadma-Timeline](./images/Ludium%20-%20Web3%20Talent%20Platform_CoreDAO.pptx%20(9).png)

### **📅 2025 Q3:**

- **Mainnet Escrow Contract:** Transition from testnet (e.g. CoreDAO Testnet) to **mainnet deployment** to enable real value transactions using milestone-based escrow contracts.
- **Fiat Onramp:** Integration of **fiat-to-crypto payment methods** to allow non-crypto-native users to fund work agreements or programs.
- **Investment Programs:** Introduction of builder- or project-focused investment initiatives, possibly connected to ecosystem funding or bounties.
- **Onchain Credential:** Users begin to **accumulate verifiable onchain records** of past work, roles, and contributions – forming a decentralized reputation.

---

### **📅 2025 Q4:**

- **Warranty Contract:** Introduction of **builder warranty mechanisms**, where builders stake value or reputation to guarantee work quality.
- **Automation Features:** Smart workflows for task/milestone tracking, dispute resolution, and payments – reducing admin burden.
- **Workstation Enhancement:** Improved user interface/UX for task execution, project tracking, and real-time collaboration.

---

### **📅 Beyond (2026 and after):**

- **Agent As a Frontend:** Transition to AI agents or smart agents acting as primary interfaces between users and onchain contracts (e.g. auto-negotiation, recommendations).
- **Talent Capital Management:** Onchain tracking and allocation of talent resources; managing capacity, commitments, and compensation like capital.
- **Credential Governance:** Community- or protocol-led governance around what counts as verified credentials; possibly includes DAO-based dispute resolution or verification.

---