export enum CheckoutPageStates {
  Unregistered = "Logged Out",
  Login = "Login Screen",
  MagicLinkInput = "Magic Link Input",
  RegisteredLoggedIn = "Registered, Logged In",
  FirstPurchaseSuccess = "First Purchase Success",
  nthPurchaseSuccess = "nth Purchase Success",
  PaymentFailed = "Payment Failed",
}

export enum OfferingPageStates {
  SupportOptionsHidden = "Option 1: Support Options Not Shown",
  AllSupportOptionsShown = "Option 2a: Support Options Shown",
  ServiceOfferingSelected = "Option 2b: Support Details Selected",
}