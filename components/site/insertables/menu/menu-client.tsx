"use client";
import { useEffect, useState } from "react";
import Menu from "./menu";

// @TODO: Just use a server-action? See note in corresponding endpoint.

export default function MenuClient({ site, page }: { site: any; page: any }) {
  // getting the tiers by means of API routes
  const [nav, setNav] = useState([]);

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
