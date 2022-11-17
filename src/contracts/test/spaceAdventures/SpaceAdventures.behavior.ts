import { expect } from "chai";

export function shouldBehaveLikeSpaceAdventures(): void {
  it("should behave like space adventures", async function () {
    // Mint token
    const mintReceipt = await this.spaceAdventures
      .connect(this.signers.admin)
      .mintCollectable(
        this.signers.admin.address,
        "ipfs://QmTy8w65yBXgyfG2ZBg5TrfB2hPjrDQH3RCQFJGkARStJb",
        "Test Token",
        2,
        false,
      );
    const mintTx = await mintReceipt.wait();
    expect(mintTx?.events?.[0].event).to.equal("Transfer");

    // Check balance
    const adminBalance = await this.spaceAdventures.connect(this.signers.admin).balanceOf(this.signers.admin.address);
    expect(adminBalance).to.equal(1);
    const adminTokens = await this.spaceAdventures.connect(this.signers.admin).getTokensOwnedByMe();
    expect(adminTokens[0]).to.equal(1);

    // Transfer token
    const transferReceipt = await this.spaceAdventures
      .connect(this.signers.admin)
      .transferFrom(this.signers.admin.address, this.signers.alice.address, 1);
    await transferReceipt.wait();

    // Set on Sale
    const setSaleReceipt = await this.spaceAdventures.connect(this.signers.alice).setTokenSale(1, true, 42);
    await setSaleReceipt.wait();

    // Check tokens on sale
    const getSaleReceipt = await this.spaceAdventures.connect(this.signers.alice).getAllOnSale();
    expect(getSaleReceipt[0][0]).to.equal(1);

    // Buy token
    const buyReceipt = await this.spaceAdventures.connect(this.signers.bob).purchaseToken(1, {
      value: 42,
    });
    await buyReceipt.wait();

    // Check balance
    const bobBalance = await this.spaceAdventures.connect(this.signers.bob).balanceOf(this.signers.bob.address);
    expect(bobBalance).to.equal(1);
    const bobTokens = await this.spaceAdventures.connect(this.signers.bob).getTokensOwnedByMe();
    expect(bobTokens[0]).to.equal(1);

    // Check tokens on sale
    const getSaleReceipt2 = await this.spaceAdventures.connect(this.signers.alice).getAllOnSale();
    expect(getSaleReceipt2[0][0]).to.equal(0);
  });
}
