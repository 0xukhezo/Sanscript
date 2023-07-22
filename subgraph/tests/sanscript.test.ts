import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { Newsletter, Owner } from "../generated/schema"
import { AddedNewsletter as AddedNewsletterEvent } from "../generated/Sanscript/Sanscript"
import { handleAddedNewsletter } from "../src/mapping/sanscript"
import { createAddedNewsletterEvent } from "./sanscript-utils"
import { ONE_BI } from "../src/utils/constants"

const newsletterOwner = Address.fromString("0x0000000000000000000000000000000000000001")
const newsletterNonce = 0
let image = "QmeY1hzYDbwKGGbsQbPDX8bsWN8CgCtDnfUeMmpXJaTUea"
let title = "Example new newsletter"
let description = "Description example for new newsletter"
let token = "0xd55c3f5961Ec1ff0eC1741eDa7bc2f5962c3c454"
let pricePerMonth = BigInt.fromI32(10)

describe("Describe entity assertions", () => {
  beforeAll(() => {
  
    let newAddedNewsletterEvent = createAddedNewsletterEvent(
      newsletterOwner,
      newsletterNonce,
      image,
      title,
      description,
      token,
      pricePerMonth
    )
    handleAddedNewsletter(newAddedNewsletterEvent)

  })

  afterAll(() => {
    clearStore()
  })


  test("handleAddedNewsletter: Should have been created Newsletter entity", () => {
    assert.entityCount("Newsletter", 1) 
  })

  test("handleAddedNewsletter: Should have been created Newsletter entity with rigth parameters",() => {

    let id = newsletterOwner.toHexString().concat("_").concat(newsletterNonce.toString())
    let retrieveNewsletter = Newsletter.load(id)

    assert.assertNotNull(retrieveNewsletter)
    assert.stringEquals(id.toString(),id)
    assert.addressEquals(Address.fromString(retrieveNewsletter!.newsletterOwner), newsletterOwner)
    assert.i32Equals(retrieveNewsletter!.newsletterNonce,newsletterNonce)
    assert.stringEquals(retrieveNewsletter!.image,image)
    assert.stringEquals(retrieveNewsletter!.title,title)
    assert.stringEquals(retrieveNewsletter!.description, description)
    assert.stringEquals(retrieveNewsletter!.token, token.toLowerCase())
    assert.bigIntEquals(retrieveNewsletter!.pricePerMonth, pricePerMonth)

  })

  test("handleAddedNewsletter: Should have been created Owner entity", () => {
    assert.entityCount("Owner",1)
  })

  test("handleAddedNewsletter: Should have been created Owner entity with right parameters", () => {
    
    let owner = Owner.load(newsletterOwner.toHexString())
    assert.assertNotNull(owner)
    assert.bigIntEquals(owner!.newslettersAmount, ONE_BI)

  })


})
