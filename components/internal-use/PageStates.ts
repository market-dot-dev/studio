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
  ServiceOfferingUnselected = "All Offerings, None Selected",
  ServiceOfferingSelected = "Service Offering Category Selected",
}