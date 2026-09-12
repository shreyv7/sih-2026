# Smart India Hackathon (SIH 2026) — Problem Statement SIH26183

## Real-Time Identification of Fraud-Linked Cryptocurrency Exchanges from Victim-Reported Suspect Wallet Addresses through Automated Blockchain Analytics

**Domain:** Blockchain & Cybersecurity  
**Target Ministry:** Ministry of Home Affairs (MHA) / Indian Cyber Crime Coordination Centre (I4C)  
**Category:** Software (Frontline Cyber Crime Investigation & Automated Triage)

---

## 📌 Executive Overview

This directory contains the comprehensive, mathematically grounded, and legally vetted research and architectural dossier for **SIH26183**. The system automates the immediate triage, tracing, entity attribution, typology classification, and risk scoring of fraudulent cryptocurrency flows reported by Indian cybercrime victims (e.g., via NCRP / 1930 Helpline).

The architecture bridges **immutable on-chain blockchain event logs** with **Indian statutory criminal procedure**, enabling law enforcement officers to automatically issue legally admissible summon and freeze notices under **Section 94 of Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023** backed by digital evidence certificates compliant with **Section 63 of Bharatiya Sakshya Adhiniyam (BSA), 2023**.

---

## 📑 Role Research Reports Directory

The research is organized across six specialized, cross-referenced architectural roles:

| Role & File | Title & Focus Area | Key Methodologies & Contributions |
| :--- | :--- | :--- |
| **[P1.md](./P1.md)** | **Existing Market Solutions & Competitive Analysis** | • 10-tool comparative benchmark (Chainalysis, TRM, Elliptic, Crystal, Arkham, Breadcrumbs, etc.)<br>• Indian LEA operational triage workflows & SLA gap analysis<br>• Technical feasibility boundaries & self-hosted open-source vs. commercial trade-offs |
| **[P2.md](./P2.md)** | **Blockchain Analytics & Transaction Tracing Engine** | • Token transfer event log decoding (`Transfer(address,address,uint256)`) on TRC-20 & EVM<br>• Internal contract call tracing (`txlistinternal`)<br>• Proportional Haircut vs. FIFO vs. Poison taint models<br>• Bounded BFS traversal ($k \le 4$) with temporal and value-dust pruning |
| **[P3.md](./P3.md)** | **Entity Attribution, CEX Wallet Architecture & Evidence Chains** | • Centralized Exchange (CEX) Two-Layer Custodial Model (Ephemeral Deposit vs. Hot Wallet)<br>• 4-stage automated sweep lifecycle & gas subsidization heuristic<br>• Additive confidence scoring engine (0–100)<br>• Section 94 BNSS statutory summon/freeze requisition template |
| **[P4.md](./P4.md)** | **Crypto Fraud Typologies & Suspicious Behaviour Detection** | • Formalized detectors for Indian cybercrime syndicates (Task scams, SEBI stock fraud, Digital arrest)<br>• Mathematical formulations for Fan-In, Rapid Relay, Peeling Chains, and Mixers<br>• Co-Occurrence Matrix & False-Positive Suppression (AMMs, payroll, merchants)<br>• Court-admissible JSON `BehavioralEvidencePacket` schema |
| **[P5.md](./P5.md)** | **Data Sources, Ingestion Architecture & Cost Engineering** | • 10-provider evaluation matrix (Alchemy, Etherscan, TronGrid, Mempool.space, Blockscout)<br>• Full Node vs. Hosted API trade-off (12+ TB NVMe vs. cloud RPC + cache)<br>• Sliding Token-Bucket rate limiting & SQLite local caching schema (`transaction_cache`)<br>• API cost simulation ($0.00/mo hackathon tier to ₹15,000/mo state cyber cell) |
| **[P6.md](./P6.md)** | **Detection, Risk Scoring & AI/ML Architecture** | • Glass-Box Explainable Scoring Architecture (Section 63 BSA compliance)<br>• 12-dimensional topological and behavioral feature vector $\mathbf{x}_u$<br>• Deterministic rule specifications ($R_1 \dots R_5$)<br>• Unsupervised Isolation Forest outlier detection ($s(\mathbf{x}, n)$, max 15 pts)<br>• ML feasibility critique (XGBoost, Random Forest, GNN latency/explainability trade-offs) |

---

## ⚖️ Legal & Regulatory Grounding

All reports adhere strictly to current Indian criminal jurisprudence:
- **BNSS, 2023 (Section 94):** Replaces Section 91 CrPC for requisitioning transaction records and issuing freezing directives to VDA exchanges.
- **BSA, 2023 (Section 63):** Replaces Section 65B of the Indian Evidence Act for the admissibility of electronic records and cryptographic hash verifications.
- **FIU-IND Compliance:** Aligned with Financial Intelligence Unit – India registration guidelines for Offshore and Onshore Virtual Digital Asset Service Providers (VDASPs).
- **PMLA, 2002:** Prevention of Money Laundering Act reporting standards.
