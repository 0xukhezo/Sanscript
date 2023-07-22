import {
  EAS,
  Offchain,
  SchemaEncoder,
  SchemaRegistry,
} from "@ethereum-attestation-service/eas-sdk";
import { request, gql } from "graphql-request";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

async function generateAttestation(
  newsletterOwner: string,
  nonce: string,
  recipient: string,
  months: number
): Promise<string> {
  const today = new Date();
  today.setMonth(today.getMonth() + months);

  const expirationTime = Math.floor(today.getTime() / 1000);

  const provider = new ethers.providers.JsonRpcProvider(
    process.env.URL_ALCHEMY_PROVIDER!
  );

  const wallet = new ethers.Wallet(process.env.WALLET_KEY!, provider);

  const eas = new EAS(process.env.EAS_CONTRACT!);

  eas.connect(wallet);

    const schemaEncoder = new SchemaEncoder("address newsletterOwner, uint8 newsletterNonce");
    const encodedData = schemaEncoder.encodeData([
        { name: "newsletterOwner", value: ethers.utils.getAddress(newsletterOwner), type: "address" },
        { name: "newsletterNonce", value: nonce, type: "uint8" },
    ]);


  const tx = await eas.attest({
    schema: process.env.SCHEMA_UID!,
    data: {
      recipient: recipient,
      expirationTime: expirationTime,
      revocable: false,
      data: encodedData,
    },
  });

  const newAttestationUID = await tx.wait();

  console.log("New attestation UID:", newAttestationUID);

  return newAttestationUID;
}

type AttestationActiveResponseType = {
  recipient: string;
};

type AttestationsActivedResponseType = {
  attestations?: Array<AttestationActiveResponseType>;
};

async function getActivedSubscriptors(
  newsletterOwner: string,
  newsletterNonce: string
): Promise<Array<string>> {
  const variables = {
    where: {
      schemaId: {
        equals: process.env.SCHEMA_UID!,
      },
      expirationTime: {
        gte: Math.floor(Date.now() / 1000),
      },
      attester: {
        in: [
          new ethers.Wallet(process.env.WALLET_KEY!).address,
          process.env.NEWSLETTER_CONTRACT!,
        ],
      },
      decodedDataJson: {
        equals: fillSchemaJsonDecode(newsletterOwner, newsletterNonce),
      },
    },
  };

  const query = gql`
    query Attestations($where: AttestationWhereInput) {
      attestations(where: $where) {
        recipient
      }
    }
  `;

  const data = await request<AttestationsActivedResponseType>(
    process.env.EAS_API!,
    query,
    variables
  );

  if (data.attestations && data.attestations.length != 0) {
    return data?.attestations.map((e) => e.recipient);
  }

  return [];
}

function fillSchemaJsonDecode(
  newsletterOwner: string,
  newsletterNonce: string
) {

    return `[{\"name\":\"newsletterOwner\",\"type\":\"address\",\"signature\":\"address newsletterOwner\",\"value\":{\"name\":\"newsletterOwner\",\"type\":\"address\",\"value\":\"${newsletterOwner}\"}},{\"name\":\"newsletterNonce\",\"type\":\"uint8\",\"signature\":\"uint8 newsletterNonce\",\"value\":{\"name\":\"newsletterNonce\",\"type\":\"uint8\",\"value\":${newsletterNonce}}}]`

}

async function getMyNewslettersSubscription(address: string) {
  const variables = {
    where: {
      schemaId: {
        equals: process.env.SCHEMA_UID!,
      },
      expirationTime: {
        gte: Math.floor(Date.now() / 1000),
      },
      attester: {
        in: [
          new ethers.Wallet(process.env.WALLET_KEY!).address,
          process.env.NEWSLETTER_CONTRACT!,
        ],
      },
      recipient: {
        equals: address,
      },
    },
  };

  const query = gql`
    query Attestations($where: AttestationWhereInput) {
      attestations(where: $where) {
        decodedDataJson
      }
    }
  `;

  const data = await request<AttestationsActivedResponseType>(
    process.env.EAS_API!,
    query,
    variables
  );

  const dataParsed = parseDataMyNewsletterSubscription(data)

  return dataParsed;
}

const easService = {
  generateAttestation,
  getActivedSubscriptors,
  getMyNewslettersSubscription,
};

function parseDataMyNewsletterSubscription(data){

  let newsletters: Array<any> = []

  try{
    for (const attestation of data.attestations) {
      const attestationObj = JSON.parse(attestation.decodedDataJson)
      let newsletter = {
        newsletterOnwer: attestationObj[0].value.value,
        newsletterNonce: attestationObj[1].value.value
      } 
      newsletters.push(newsletter)
    }

    return newsletters
    
  } catch(error){
    console.log(error)
  }

}

export default easService;
