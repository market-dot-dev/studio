"use client";

import useCurrentSession from "@/app/hooks/use-current-session";
import { MarketingButton } from "@/components/home/button";
import FeatureCard from "@/components/home/feature-card";
import Link from "@/components/home/link";
import Logo from "@/components/home/logo";
import type { Color } from "@/lib/home/colors";
import { colors } from "@/lib/home/colors";
import { discordURL, loginURL } from "@/lib/home/social-urls";
import clsx from "clsx";
import {
  BookOpenCheck,
  ChevronRight,
  ListCheck,
  Menu,
  Package,
  Speech,
  Store,
  X
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ReactElement } from "react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { FeatureCardLinkProps } from "./feature-card";

interface AnimatedHambugerButtonProps {
  isOpen: boolean;
  toggleMenu: () => void;
  className?: string;
}

interface DropdownPosition {
  top: number;
  left: number;
}

interface DropdownOffsets {
  vertical: number;
  horizontal: number;
}

interface Product {
  icon: ReactElement<any>;
  color: Color;
  title: string;
  description: string;
  link: FeatureCardLinkProps;
}

const AnimatedHambugerButton = ({ isOpen, toggleMenu, className }: AnimatedHambugerButtonProps) => (
  <MarketingButton
    variant="ghost"
    onClick={toggleMenu}
    className={clsx(
      "text-marketing-primary -m-1.5 flex items-center justify-center !p-1.5",
      className
    )}
    aria-label={isOpen ? "Close menu" : "Open menu"}
  >
    <span className="flex items-center justify-center">
      {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
    </span>
  </MarketingButton>
);

export default function Header({ className }: { className?: string }) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isSupportDropdownOpen, setIsSupportDropdownOpen] = useState(false);
  const productMenuRef = useRef<HTMLDivElement>(null);
  const supportMenuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isSignedIn } = useCurrentSession();
  const { status } = useSession();
  const signedIn = isSignedIn();
  const isLoading = status === "loading";
  const dashboardURL =
    process.env.NODE_ENV === "production" ? "https://app.market.dev" : "http://app.market.local";

  const [productDropdownPosition, setProductDropdownPosition] = useState<DropdownPosition>({
    top: 60,
    left: 16
  });

  const [supportDropdownPosition, setSupportDropdownPosition] = useState<DropdownPosition>({
    top: 60,
    left: 16
  });

  const dropdownOffsets: DropdownOffsets = {
    vertical: 14,
    horizontal: 0
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty("--header-height", `${headerHeight}px`);
      }
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isProductDropdownOpen &&
        productMenuRef.current &&
        !productMenuRef.current.contains(event.target as Node)
      ) {
        const dropdown = document.getElementById("product-dropdown");
        if (dropdown && !dropdown.contains(event.target as Node)) {
          setIsProductDropdownOpen(false);
        }
      }

      if (
        isSupportDropdownOpen &&
        supportMenuRef.current &&
        !supportMenuRef.current.contains(event.target as Node)
      ) {
        const dropdown = document.getElementById("support-dropdown");
        if (dropdown && !dropdown.contains(event.target as Node)) {
          setIsSupportDropdownOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProductDropdownOpen, isSupportDropdownOpen]);

  const updateProductDropdownPosition = useCallback(() => {
    if (productMenuRef.current) {
      const rect = productMenuRef.current.getBoundingClientRect();
      setProductDropdownPosition({
        top: rect.bottom + dropdownOffsets.vertical,
        left: rect.left + rect.width / 2 - 275 + dropdownOffsets.horizontal // Center the dropdown (275 is ~half width of product dropdown)
      });
    }
  }, [dropdownOffsets.vertical, dropdownOffsets.horizontal]);

  const updateSupportDropdownPosition = useCallback(() => {
    if (supportMenuRef.current) {
      const rect = supportMenuRef.current.getBoundingClientRect();
      setSupportDropdownPosition({
        top: rect.bottom + dropdownOffsets.vertical,
        left: rect.left + rect.width / 2 - 87.5 + dropdownOffsets.horizontal // Center the dropdown (87.5 is ~half width of support dropdown)
      });
    }
  }, [dropdownOffsets.vertical, dropdownOffsets.horizontal]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLinkClick: React.MouseEventHandler<HTMLElement> = (event) => {
    event.preventDefault();

    const href = (event.currentTarget as HTMLAnchorElement).getAttribute("href");
    if (!href) return;

    setIsMobileMenuOpen(false);
    setIsProductDropdownOpen(false);
    setIsSupportDropdownOpen(false);
    setTimeout(() => {
      router.push(href);
    }, 150);
  };

  const products: Product[] = [
    {
      icon: <Package />,
      color: colors["green"],
      title: "Sell",
      description: "Create product & service packages that sell.",
      link: {
        text: "Learn more",
        href: "/#sell",
        asCard: true,
        onClick: handleLinkClick
      }
    },
    {
      icon: <Speech />,
      color: colors["purple"],
      title: "Promote",
      description: "Promote your work with customizable marketing tools.",
      link: {
        text: "Learn more",
        href: "/#promote",
        asCard: true,
        onClick: handleLinkClick
      }
    },
    {
      icon: <ListCheck />,
      color: colors["orange"],
      title: "Manage",
      description: "Run your business with powerful tools & insights.",
      link: {
        text: "Learn more",
        href: "/#manage",
        asCard: true,
        onClick: handleLinkClick
      }
    }
  ];

  useEffect(() => {
    if (isProductDropdownOpen) {
      updateProductDropdownPosition();
      window.addEventListener("resize", updateProductDropdownPosition);

      return () => {
        window.removeEventListener("resize", updateProductDropdownPosition);
      };
    }
  }, [isProductDropdownOpen, updateProductDropdownPosition]);

  useEffect(() => {
    if (isSupportDropdownOpen) {
      updateSupportDropdownPosition();
      window.addEventListener("resize", updateSupportDropdownPosition);

      return () => {
        window.removeEventListener("resize", updateSupportDropdownPosition);
      };
    }
  }, [isSupportDropdownOpen, updateSupportDropdownPosition]);

  return (
    <>
      <header
        ref={headerRef}
        className={clsx(
          "bg-marketing-background text-marketing-sm md:text-marketing-base fixed inset-x-0 top-0 z-50 mx-auto flex w-full flex-col tracking-tight transition-all ease-in-out",
          isMobileMenuOpen && "duration-150",
          className
        )}
      >
        <Link
          href="https://blog.market.dev/"
          className="group flex h-10 items-center justify-center gap-0.5 bg-black px-4 text-sm font-medium tracking-normal !text-white"
        >
          <BookOpenCheck className="mr-2 size-4 opacity-60 transition-opacity group-hover:opacity-100" />
          <span className="sm:hidden">We&apos;re now open source!</span>
          <span className="hidden sm:inline">
            We&apos;re now open source! Check out the blog post for more details.
          </span>
          <ChevronRight className="mt-px size-4 transition-transform group-hover:translate-x-px" />
        </Link>

        <div className="mx-auto w-full px-4 lg:max-w-[var(--marketing-max-width)] xl:px-16">
          <div
            className={clsx(
              "relative z-[100] flex h-12 w-full items-center justify-between text-[19px] transition-shadow duration-500 ease-in-out",
              isScrolled && "shadow-border-b"
            )}
          >
            <Link href="/" className="flex">
              <Logo
                className={clsx("hidden h-[26px] w-auto self-center justify-self-start md:block")}
              />
              <Image
                src="/logo.svg"
                alt="market.dev logo"
                width={22}
                height={22}
                className="self-center justify-self-start md:hidden"
                priority
              />
            </Link>
            <div className="absolute left-1/2 top-1/2 flex max-w-0 -translate-x-1/2 -translate-y-1/2 justify-center gap-7">
              {/* Product Link with Hover Dropdown */}
              <div
                className="relative"
                ref={productMenuRef}
                onMouseEnter={() => {
                  setIsProductDropdownOpen(true);
                  setTimeout(updateProductDropdownPosition, 0);
                }}
                onMouseLeave={() => setIsProductDropdownOpen(false)}
              >
                <Link
                  href="/#sell"
                  className="hover:!text-marketing-primary whitespace-nowrap transition-colors"
                >
                  Product
                </Link>
              </div>

              <Link href="/#pricing" className="whitespace-nowrap">
                Pricing
              </Link>
              <Link href="https://blog.market.dev" target="_blank" className="whitespace-nowrap">
                Blog
              </Link>

              {/* Support Link with Hover Dropdown */}
              <div
                className="relative"
                ref={supportMenuRef}
                onMouseEnter={() => {
                  setIsSupportDropdownOpen(true);
                  setTimeout(updateSupportDropdownPosition, 0);
                }}
                onMouseLeave={() => setIsSupportDropdownOpen(false)}
              >
                <Link
                  href="https://deepwiki.com/market-dot-dev/store"
                  target="_blank"
                  className="whitespace-nowrap"
                >
                  Support
                </Link>
              </div>
            </div>
            <div className="flex w-fit items-center gap-4">
              {isLoading || !signedIn ? (
                <Link href={loginURL} variant="primary" className="hidden px-2 sm:block">
                  Log in
                </Link>
              ) : (
                <MarketingButton
                  onClick={() => {
                    router.push(dashboardURL);
                  }}
                  variant="ghost"
                  className="bg-marketing-accent hover:bg-marketing-accent-active focus:bg-marketing-accent-active size-9 rounded-full !text-sm font-bold tracking-tight text-black transition-colors sm:px-3 md:w-auto"
                >
                  <Store className="!size-5" />
                  <span className="hidden md:inline">Dashboard</span>
                </MarketingButton>
              )}
              {/* Mobile menu button */}
              <div className="flex items-center justify-center lg:hidden">
                <AnimatedHambugerButton
                  isOpen={isMobileMenuOpen}
                  toggleMenu={toggleMobileMenu}
                  className=""
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {/* Product dropdown menu */}
        {isProductDropdownOpen && (
          <motion.div
            id="product-dropdown"
            key="product-dropdown"
            className="shadow-border-lg fixed z-[60] hidden overflow-y-auto rounded-[17px] bg-white lg:block"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{
              type: "tween",
              duration: 0.2,
              ease: "easeOut"
            }}
            style={{
              top: productDropdownPosition.top,
              left: productDropdownPosition.left
            }}
            onMouseEnter={() => setIsProductDropdownOpen(true)}
            onMouseLeave={() => setIsProductDropdownOpen(false)}
          >
            {/* Product feature cards */}
            <div className="flex max-w-[550px] flex-row gap-3 p-3">
              {products.map((product, index) => (
                <div key={product.title}>
                  <FeatureCard
                    key={product.title}
                    icon={product.icon}
                    color={product.color}
                    title={product.title}
                    description={product.description}
                    link={product.link}
                    borderRadius="rounded-lg"
                    className="!leading-tighter text-marketing-xs h-full"
                    size="small"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Support dropdown menu */}
        {isSupportDropdownOpen && (
          <motion.div
            id="support-dropdown"
            key="support-dropdown"
            className="shadow-border-lg fixed z-[60] hidden overflow-y-auto rounded-[17px] bg-white lg:block"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{
              type: "tween",
              duration: 0.2,
              ease: "easeOut"
            }}
            style={{
              top: supportDropdownPosition.top,
              left: supportDropdownPosition.left
            }}
            onMouseEnter={() => setIsSupportDropdownOpen(true)}
            onMouseLeave={() => setIsSupportDropdownOpen(false)}
          >
            <div className="text-marketing-sm flex min-w-[175px] flex-col py-2">
              <Link
                href={discordURL}
                variant="primary"
                className="hover:text-marketing-secondary flex w-full items-center px-5 py-1.5 transition-colors"
              >
                Discord
              </Link>
              <Link
                href="https://github.com/market-dot-dev/store"
                target="_blank"
                variant="primary"
                className="hover:text-marketing-secondary flex w-full items-center px-5 py-1.5 transition-colors"
              >
                Github
              </Link>
              <Link
                href="https://deepwiki.com/market-dot-dev/store"
                target="_blank"
                variant="primary"
                className="hover:text-marketing-secondary flex w-full items-center px-5 py-1.5 transition-colors"
              >
                Docs
              </Link>
            </div>
          </motion.div>
        )}

        {/* Mobile full-screen menu */}
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            className="shadow-t bg-marketing-background text-marketing-md fixed inset-x-0 bottom-0 z-40 overflow-y-auto text-left lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              top: "calc(var(--header-height, 84px))",
              height: "calc(100vh - var(--header-height, 84px))"
            }}
          >
            <div className="relative flex h-full flex-col">
              {/* Product feature cards */}
              <div className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
                  {products.map((product) => (
                    <div key={product.title} className="flex-1">
                      <FeatureCard
                        key={product.title}
                        icon={product.icon}
                        color={product.color}
                        title={product.title}
                        description={product.description}
                        link={product.link}
                        borderRadius="rounded-lg"
                        className="h-full"
                        size="small"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-2 border-t border-black/10"></div>

              <div className="flex grow flex-col p-6 pt-2">
                <Link
                  href="/#pricing"
                  variant="primary"
                  className="bg-marketing-background flex h-[60px] w-full items-center leading-5"
                >
                  Pricing
                </Link>
                <hr className="border-black/15" />
                <Link
                  href="https://blog.market.dev"
                  target="_blank"
                  variant="primary"
                  className="bg-marketing-background flex h-[60px] w-full items-center leading-5"
                >
                  Blog
                </Link>
                <hr className="border-black/15" />
                <Link
                  href={discordURL}
                  variant="primary"
                  className="bg-marketing-background flex h-[60px] w-full items-center leading-5"
                >
                  Discord
                </Link>
                <hr className="border-black/15" />
                <Link
                  href="https://github.com/market-dot-dev/store"
                  target="_blank"
                  variant="primary"
                  className="bg-marketing-background flex h-[60px] w-full items-center leading-5"
                >
                  Github
                </Link>
                <hr className="border-black/15" />
                <Link
                  href="https://deepwiki.com/market-dot-dev/store"
                  target="_blank"
                  variant="primary"
                  className="bg-marketing-background flex h-[60px] w-full items-center leading-5"
                >
                  Docs
                </Link>
                <hr className="border-black/15 sm:hidden" />
                {isLoading ||
                  (!signedIn && (
                    <Link href={loginURL} variant="primary" className="hidden px-2 sm:block">
                      Log in
                    </Link>
                  ))}
              </div>
              <div className="bg-marketing-background sticky inset-x-0 bottom-0 border-t border-black/10 p-6">
                {isLoading || !signedIn ? (
                  <MarketingButton className="w-full">
                    <Image
                      src="/github.svg"
                      alt="github logo"
                      height={24}
                      width={24}
                      className="xs:h-4.5 col-span-2 col-start-1 h-[22px] w-auto md:h-6"
                    />
                    Sign up with Github
                  </MarketingButton>
                ) : (
                  <MarketingButton
                    onClick={() => {
                      router.push(dashboardURL);
                    }}
                    className="tracking-tightish w-full text-sm font-bold"
                  >
                    <Store className="!size-5" />
                    Go to Dashboard
                  </MarketingButton>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
