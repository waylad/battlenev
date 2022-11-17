import { expect } from "chai";

export function shouldBehaveLikeSpaceCoins(): void {
  it("should behave like space coins", async function () {
    const owner = await this.spaceCoins.owner()
    expect(this.signers.admin.address).to.equal(owner);
  });
}
