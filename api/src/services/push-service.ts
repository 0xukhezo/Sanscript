import * as PushAPI from '@pushprotocol/restapi';
import { ENV } from '@pushprotocol/restapi/src/lib/constants'
import { ethers } from 'ethers';

async function sendPushNotification(addresses: Array<string>, owner: string, newsletterTitle: string, newsletterText: string) {

    console.log(process.env.PUSH_CHANNEL_ADDRESS!)

    const apiResponse = await PushAPI.payloads.sendNotification({
        signer: new ethers.Wallet(`0x${process.env.PUSH_CHANNEL_ADDRESS_PK!}`),
        type: 4, // subset
        identityType: 2, // direct payload
        notification: {
            title: `Test:`,
            body: `test ${owner}`,
        },
        payload: {
            title: `${newsletterTitle}`,
            body: `${newsletterText.slice(0,100)}`,
            cta: '',
            img: '',
        },
        recipients: convertAddress(addresses), 
        channel: `eip155:${process.env.PUSH_CHAIN_ID!}:${process.env.PUSH_CHANNEL_ADDRESS!}`, // your channel address
        env: ENV.STAGING,
    });

    const notifications = await PushAPI.user.getFeeds({
        user: 'eip155:5:0xCccC6FaAeF89d6ab9e86e655475b99CE6b991E7F', // user address in CAIP
        env: ENV.STAGING
      });

      console.log(notifications)


    // apiResponse?.status === 204, if sent successfully!
    if (!apiResponse || apiResponse?.status != 204) {
        console.error(apiResponse)
    }

}

const pushService = {
    sendPushNotification,
}

function convertAddress(addresses: Array<string>): Array<string> {
    return addresses.map(a=>`eip155:5:${a}`)
}

export default pushService