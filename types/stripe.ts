/**
 * Error message codes for Stripe account issues
 */
export enum ErrorMessageCode {
  UserNotFound = "err_user_not_found",
  StripeAccountNotConnected = "err_stripe_account_not_connected",
  StripeProductIdCreationFailed = "err_stripe_product_id_creation_failed",
  StripeChargeNotEnabled = "err_stripe_charge_enabled_false",
  StripePayoutNotEnabled = "err_stripe_payout_enabled_false",
  StripeAccountInfoFetchError = "err_stripe_account_info_fetch_fail",
  StripeAccountDisabled = "err_stripe_account_disabled"
}

/**
 * Result type for Stripe account health checks
 */
export interface HealthCheckResult {
  canSell: boolean;
  messageCodes: ErrorMessageCode[];
  disabledReasons?: string[];
}

/**
 * Mapping of error codes to human-readable messages
 */
export const errorMessageMapping: Record<ErrorMessageCode, string> = {
  [ErrorMessageCode.UserNotFound]: "User not found.",
  [ErrorMessageCode.StripeAccountNotConnected]: "You need to connect your Stripe account.",
  [ErrorMessageCode.StripeProductIdCreationFailed]: "Error creating stripe product id.",
  [ErrorMessageCode.StripeChargeNotEnabled]:
    "Stripe account cannot currently charge customers. Check your Stripe dashboard for more details.",
  [ErrorMessageCode.StripePayoutNotEnabled]:
    "Stripe account cannot currently perform payouts. Check your Stripe dashboard for more details.",
  [ErrorMessageCode.StripeAccountInfoFetchError]: "Error fetching stripe account info.",
  [ErrorMessageCode.StripeAccountDisabled]: "Your Stripe account is disabled."
};

export type StripeCard = {
  brand: string;
  last4: string;
};
