import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { TestERC20__factory, TestERC20, ISchemaRegistry__factory, ISchemaRegistry } from "../typechain-types"

describe("sanscript.test", function () {

    async function setUp() {

        const [owner, account1, account2] = await ethers.getSigners();

        const testERC20Factory: TestERC20__factory = await ethers.getContractFactory('TestERC20')
        const testERC20: TestERC20 = await testERC20Factory.deploy()
        await testERC20.mint(ethers.parseEther("1000"), account1.address)

        const Sanscript = await ethers.getContractFactory("Sanscript");
        const sanscript = await Sanscript.deploy(testERC20.target, process.env.PRICE!, process.env.EAS_ADDRESS!, process.env.SCHEMA_UID!, process.env.WORLD_ID!, process.env.APP_ID!, process.env.ACTION_ID!);

        return { sanscript, testERC20, owner, account1, account2 };
    }

    describe("Add newsletter", function () {
        it("Should add new newsletter right", async function () {
            const {sanscript, testERC20, owner, account1, account2 } = await loadFixture(setUp);

            const sanscriptAddr = await sanscript.getAddress()
            testERC20.connect(account1).approve(sanscriptAddr, ethers.parseEther("1") )

            await expect(sanscript.connect(account1).addNewsletter(
                    "QmeY1hzYDbwKGGbsQbPDX8bsWN8CgCtDnfUeMmpXJaTUea",
                    "My first newsletter", 
                    "My first newsletter where i am going to speak about DeFi",
                    testERC20.target,
                    ethers.parseEther("10")
                )
            )
            .to.emit(sanscript, "AddedNewsletter")
            .withArgs(
                account1.address,
                0,
                "QmeY1hzYDbwKGGbsQbPDX8bsWN8CgCtDnfUeMmpXJaTUea",
                "My first newsletter", 
                "My first newsletter where i am going to speak about DeFi",
                testERC20.target,
                ethers.parseEther("10")
            )

        });
        it("Should increment nonce for next newsletter", async function () {
            const {sanscript, testERC20, owner, account1, account2 } = await loadFixture(setUp);

            const sanscriptAddr = await sanscript.getAddress()
            testERC20.connect(account1).approve(sanscriptAddr, ethers.parseEther("2") )

            const tx1 = await sanscript.connect(account1).addNewsletter(
                "QmeY1hzYDbwKGGbsQbPDX8bsWN8CgCtDnfUeMmpXJaTUea",
                "My first newsletter", 
                "My first newsletter where i am going to speak about DeFi",
                testERC20.target,
                ethers.parseEther("10")
            )
            await tx1.wait(1)

            const tx2 = await sanscript.connect(account1).addNewsletter(
                "QmeY1hzYDbwKGGbsQbPDX8bsWN8CgCtDnfUeMmpXJaTUea",
                "My second newsletter", 
                "My second newsletter where i am going to speak about DeFi2.0",
                testERC20.target,
                ethers.parseEther("10")
            )
            const txReceipt2 = await tx2.wait(1)
            
            const [newsletterOwner, newsletterNonce, image, title, description, token, pricePerMonth] = txReceipt2?.logs[2].args
         
            expect(newsletterOwner).to.equal(account1.address)
            expect(newsletterNonce).to.equal(1)
            expect(image).to.equal("QmeY1hzYDbwKGGbsQbPDX8bsWN8CgCtDnfUeMmpXJaTUea")
            expect(title).to.equal("My second newsletter")
            expect(description).to.equal("My second newsletter where i am going to speak about DeFi2.0")
            expect(token).to.equal(testERC20.target)
            expect(pricePerMonth).to.equal(ethers.parseEther("10"))
        });

    });
    describe("Subscribe", function () {
        async function setUpSubscribe() {
            const {sanscript, testERC20, owner, account1, account2 } = await loadFixture(setUp);

            //Add newsletter
            const sanscriptAddr = await sanscript.getAddress()
            testERC20.connect(account1).approve(sanscriptAddr, ethers.parseEther("1") )

            const tx = await sanscript.connect(account1).addNewsletter(
                "QmeY1hzYDbwKGGbsQbPDX8bsWN8CgCtDnfUeMmpXJaTUea",
                "My first newsletter", 
                "My first newsletter where i am going to speak about DeFi",
                testERC20.target,
                ethers.parseEther("10") 
            )
            const txReceipt = await tx.wait(1)
            const [newsletterOwner, newsletterNonce, title, description, pricePerMonth] = txReceipt?.logs[2].args

            return { sanscript, sanscriptAddr, testERC20, owner, account1, account2, newsletterNonce, pricePerMonth };
             
        }

        it("Should subcribe to newsletter", async function () {
            const {sanscript, sanscriptAddr, testERC20, owner, account1, account2, newsletterNonce, pricePerMonth } = await loadFixture(setUpSubscribe);

            await testERC20.mint(ethers.parseEther("100"), account2.address)

            testERC20.connect(account2).approve(sanscriptAddr, ethers.parseEther("30") )
            await sanscript.connect(account2).subscribeNewsletter(account1.address,newsletterNonce)
   
        });
    
    });

});
