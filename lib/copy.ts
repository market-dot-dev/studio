type DomainCopy = "root" | "app";

export function domainCopy(type: DomainCopy) {
  if (type === "app") {
    return `${process.env.NEXT_PUBLIC_APP_DOMAIN_COPY}`;
  }

  return `${process.env.NEXT_PUBLIC_ROOT_DOMAIN_COPY}`;
}
