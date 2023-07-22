import React, { Fragment, useState, useRef } from "react";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import {
  SafeOnRampKit,
  SafeOnRampProviderType,
  SafeOnRampEvent,
} from "@safe-global/onramp-kit";

export interface WalletFundProps {
  owner: string;
  subscriber: string;
  newsletterNonce: number;
}

function WalletFund({ owner, subscriber, newsletterNonce }: WalletFundProps) {
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);

  const handlePaymentSuccessful = async (eventData: SafeOnRampEvent) => {
    await axios.post("http://localhost:3001/api/v1/newsletter/subscription", {
      newsletterOwner: owner,
      newsletterNonce: newsletterNonce,
      recipient: subscriber,
    });
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
      walletAddress: owner,
      networks: ["ethereum"],
      element: "#stripe-root",
      events: {
        onLoaded: () => console.log("On loaded"),
        onPaymentSuccessful: handlePaymentSuccessful,
        onPaymentError: () => console.log("Payment failed"),
        onPaymentProcessing: () => console.log("Payment processing"),
      },
    });
  };

  return (
    <>
      <button
        className="px-2 py-2 bg-main rounded-full ml-10 max-h-[60px] text-sm"
        onClick={fundWallet}
      >
        Subscribe with Fiat
      </button>

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
