# Calary (C for Compliance and Crypto)

Registry => [Polygon](https://polygon.blockscout.com/address/0x8371CA3C7aCB1002f2f940A3F30635623caa7590)

CVLayer => [Celo](https://celoscan.io/address/0x8371ca3c7acb1002f2f940a3f30635623caa7590)

ChainlinkRelayer => [Celo](https://celoscan.io/address/0xe03040bf46cfd0284bf622d082116ab3dc579865)

Calary is a next-generation developer toolkit that empowers teams to build consumer-grade dApps with robust, on-chain financial features and regulatory compliance baked in. At its core, Calary provides a modular suite of tools that handle end-to-end processes—from user verification and identity management to complex payroll systems and token swaps.

**User Onboarding & Compliance:**

- **KYC via Self Protocol:** Users register by undergoing a KYC process using Self Protocol. They must submit passport details including nationality, age, and passport expiry, while ensuring they are not from restricted regions (e.g., North Korea or Iran).
- **Registry on Celo:** Once verified, each user's wallet, passport expiry date, and a boolean `rewarded` flag (for managing rewards eligibility) are recorded on a native Celo Registry contract.
- **Cross-Chain Verification:** Leveraging Hyperlane, Calary relays verified user information—such as wallet address and expiry—to other supported chains, ensuring that compliance checks hold across ecosystems. This feature is designed to eventually support any EVM-compatible chain or even non-EVM chains, making the toolkit highly versatile.

**Payroll System:**  
Calary offers a flexible payroll framework that caters to various business needs:

- **Time-Based Payroll:** This straightforward system allows bosses to set fixed intervals for salary claims. Employees receive scheduled payouts without needing complex configurations—ideal for teams with simple payroll requirements.
- **Custom Logic Payroll:** For more advanced setups, employers can implement bespoke payroll logic by conforming to an `ICustomPayrollLogic` interface. This interface contains functions for checking eligibility and calculating payment amounts. The vision includes future integration of zk-privacy features to protect sensitive payroll data, making salary distributions transparent yet secure on-chain ().
- **Milestone-Based Payroll:** Designed for performance or event-triggered payments, this system uses on-chain (or even off-chain) events as triggers for salary releases. Although the current implementation relies on simple event signature verification—similar to Chainlink's log trigger automation—the architecture allows for scaling to a fully decentralized node operator model in the future ().

**Swap Infrastructure & Incentives:**

- **Compliant Swaps:** Calary integrates a swap mechanism powered by Uniswap v4. Before a swap is executed, a custom `beforeSwap` hook verifies that the user is compliant (i.e., verified via the registry).
- **Rewarding Payroll Participation:** An `afterSwap` hook checks the user's `rewarded` flag. If an employee has participated in the payroll system and their flag is set to false (indicating they have claimed their salary), the system mints native Calary tokens. These tokens act as both rewards and credentials, enabling users to redeem perks such as ENS names, event tickets, or merchandise(based on our ecosystem partners). The system resets the flag post-minting to prevent abuse, ensuring that rewards are only granted once per claim cycle.

The ultimate goal of Calary is to act as a foundational layer that lets developers build “killer apps” on top of a secure, compliant, and incentivized financial ecosystem. While some of the more advanced features like full zk-privacy integration and decentralized milestone validation are prototyped for future iterations (), the current implementation provides a robust, scalable, and developer-friendly environment to kickstart next-generation consumer applications.

Calary is engineered with a modular, microservices-inspired architecture that ties together state-of-the-art blockchain technologies, smart contract development practices, and modern web frameworks.

**Smart Contracts & On-Chain Logic:**

- **Foundry & Solidity:** The backbone of Calary is built in Solidity, with development, testing, and deployment handled through Foundry. Contracts are structured to support multiple modules: a Registry contract for user data, distinct payroll contracts (for time-based, custom logic, and milestone-based payrolls), and swap logic contracts integrating Uniswap v4 Hooks.
- **Registry Contract:** This contract manages user compliance by recording wallet addresses, passport expiry dates, and a `rewarded` flag. It’s deployed on Celo, ensuring native integration with Celo’s ecosystem.
- **Payroll Contracts:**

  - _Time-Based Payroll:_ Implements straightforward scheduling logic allowing fixed-interval claims.
  - _Custom Logic Payroll:_ Requires employers to implement the `ICustomPayrollLogic` interface. This module is designed for flexibility and future zk-privacy integration to protect sensitive data ().
  - _Milestone-Based Payroll:_ Uses event-driven triggers. While the current version is a proof-of-concept relying on event signature verification, the design anticipates full decentralization in later stages ().

- **Swap Logic with Uniswap v4:** Calary integrates Uniswap v4 Hooks to enhance swap functionality. Two custom hooks—`beforeSwap` and `afterSwap`—ensure that only compliant, verified users participate and that payroll participants are rewarded with Calary tokens. The hooks perform real-time checks on the user's verification status and manage the minting process, resetting the `rewarded` flag appropriately.

**Off-Chain & Cross-Chain Infrastructure:**

- **Hyperlane for Cross-Chain Data:** Hyperlane is used to relay verification data (wallet addresses and passport expiry) from the verification contract CVLayer to other chains. A backend service listens to events from the CVLayer and triggers Hyperlane’s relays, ensuring that the user’s compliance status is accessible wherever needed.
- **KYC Integration via Self Protocol:** The onboarding flow incorporates Self Protocol, where users selectively disclose their passport data. This integration ensures that only users meeting the required compliance standards are allowed into the system.

**Frontend & Backend (Minimal, Just to Prove It Works)**

- **Simple UI with Hardcoded Values**: I implemented a minimal frontend that demonstrates how the system works:

  - Role selection (Boss or Employee)
  - Deploy payroll contracts
  - Call key functions like `depositFunds`, `addEmployee`, and `claimPayroll`
  - Display Calary token minting logic via hook interaction

- **Why So Minimal?**  
  As a solo developer specializing in smart contracts, I opted to hardcode addresses, use basic inputs, and skip advanced design work. The frontend exists purely to **show that the system is real and live**, not to win a design prize.

- **Backend**: A mock backend using a dummy private key simulates a "gas master" that triggers state-changing functions like `claimPayroll` or swap settlement, aligning with the system's intended UX abstraction.
