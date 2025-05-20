"use client";

import { useEffect, useState } from "react";
import type { InsertableComponentProps } from "..";
import Menu from "./menu";

export default function MenuClient({ site, page }: InsertableComponentProps) {
  // getting the tiers by means of API routes
  const [nav, setNav] = useState([]);

  // @TODO: Just use a server-action? See note in corresponding endpoint.
  useEffect(() => {
    const getNav = async () => {
      const response = await fetch("/api/preview/nav");
      const nav = await response.json();
      setNav(nav);
    };
    getNav();
  }, []);

  return <Menu site={site} page={page} nav={nav} />;
}
