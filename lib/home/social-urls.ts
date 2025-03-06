const loginURL =
  process.env.NODE_ENV === "development"
    ? "http://app.market.local:3000/login"
    : "https://app.market.dev/login";

const discordURL = "https://discord.gg/ZdSpS4BuGd";
const blogURL = "https://blog.market.dev";
const twitterUrl = "https://x.com/marketdotdev";

export { loginURL, discordURL, blogURL, twitterUrl };
