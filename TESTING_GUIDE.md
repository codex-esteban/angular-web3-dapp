# MetaMask Integration - Quick Testing Guide

## Quick Start

1. **Start the application**:
   ```bash
   npm install
   npm run dev
   ```
   Access at: http://localhost:4201

2. **Prerequisites**:
   - MetaMask browser extension installed
   - At least one Ethereum account in MetaMask
   - MetaMask unlocked

## Testing Checklist

### ✅ 1. Connect Wallet
- [ ] Navigate to home page
- [ ] Verify "Connect Wallet" button is visible
- [ ] Click "Connect Wallet"
- [ ] MetaMask popup appears
- [ ] Approve connection
- [ ] Wallet address displays in shortened format (0x1234...abcd)
- [ ] Full address is also shown

### ✅ 2. Account Switching
- [ ] With wallet connected, open MetaMask
- [ ] Switch to a different account
- [ ] Verify the displayed address updates automatically
- [ ] No manual refresh needed

### ✅ 3. Network Switching
- [ ] With wallet connected, open MetaMask
- [ ] Switch network (e.g., Ethereum Mainnet → Sepolia)
- [ ] Page reloads automatically
- [ ] New network name and Chain ID displayed
- [ ] Network status shown as supported (blue background)

### ✅ 4. Unsupported Network Warning
- [ ] Switch to an unsupported network (e.g., Localhost, or any custom network)
- [ ] Warning message displays in red
- [ ] Message indicates network is unsupported
- [ ] Suggestion to switch to supported network

### ✅ 5. Error Handling
- [ ] Test with MetaMask disabled/uninstalled
- [ ] Verify warning message: "MetaMask is not installed"
- [ ] Re-enable MetaMask
- [ ] Click "Connect Wallet" and reject in MetaMask
- [ ] Verify error message: "Connection request rejected by user"

### ✅ 6. Disconnect Functionality
- [ ] With wallet connected, click "Disconnect" button
- [ ] Wallet address clears
- [ ] Network info clears
- [ ] "Connect Wallet" button appears again

## Supported Networks to Test

1. **Ethereum Mainnet** (Chain ID: 0x1)
2. **Sepolia Testnet** (Chain ID: 0xaa36a7)
3. **Polygon Mainnet** (Chain ID: 0x89)
4. **BSC Mainnet** (Chain ID: 0x38)

Any network not in the supported list will show a warning.

## Video Recording Guide

### What to Record:

1. **Introduction** (5 seconds)
   - Show the home page with "Connect Wallet" button

2. **Connect Wallet** (10 seconds)
   - Click "Connect Wallet"
   - Show MetaMask popup
   - Approve connection
   - Show connected wallet address

3. **Account Switching** (10 seconds)
   - Open MetaMask
   - Switch to different account
   - Show address update in app

4. **Network Switching** (15 seconds)
   - Open MetaMask
   - Switch from one network to another (e.g., Mainnet → Sepolia)
   - Show page reload
   - Show network info update

5. **Unsupported Network** (10 seconds)
   - Switch to unsupported network
   - Show warning message

6. **Disconnect** (5 seconds)
   - Click disconnect
   - Show cleared state

**Total Duration**: ~60 seconds

### Recording Tools:
- **macOS**: QuickTime Player (File → New Screen Recording)
- **Windows**: Xbox Game Bar (Win + G)
- **Linux**: OBS Studio, SimpleScreenRecorder
- **Cross-platform**: OBS Studio, Loom

## Expected Behavior Summary

| Action | Expected Result |
|--------|----------------|
| Click "Connect Wallet" | MetaMask popup appears |
| Approve connection | Address displays in format 0x1234...abcd |
| Switch account | Address updates automatically |
| Switch network | Page reloads, new network shown |
| Unsupported network | Red warning message |
| No MetaMask | Yellow warning message |
| Reject connection | Error message displayed |
| Click "Disconnect" | Wallet info clears |

## File Locations for Review

- **Web3 Service**: `src/app/lib/services/web3/web3.service.ts`
- **Home Component**: `src/app/pages/home/home.component.ts`
- **Home Template**: `src/app/pages/home/home.component.html`
- **Tests**: `src/app/lib/services/web3/web3.service.spec.ts`

## Troubleshooting

**Problem**: "Connect Wallet" button doesn't appear
- **Solution**: Check if MetaMask is installed and page is fully loaded

**Problem**: Connection doesn't work
- **Solution**: Make sure MetaMask is unlocked

**Problem**: Network change not detected
- **Solution**: This is normal - page reloads automatically (MetaMask best practice)

**Problem**: Address doesn't update on account switch
- **Solution**: Refresh the page and try again

---

**Ready to Test**: All features implemented and working ✅