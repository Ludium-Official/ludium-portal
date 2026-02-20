import About1Icon from '@/assets/guide/about/About1.png';
import About2Icon from '@/assets/guide/about/About2.png';
import About3Icon from '@/assets/guide/about/About3.png';
import AboutLudiumIcon from '@/assets/icons/guide/about-ludium.svg';
import JoinProjectIcon from '@/assets/icons/guide/join-project.svg';
import SetUpProfileIcon from '@/assets/icons/guide/setup-profile.svg';

export const GUIDES = [
  {
    id: 'about-ludium',
    link: '/about/guides/about-ludium',
    title: (
      <>
        About
        <br />
        Ludium
      </>
    ),
    pageTitle: 'About Ludium',
    bgColor: 'bg-primary-400',
    icon: AboutLudiumIcon,
    content: `## Ludium Portal

  **Talent Without Borders.**

  Ludium Portal is an open platform that makes digital collaboration more accessible, transparent, and secure. It provides infrastructure for milestone-based programs, verifiable work execution, and talent discovery. By shifting trust from people to systems, Ludium enables anyone, anywhere, to collaborate without relying on intermediaries.

  ![About1](${About1Icon})

  ## What Is Ludium Portal?

  Ludium Portal supports the full lifecycle of global digital work. It allows users to:

  - Join or host milestone-based recruitment, funding, or campaign programs
  - Submit work and receive automated payouts through escrow-based contracts
  - Build portable and verifiable credentials through completed work
  - Explore profiles, teams, and organizations for collaboration
  - Share and discover content through an integrated community layer

  The Portal functions as a trustless layer (blockchain-secured and transparent) for work execution and talent reputation.

  <center>
    <img src="${About2Icon}" alt="About2" />
  </center>

  ## Core Features

  **Profile**

  A dynamic on- and off-chain resume showcasing skills, work history, milestone achievements, and exportable credentials (coming soon).

  **Programs**

  Structured workflows for recruitment, freelance work, campaigns, payroll, grants, and project funding. All programs are built on milestone-based escrow contracts to ensure transparent execution and fair payouts.

  **Community**

  An information hub for events, jobs, hackathons, and platform updates. Future versions will include automatic aggregation and builder-led content publishing.

  **Agents**

  A directory for discovering builders (creators, developers, and freelancers), teams, and organizations. The roadmap includes AI-powered matching and organization-level collaboration spaces.

  <center>
    ![About3](${About3Icon})
  </center>

  ## Use Cases

  - **Education** — Bootcamps, sprints, and accelerators with verifiable assignments
  - **Recruitment** — Milestone-based hiring pipelines with escrow-backed payouts
  - **Investment** — Milestone-based funding for early teams or founders
  - **Team Building** — Builders collaborate and build verified work histories together
  - **Career Management** — A portable reputation built on verified contributions`,
  },
  {
    id: 'join-project',
    link: '/about/guides/join-project',
    title: (
      <>
        Join
        <br />a Project
      </>
    ),
    pageTitle: 'Join a Project',
    bgColor: 'bg-sky-500',
    icon: JoinProjectIcon,
    content: ``,
  },
  {
    id: 'setup-profile',
    link: '/about/guides/setup-profile',
    title: (
      <>
        Set Up
        <br />
        Profile
      </>
    ),
    pageTitle: 'Set Up Profile',
    bgColor: 'bg-rose-500',
    icon: SetUpProfileIcon,
    content: ``,
  },
];
