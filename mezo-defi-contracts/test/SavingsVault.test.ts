import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("SavingsVault", function () {
  async function deployFixture() {
    const [owner, user1, user2] = await ethers.getSigners();

    // Deploy mock MUSD token
    const MockToken = await ethers.getContractFactory("MockERC20");
    const musd = await MockToken.deploy("Mezo USD", "MUSD", 18);
    await musd.waitForDeployment();

    // Deploy SavingsVault
    const SavingsVault = await ethers.getContractFactory("SavingsVault");
    const vault = await SavingsVault.deploy(await musd.getAddress());
    await vault.waitForDeployment();

    // Mint tokens to users
    const mintAmount = ethers.parseEther("10000");
    await musd.mint(user1.address, mintAmount);
    await musd.mint(user2.address, mintAmount);

    // Approve vault to spend tokens
    await musd.connect(user1).approve(await vault.getAddress(), mintAmount);
    await musd.connect(user2).approve(await vault.getAddress(), mintAmount);

    return { vault, musd, owner, user1, user2 };
  }

  describe("Deployment", function () {
    it("Should set the correct MUSD token address", async function () {
      const { vault, musd } = await loadFixture(deployFixture);
      expect(await vault.musd()).to.equal(await musd.getAddress());
    });

    it("Should set the correct owner", async function () {
      const { vault, owner } = await loadFixture(deployFixture);
      expect(await vault.owner()).to.equal(owner.address);
    });

    it("Should start with zero deposits", async function () {
      const { vault } = await loadFixture(deployFixture);
      expect(await vault.totalDeposits()).to.equal(0);
    });
  });

  describe("Deposits", function () {
    it("Should allow users to deposit MUSD", async function () {
      const { vault, user1 } = await loadFixture(deployFixture);
      const depositAmount = ethers.parseEther("1000");

      await expect(vault.connect(user1).deposit(depositAmount))
        .to.emit(vault, "Deposited")
        .withArgs(user1.address, depositAmount, 1000n);

      expect(await vault.totalDeposits()).to.equal(depositAmount);
    });

    it("Should track user deposits correctly", async function () {
      const { vault, user1 } = await loadFixture(deployFixture);
      const depositAmount = ethers.parseEther("1000");

      await vault.connect(user1).deposit(depositAmount);

      const [amount, entries] = await vault.getUserDeposit(user1.address);
      expect(amount).to.equal(depositAmount);
      expect(entries).to.equal(1000n);
    });

    it("Should add user to participants list", async function () {
      const { vault, user1 } = await loadFixture(deployFixture);
      const depositAmount = ethers.parseEther("1000");

      await vault.connect(user1).deposit(depositAmount);

      expect(await vault.isParticipant(user1.address)).to.be.true;
      expect(await vault.getParticipantCount()).to.equal(1);
    });

    it("Should revert on zero deposit", async function () {
      const { vault, user1 } = await loadFixture(deployFixture);
      await expect(vault.connect(user1).deposit(0)).to.be.revertedWith("Amount must be > 0");
    });
  });

  describe("Withdrawals", function () {
    it("Should allow users to withdraw MUSD", async function () {
      const { vault, musd, user1 } = await loadFixture(deployFixture);
      const depositAmount = ethers.parseEther("1000");
      const withdrawAmount = ethers.parseEther("500");

      await vault.connect(user1).deposit(depositAmount);
      
      const balanceBefore = await musd.balanceOf(user1.address);
      await vault.connect(user1).withdraw(withdrawAmount);
      const balanceAfter = await musd.balanceOf(user1.address);

      expect(balanceAfter - balanceBefore).to.equal(withdrawAmount);
      expect(await vault.totalDeposits()).to.equal(depositAmount - withdrawAmount);
    });

    it("Should update entries after withdrawal", async function () {
      const { vault, user1 } = await loadFixture(deployFixture);
      const depositAmount = ethers.parseEther("1000");
      const withdrawAmount = ethers.parseEther("500");

      await vault.connect(user1).deposit(depositAmount);
      await vault.connect(user1).withdraw(withdrawAmount);

      const [amount, entries] = await vault.getUserDeposit(user1.address);
      expect(amount).to.equal(depositAmount - withdrawAmount);
      expect(entries).to.equal(500n);
    });

    it("Should revert on insufficient balance", async function () {
      const { vault, user1 } = await loadFixture(deployFixture);
      const depositAmount = ethers.parseEther("1000");

      await vault.connect(user1).deposit(depositAmount);
      
      await expect(vault.connect(user1).withdraw(ethers.parseEther("2000")))
        .to.be.revertedWith("Insufficient balance");
    });
  });

  describe("Prize Pool", function () {
    it("Should allow owner to collect yield", async function () {
      const { vault, musd, owner } = await loadFixture(deployFixture);
      const yieldAmount = ethers.parseEther("100");

      await musd.mint(owner.address, yieldAmount);
      await musd.connect(owner).approve(await vault.getAddress(), yieldAmount);

      await expect(vault.connect(owner).collectYield(yieldAmount))
        .to.emit(vault, "YieldCollected")
        .withArgs(yieldAmount);

      expect(await vault.prizePool()).to.equal(yieldAmount);
    });

    it("Should only allow owner to collect yield", async function () {
      const { vault, musd, user1 } = await loadFixture(deployFixture);
      const yieldAmount = ethers.parseEther("100");

      await musd.mint(user1.address, yieldAmount);
      await musd.connect(user1).approve(await vault.getAddress(), yieldAmount);

      await expect(vault.connect(user1).collectYield(yieldAmount))
        .to.be.revertedWithCustomError(vault, "OwnableUnauthorizedAccount");
    });
  });

  describe("Total Entries", function () {
    it("Should calculate total entries correctly", async function () {
      const { vault, user1, user2 } = await loadFixture(deployFixture);

      await vault.connect(user1).deposit(ethers.parseEther("1000"));
      await vault.connect(user2).deposit(ethers.parseEther("2000"));

      expect(await vault.getTotalEntries()).to.equal(3000n);
    });
  });
});
