# ludium-portal

# Overview

The digital native world opens new doors for the great opportunity for the workforce. For one, it is **geographically agnostic** for anyone to work from anywhere. Two, it allows **asynchronous** project management that fosters innovation. And finally, it promotes **pluralistic contribution** where anyone can choose to work for the task that fits them. However, under the current system of work, we are still bounded to work in a place at the designated time for one organization.

Ludium believes that the new world begs for a new system. For this, we develop a system that is **accessible, collaborative and trustless** for the liberty of the builders.

# System Architecture

![Ludium Portal Architecture.png](./Ludiumv2%20Architecture.png)

Ludium v2 is the system updated from the [**previous version**](https://github.com/Ludium-Official/ludium-world). There are four primary features

- **Set up the program**: Sponsors can enter the portal to set up a program. They can choose to allocate fund by setting up a contract or without a fund. Sponsors can also designate validator(s) who review proposals and milestones
- **Check Proposal**: Builders can view the program and submit their proposal. It could range from the completed task to planning materials for the future. Once the proposal is submitted, validators view the content and decide whether to proceed with the project with milestones
- **Submit Milestone**: Once the project page is set up, builders submit their progress on the page to show that they have reached the milestones. Milestones can range from application development to other impact metics depending on the nature of the project. Validators review the submission to see if the milestone is reached.
- **Settlement**: When a milestone is completed, builders are allocated resources as specified by the project milestone. If the program include the onchain fund under contract, the payment will be settled from the fund. If there is no fund, it will be outside the system

# System Components

- [Portal Frontend]():
- [Portal Backend](https://github.com/Ludium-Official/ludium-portal-backend/blob/main/README.md): GraphQL API that offers Role Based Access Control (ex. Sponsors, Validators, and Builders)
- [Portal Contract](https://github.com/Ludium-Official/ludium-portal-contract): Solidity based escrow contract that sponsors create program, validators accept milestones, and builders receive payment
- [Ludium Farcaster](https://github.com/Ludium-Official/ludium-farcaster): Farcaster frame creator for the Ludium programs on the portal

# Use Cases

- **Contest Payment**: Anyone can set up a contest program (eg. hackathons, airdrop events) for the marketing exposure or incentivization
- **Project Hiring**: Projects and organizations can announce a program to hire individual teams required for the task
- **Grant Management**: Web3 foundations and other non profit organizations can run grants program to manage projects
- **Funding**: VCs and other for profit organizations can run programs to select qualified candidates for the further funding
- **Organization Resource Allocation**: Any organization can run programs to assign and manage tasks for the internal resource management

# Contribution
