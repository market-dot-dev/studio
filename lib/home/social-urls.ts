import { getRootUrl } from "@/app/services/domain-service";

const loginURL = `${getRootUrl("app", "/login")}`;
const discordURL = "https://discord.gg/ZdSpS4BuGd";
const blogURL = `${getRootUrl("blog", "/")}`;
const twitterUrl = "https://x.com/gitwallet";

export { loginURL, discordURL, blogURL, twitterUrl };
