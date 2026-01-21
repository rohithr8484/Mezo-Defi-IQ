// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SavingsVault
 * @notice No-loss prize savings pool for MUSD deposits on Mezo
 * @dev Deposited MUSD generates yield which forms a prize pool for participants
 */
contract SavingsVault is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // ============ State Variables ============

    IERC20 public immutable musd;
    
    uint256 public totalDeposits;
    uint256 public prizePool;
    uint256 public lastYieldDistribution;
    uint256 public constant PRIZE_PERIOD = 7 days;
    
    struct UserDeposit {
        uint256 amount;
        uint256 depositTime;
        uint256 entries;
    }
    
    mapping(address => UserDeposit) public deposits;
    address[] public participants;
    mapping(address => bool) public isParticipant;

    // ============ Events ============

    event Deposited(address indexed user, uint256 amount, uint256 entries);
    event Withdrawn(address indexed user, uint256 amount);
    event YieldCollected(uint256 amount);
    event PrizeAwarded(address indexed winner, uint256 amount);

    // ============ Constructor ============

    constructor(address _musd) Ownable(msg.sender) {
        musd = IERC20(_musd);
        lastYieldDistribution = block.timestamp;
    }

    // ============ External Functions ============

    /**
     * @notice Deposit MUSD into the savings vault
     * @param amount Amount of MUSD to deposit
     */
    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        
        musd.safeTransferFrom(msg.sender, address(this), amount);
        
        if (!isParticipant[msg.sender]) {
            participants.push(msg.sender);
            isParticipant[msg.sender] = true;
        }
        
        deposits[msg.sender].amount += amount;
        deposits[msg.sender].depositTime = block.timestamp;
        deposits[msg.sender].entries += amount / 1e18; // 1 entry per MUSD
        
        totalDeposits += amount;
        
        emit Deposited(msg.sender, amount, deposits[msg.sender].entries);
    }

    /**
     * @notice Withdraw MUSD from the savings vault
     * @param amount Amount of MUSD to withdraw
     */
    function withdraw(uint256 amount) external nonReentrant {
        require(deposits[msg.sender].amount >= amount, "Insufficient balance");
        
        deposits[msg.sender].amount -= amount;
        deposits[msg.sender].entries = deposits[msg.sender].amount / 1e18;
        totalDeposits -= amount;
        
        musd.safeTransfer(msg.sender, amount);
        
        emit Withdrawn(msg.sender, amount);
    }

    /**
     * @notice Claim prize if selected as winner
     */
    function claimPrize() external nonReentrant {
        require(prizePool > 0, "No prize available");
        require(block.timestamp >= lastYieldDistribution + PRIZE_PERIOD, "Prize period not ended");
        
        address winner = _selectWinner();
        require(winner == msg.sender, "Not the winner");
        
        uint256 prize = prizePool;
        prizePool = 0;
        lastYieldDistribution = block.timestamp;
        
        musd.safeTransfer(winner, prize);
        
        emit PrizeAwarded(winner, prize);
    }

    /**
     * @notice Collect yield from DeFi strategies (called by yield strategy)
     * @param yieldAmount Amount of yield to add to prize pool
     */
    function collectYield(uint256 yieldAmount) external onlyOwner {
        musd.safeTransferFrom(msg.sender, address(this), yieldAmount);
        prizePool += yieldAmount;
        
        emit YieldCollected(yieldAmount);
    }

    // ============ View Functions ============

    function getUserDeposit(address user) external view returns (uint256 amount, uint256 entries) {
        return (deposits[user].amount, deposits[user].entries);
    }

    function getParticipantCount() external view returns (uint256) {
        return participants.length;
    }

    function getTotalEntries() public view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < participants.length; i++) {
            total += deposits[participants[i]].entries;
        }
        return total;
    }

    // ============ Internal Functions ============

    function _selectWinner() internal view returns (address) {
        uint256 totalEntries = getTotalEntries();
        require(totalEntries > 0, "No entries");
        
        uint256 random = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            totalDeposits
        ))) % totalEntries;
        
        uint256 cumulative = 0;
        for (uint256 i = 0; i < participants.length; i++) {
            cumulative += deposits[participants[i]].entries;
            if (random < cumulative) {
                return participants[i];
            }
        }
        
        return participants[0];
    }
}
