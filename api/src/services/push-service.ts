import * as PushAPI from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { ethers } from "ethers";

async function sendPushNotification(
  addresses: Array<string>,
  owner: string,
  newsletterTitle: string,
  newsletterText: string
) {
  const wallet = new ethers.Wallet(`0x${process.env.WALLET_KEY}`);

  const apiResponse = await PushAPI.payloads.sendNotification({
    signer: wallet,
    type: 4, // subset
    identityType: 2, // direct payload
    notification: {
      title: `Test:`,
      body: `test ${owner}`,
    },
    payload: {
      title: `${newsletterTitle}`,
      body: `${newsletterText.slice(0, 100)}`,
      cta: "",
      img: "",
    },
    recipients: convertAddress(addresses),
    channel: `eip155:${process.env.PUSH_CHAIN_ID!}:${wallet.address}`,
    env: ENV.STAGING,
  });

  // apiResponse?.status === 204, if sent successfully!
  if (!apiResponse || apiResponse?.status != 204) {
    console.error(apiResponse);
  }
}

const pushService = {
  sendPushNotification,
};

function convertAddress(addresses: Array<string>): Array<string> {
  return addresses.map((a) => `eip155:5:${a}`);
}

export default pushService;
