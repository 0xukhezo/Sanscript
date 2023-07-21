import React, { Fragment, useState, useRef } from "react";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import {
  SafeOnRampKit,
  SafeOnRampProviderType,
  SafeOnRampEvent,
} from "@safe-global/onramp-kit";

export interface WalletFundProps {
  address: string;
}

function WalletFund() {
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const [address, setAddress] = useState<string>(
    "0x28962eEdacA9D89b41fcE2D3A2e89A28469e1ecf"
  );

  function handleAddressChange(event: React.ChangeEvent<HTMLInputElement>) {
    setAddress(event.target.value);
  }

  const handlePaymentSuccessful = async (eventData: SafeOnRampEvent) => {
    const response = await axios.post(
      "http://localhost:3001/api/v1/subscription",
      {
        newsletterOwner: address,
        newsletterNonce: 0, //TODO
        recipient: "0xA4a3aC7cBA6B584c674737e7a04d760433147287", //TODO
      }
    );

    console.log(eventData);
  };

  const fundWallet = async () => {
    const safeOnRamp = await SafeOnRampKit.init(SafeOnRampProviderType.Stripe, {
      onRampProviderConfig: {
        stripePublicKey:
          "pk_test_51MZbmZKSn9ArdBimSyl5i8DqfcnlhyhJHD8bF2wKrGkpvNWyPvBAYtE211oHda0X3Ea1n4e9J9nh2JkpC7Sxm5a200Ug9ijfoO",
        onRampBackendUrl: "http://localhost:3001",
      },
    });

    setOpen(true);

    const sessionData = await safeOnRamp.open({
      walletAddress: address,
      networks: ["ethereum"],
      element: "#stripe-root",
      events: {
        onLoaded: () => console.log("On loaded"),
        onPaymentSuccessful: handlePaymentSuccessful,
        onPaymentError: () => console.log("Payment failed"),
        onPaymentProcessing: () => console.log("Payment processing"),
      },
    });

    console.log({ sessionData });
  };

  return (
    <>
      <div>
        <button
          className="px-2 py-2 bg-main rounded-lg ml-20"
          onClick={fundWallet}
        >
          Pay with Fiat
        </button>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          onClose={() => setOpen(false)}
        >
          <div className="flex items-center justify-center min-h-screen">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="relative bg-white p-4 rounded-lg w-96">
                <div className="flex justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Pay with Fiat
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="mt-4">
                  <div id="stripe-root"></div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

export default WalletFund;
