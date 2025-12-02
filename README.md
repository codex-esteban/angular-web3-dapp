# Angular Web3 dApp Integration

A robust, reactive Angular Decentralized Application (dApp) that integrates MetaMask wallet functionality using modern Web3 standards. This project demonstrates best practices for handling wallet connections, account switching, network detection, and state management in a Standalone Angular environment.

## 🚀 Features

*   **Wallet Connection:** Securely connect MetaMask using the Ethereum Provider API.
*   **EIP-6963 Support:** Implements "Multi-Injected Provider Discovery" to resolve conflicts between multiple wallets (e.g., Uniswap vs. MetaMask).
*   **Reactive State Management:** Uses RxJS `BehaviorSubjects` to instantly update the UI when accounts or networks change.
*   **Account Management:**
    *   Displays shortened wallet address with "Click-to-Copy".
    *   **Switch Account:** Triggers `wallet_requestPermissions` to allow users to switch active accounts within the dApp.
    *   **Hard Disconnect:** Revokes permissions (`wallet_revokePermissions`) to ensure a true logout state.
*   **Network Detection:**
    *   Detects Chain ID changes in real-time.
    *   Maps IDs to human-readable names (e.g., Mainnet, Ink Network).
    *   Displays warning banners for unsupported networks.

## 🛠️ Tech Stack

*   **Framework:** Angular v16+ (Standalone Components)
*   **Language:** TypeScript
*   **Web3 Libraries:** `ethers.js`, Native `window.ethereum` API
*   **Styling:** CSS3 (Flexbox/Grid)
*   **State:** RxJS

## ⚙️ Prerequisites

*   **Node.js** (v16 or higher)
*   **npm** or **yarn**
*   **MetaMask Extension** installed in your browser.

## 📦 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/codex-esteban/angular-web3-dapp.git
    cd your-repo-name
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    # or
    ng serve
    ```

4.  **Open Browser:**
    Navigate to `http://localhost:4200`.

## 🏗️ Architecture

This project follows a **Reactive Service Pattern** to ensure Separation of Concerns:

*   **`Web3Service` (The Brain):** A singleton service that handles all direct interactions with the blockchain provider. It maintains the global state (`account`, `network`, `isUnsupported`) and broadcasts changes via observables. This acts as the "Single Source of Truth."
*   **`AppComponent` (The View):** A Standalone Component that subscribes to the service's data. It contains no blockchain logic, focusing purely on presentation and user interaction.

## 🔧 Technical Highlights

*   **Polyfills:** Solved the common "Global is not defined" error in Angular Web3 apps by injecting Node.js globals in `src/main.ts`.
*   **Conflict Resolution:** Implemented event listeners for `eip6963:announceProvider` to specifically target MetaMask, bypassing other aggressive wallet extensions.

## 🤝 Contributing

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request# angular-web3-dapp
