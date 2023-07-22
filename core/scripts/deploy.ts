import { ethers } from "hardhat";

async function main() {

  const Sanscript = await ethers.getContractFactory("Sanscript");
  const sanscript = await Sanscript.deploy(process.env.USDC!, process.env.PRICE!, process.env.EAS_ADDRESS!, process.env.SCHEMA_UID!, process.env.WORLD_ID!, process.env.APP_ID!, process.env.ACTION_ID!);

  await sanscript.waitForDeployment();

  console.log(
    `Sanscript with deployed to ${sanscript.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
