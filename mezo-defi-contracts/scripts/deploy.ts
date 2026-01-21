import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Mezo Mainnet Token Addresses
  const MUSD_ADDRESS = "0xdD468A1DDc392dcdbEf6db6e34E89AA338F9F186";
  const LP_TOKEN_ADDRESS = "0x52e604c44417233b6CcEDDDc0d640A405Caacefb"; // MUSD/BTC LP
  const MATS_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000"; // Replace with actual MATS address

  // Deploy SavingsVault
  console.log("\nDeploying SavingsVault...");
  const SavingsVault = await ethers.getContractFactory("SavingsVault");
  const savingsVault = await SavingsVault.deploy(MUSD_ADDRESS);
  await savingsVault.waitForDeployment();
  const savingsVaultAddress = await savingsVault.getAddress();
  console.log("SavingsVault deployed to:", savingsVaultAddress);

  // Deploy Staking
  console.log("\nDeploying Staking...");
  const REWARD_RATE = ethers.parseEther("0.1"); // 0.1 MATS per second
  const Staking = await ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(LP_TOKEN_ADDRESS, MATS_TOKEN_ADDRESS, REWARD_RATE);
  await staking.waitForDeployment();
  const stakingAddress = await staking.getAddress();
  console.log("Staking deployed to:", stakingAddress);

  // Summary
  console.log("\n========================================");
  console.log("Deployment Summary");
  console.log("========================================");
  console.log("Network: Mezo Mainnet (Chain ID: 31612)");
  console.log("SavingsVault:", savingsVaultAddress);
  console.log("Staking:", stakingAddress);
  console.log("========================================");

  // Verify contracts on explorer
  console.log("\nTo verify contracts on Mezo Explorer:");
  console.log(`npx hardhat verify --network mezo ${savingsVaultAddress} "${MUSD_ADDRESS}"`);
  console.log(`npx hardhat verify --network mezo ${stakingAddress} "${LP_TOKEN_ADDRESS}" "${MATS_TOKEN_ADDRESS}" "${REWARD_RATE}"`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
