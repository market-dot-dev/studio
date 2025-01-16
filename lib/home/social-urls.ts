const loginURL =
  process.env.NODE_ENV === "development"
    ? "http://app.gitwallet.local:3000/login"
    : "https://app.gitwallet.co/login";

const discordURL = "https://discord.gg/ZdSpS4BuGd";
const blogURL = "https://blog.market.dev";
const twitterUrl = "https://x.com/gitwallet";

export { loginURL, discordURL, blogURL, twitterUrl };
