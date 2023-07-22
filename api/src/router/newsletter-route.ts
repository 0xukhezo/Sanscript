import express from "express";

import newsletterController from "../controllers/newsletter-controller";

const SUBSCRIPTION_NEWSLETTER = "/api/v1/newsletter/subscription";
const SEND_NOTIFICATIONS_NEWSLETTER = "/api/v1/newsletter/push";
const GET_ACTIVED_SUBSCRIPTORS = "/api/v1/newsletter/subscriptors";
const GET_MY_NEWSLETTERS_SUBSCRIPTION = "/api/v1/newsletter/:address";

const newsletterRouter = express.Router();

newsletterRouter.post(
  SUBSCRIPTION_NEWSLETTER,
  newsletterController.subscriptionNewsletter
);
newsletterRouter.post(
  SEND_NOTIFICATIONS_NEWSLETTER,
  newsletterController.newsletterPushNotification
);
newsletterRouter.get(
  GET_ACTIVED_SUBSCRIPTORS,
  newsletterController.getActivedSubscriptors
);
newsletterRouter.get(
  GET_MY_NEWSLETTERS_SUBSCRIPTION,
  newsletterController.getMyNewslettersSubscription
);

export default newsletterRouter;
