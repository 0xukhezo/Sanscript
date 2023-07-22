import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  AddedNewsletter,
  ChangedNewsletterPrice,
  OwnershipTransferred
} from "../generated/Sanscript/Sanscript"

export function createAddedNewsletterEvent(
  newsletterOwner: Address,
  newsletterNonce: i32,
  image: string,
  title: string,
  description: string,
  token: string,
  pricePerMonth: BigInt
): AddedNewsletter {
  let addedNewsletterEvent = changetype<AddedNewsletter>(newMockEvent())

  addedNewsletterEvent.parameters = new Array()

  addedNewsletterEvent.parameters.push(
    new ethereum.EventParam(
      "newsletterOwner",
      ethereum.Value.fromAddress(newsletterOwner)
    )
  )
  addedNewsletterEvent.parameters.push(
    new ethereum.EventParam(
      "newsletterNonce",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(newsletterNonce))
    )
  )
  addedNewsletterEvent.parameters.push(
    new ethereum.EventParam("image", ethereum.Value.fromString(image))
  )
  addedNewsletterEvent.parameters.push(
    new ethereum.EventParam("title", ethereum.Value.fromString(title))
  )
  addedNewsletterEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )

  addedNewsletterEvent.parameters.push(
    new ethereum.EventParam(
      "token",
      ethereum.Value.fromAddress(Address.fromString(token))
    )
  )

  addedNewsletterEvent.parameters.push(
    new ethereum.EventParam(
      "pricePerMonth",
      ethereum.Value.fromUnsignedBigInt(pricePerMonth)
    )
  )

  return addedNewsletterEvent
}

export function createChangedNewsletterPriceEvent(
  newsletterOwner: Address,
  newsletterNonce: i32,
  newPrice: BigInt
): ChangedNewsletterPrice {
  let changedNewsletterPriceEvent = changetype<ChangedNewsletterPrice>(
    newMockEvent()
  )

  changedNewsletterPriceEvent.parameters = new Array()

  changedNewsletterPriceEvent.parameters.push(
    new ethereum.EventParam(
      "newsletterOwner",
      ethereum.Value.fromAddress(newsletterOwner)
    )
  )
  changedNewsletterPriceEvent.parameters.push(
    new ethereum.EventParam(
      "newsletterNonce",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(newsletterNonce))
    )
  )
  changedNewsletterPriceEvent.parameters.push(
    new ethereum.EventParam(
      "newPrice",
      ethereum.Value.fromUnsignedBigInt(newPrice)
    )
  )

  return changedNewsletterPriceEvent
}
