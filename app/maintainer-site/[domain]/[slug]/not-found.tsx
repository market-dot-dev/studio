import { getHomepage } from "@/app/services/site/page-service";
import { headers } from "next/headers";
import Image from "next/image";

export default async function NotFound() {
  const headersList = await headers();
  const domain = headersList
    .get("host")
    ?.replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);
  const { site } = await getHomepage(domain as string);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl">{`${site?.name + " "} ?? ""`}Site Not Found</h1>
      <p className="text-lg text-stone-500">
        {site ? site.message404 : "You've found a page that doesn't exist. Sorry!"}
      </p>
    </div>
  );
}
