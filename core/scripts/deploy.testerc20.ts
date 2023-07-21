import { ethers } from "hardhat";
import { TestERC20__factory, TestERC20, ISchemaRegistry__factory, ISchemaRegistry } from "../typechain-types"


async function main() {
  
  const [ owner ] = await ethers.getSigners();

  const testERC20Factory: TestERC20__factory = await ethers.getContractFactory('TestERC20')
  const testERC20: TestERC20 = await testERC20Factory.deploy()

  console.log(
    `TestERC20: ${ testERC20.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
