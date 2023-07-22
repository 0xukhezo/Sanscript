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
  const nonceHexa = `0x${parseInt(newsletterNonce, 10)
    .toString(16)
    .padStart(2, "0")}`;

    const nonceHexa = `0x${parseInt(newsletterNonce, 10).toString(16).padStart(2, "0")}`
    console.log(nonceHexa)
    return `[{\"name\":\"a\",\"type\":\"address\",\"signature\":\"address a\",\"value\":{\"name\":\"a\",\"type\":\"address\",\"value\":\"${newsletterOwner}\"}},{\"name\":\"b\",\"type\":\"uint256\",\"signature\":\"uint256 b\",\"value\":{\"name\":\"b\",\"type\":\"uint256\",\"value\":{\"type\":\"BigNumber\",\"hex\":\"${nonceHexa}\"}}}]`

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

  return data;
}

const easService = {
  generateAttestation,
  getActivedSubscriptors,
  getMyNewslettersSubscription,
};

export default easService;
