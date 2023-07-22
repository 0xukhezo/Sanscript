import {
  AddedNewsletter as AddedNewsletterEvent,
  ChangedNewsletterPrice as ChangedNewsletterPriceEvent,
  OwnershipTransferred as OwnershipTransferredEvent
} from "../generated/Sanscript/Sanscript"
import {
  AddedNewsletter,
  ChangedNewsletterPrice,
  OwnershipTransferred
} from "../generated/schema"

export function handleAddedNewsletter(event: AddedNewsletterEvent): void {
  let entity = new AddedNewsletter(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newsletterOwner = event.params.newsletterOwner
  entity.newsletterNonce = event.params.newsletterNonce
  entity.image = event.params.image
  entity.title = event.params.title
  entity.description = event.params.description
  entity.pricePerMonth = event.params.pricePerMonth

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleChangedNewsletterPrice(
  event: ChangedNewsletterPriceEvent
): void {
  let entity = new ChangedNewsletterPrice(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newsletterOwner = event.params.newsletterOwner
  entity.newsletterNonce = event.params.newsletterNonce
  entity.newPrice = event.params.newPrice

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
