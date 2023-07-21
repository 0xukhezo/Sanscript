import axios, { AxiosInstance } from 'axios'
import dotenv from 'dotenv'

type stripeSuccessType = Promise<{
  clientSecret: string
}>

type stripeErrorType = any

dotenv.config()

const { STRIPE_SERVER_SECRET_KEY } = process.env

const STRIPE_BASE_URL = 'https://api.stripe.com'
const GET_STRIPE_CLIENT_SECRET_PATH = 'v1/crypto/onramp_sessions'

const axiosStripeAPI: AxiosInstance = axios.create({
  baseURL: STRIPE_BASE_URL,
  headers: {
    Authorization: `Bearer ${STRIPE_SERVER_SECRET_KEY}`,
    'content-type': 'application/x-www-form-urlencoded'
  }
})

const axiosSafeStripeAPI: AxiosInstance = axios.create({
  baseURL: "https://aa-stripe.safe.global"
})

async function getStripeClientSecret(
  walletAddress: string
): Promise<stripeSuccessType | stripeErrorType> {

  const { data } = await axiosSafeStripeAPI.post<stripeSuccessType>('api/v1/onramp/stripe/session', {
    "transaction_details": {
      "destination_currency": "usdc",
      "destination_exchange_amount": "5",
      "destination_network": "ethereum",
      "supported_destination_currencies": [
        "usdc"
      ],
      "supported_destination_networks": [
        "ethereum",
      ],
      "wallet_address": walletAddress,
    }
  })

  return data
}

async function getStripeSession(sessionId: string) {
  const { data } = await axiosStripeAPI.get<stripeSuccessType>(
    `${GET_STRIPE_CLIENT_SECRET_PATH}/${sessionId}`
  )

  return data
}

const stripeService = {
  getStripeClientSecret,
  getStripeSession
}

export default stripeService