"use client";

import useCurrentSession from "@/app/hooks/use-current-session";
import { MarketingButton } from "@/components/home/button";
import FeatureCard from "@/components/home/feature-card";
import Link from "@/components/home/link";
import Logo from "@/components/home/logo";
import type { Color } from "@/lib/home/colors";
import { colors } from "@/lib/home/colors";
import { blogURL, discordURL, loginURL } from "@/lib/home/social-urls";
import clsx from "clsx";
import {
  BookOpen,
  ChevronDown,
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

// ========================================
// CONSTANTS
// ========================================

const URLS = {
  blog: blogURL,
  github: "https://github.com/market-dot-dev/store",
  docs: "https://deepwiki.com/market-dot-dev/store",
  discord: discordURL,
  login: loginURL
} as const;

// ========================================
// TYPES & INTERFACES
// ========================================

interface AnimatedHamburgerButtonProps {
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

interface HeaderProps {
  className?: string;
}

// ========================================
// COMPONENTS
// ========================================

const AnimatedHamburgerButton = ({
  isOpen,
  toggleMenu,
  className
}: AnimatedHamburgerButtonProps) => (
  <MarketingButton
    variant="ghost"
    onClick={toggleMenu}
    className={clsx(
      "-m-1.5 flex items-center justify-center !p-1.5 text-marketing-primary",
      className
    )}
    aria-label={isOpen ? "Close menu" : "Open menu"}
  >
    <span className="flex items-center justify-center">
      {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
    </span>
  </MarketingButton>
);

// ========================================
// MAIN COMPONENT
// ========================================

export default function Header({ className }: HeaderProps) {
  const router = useRouter();
  const { isSignedIn } = useCurrentSession();
  const { status } = useSession();

  // ========================================
  // CONSTANTS
  // ========================================

  const signedIn = isSignedIn();
  const isLoading = status === "loading";
  const dashboardURL =
    process.env.NODE_ENV === "production" ? "https://app.market.dev" : "http://app.market.local";

  const dropdownOffsets: DropdownOffsets = {
    vertical: 14,
    horizontal: 0
  };

  // ========================================
  // STATE
  // ========================================

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isSupportDropdownOpen, setIsSupportDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [productDropdownPosition, setProductDropdownPosition] = useState<DropdownPosition>({
    top: 60,
    left: 16
  });

  const [supportDropdownPosition, setSupportDropdownPosition] = useState<DropdownPosition>({
    top: 60,
    left: 16
  });

  // ========================================
  // REFS
  // ========================================

  const productMenuRef = useRef<HTMLDivElement>(null);
  const supportMenuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // ========================================
  // HANDLERS
  // ========================================

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

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

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

  // ========================================
  // DROPDOWN POSITION HANDLERS
  // ========================================

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

  // ========================================
  // EFFECTS
  // ========================================

  // Handle scroll detection
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

  // Handle mobile menu overflow
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

  // Handle header height CSS variable
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

  // Handle click outside dropdowns
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

  // Handle product dropdown position updates
  useEffect(() => {
    if (isProductDropdownOpen) {
      updateProductDropdownPosition();
      window.addEventListener("resize", updateProductDropdownPosition);

      return () => {
        window.removeEventListener("resize", updateProductDropdownPosition);
      };
    }
  }, [isProductDropdownOpen, updateProductDropdownPosition]);

  // Handle support dropdown position updates
  useEffect(() => {
    if (isSupportDropdownOpen) {
      updateSupportDropdownPosition();
      window.addEventListener("resize", updateSupportDropdownPosition);

      return () => {
        window.removeEventListener("resize", updateSupportDropdownPosition);
      };
    }
  }, [isSupportDropdownOpen, updateSupportDropdownPosition]);

  // ========================================
  // RENDER
  // ========================================

  return (
    <>
      {/* Header */}
      <header
        ref={headerRef}
        className={clsx(
          "fixed inset-x-0 top-0 z-50 mx-auto flex w-full flex-col bg-marketing-background text-marketing-sm tracking-tight transition-all ease-in-out md:text-marketing-base",
          isMobileMenuOpen && "duration-150",
          className
        )}
      >
        {/* Announcement Bar */}
        <Link
          href={URLS.blog}
          className="group flex h-10 items-center justify-center gap-0.5 bg-black px-4 text-sm font-medium tracking-normal !text-white"
        >
          <BookOpen className="mr-2 size-4 opacity-60 transition-opacity group-hover:opacity-100" />
          <span className="sm:hidden">We&apos;re now open source! Learn more</span>
          <span className="hidden sm:inline">
            We&apos;re now open source! Read the blog post to learn more
          </span>
          <ChevronRight className="mt-px size-4 transition-transform group-hover:translate-x-px" />
        </Link>

        {/* Main Navigation */}
        <div className="mx-auto w-full px-4 lg:max-w-[var(--marketing-max-width)] xl:px-16">
          <div
            className={clsx(
              "relative z-[100] flex h-12 w-full items-center justify-between text-[19px] transition-shadow duration-500 ease-in-out",
              isScrolled && "shadow-border-b"
            )}
          >
            {/* Logo */}
            <Link href="/" className="flex">
              <Logo className={clsx("h-[26px] w-auto self-center justify-self-start")} />
            </Link>

            {/* Center Navigation Links - Hidden on xs screens */}
            <div className="absolute left-1/2 top-1/2 hidden max-w-0 -translate-x-1/2 -translate-y-1/2 justify-center gap-7 md:flex">
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
                  className="inline-flex items-center gap-1 whitespace-nowrap transition-colors hover:!text-marketing-primary"
                >
                  Product
                  <ChevronDown
                    className="-mr-1 size-3.5 shrink-0 translate-y-px opacity-70"
                    strokeWidth={3.5}
                  />
                </Link>
              </div>
              <Link href="https://data.market.dev" className="whitespace-nowrap">
                Data Products
              </Link>

              <Link href="/#pricing" className="whitespace-nowrap">
                Pricing
              </Link>
              <Link href={URLS.blog} target="_blank" className="whitespace-nowrap">
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
                <Link href="/" className="inline-flex items-center gap-1 whitespace-nowrap">
                  Support
                  <ChevronDown
                    className="-mr-1 size-3.5 shrink-0 translate-y-px opacity-70"
                    strokeWidth={3.5}
                  />
                </Link>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex w-fit items-center gap-6">
              {/* Login/Dashboard Button */}
              {isLoading || !signedIn ? (
                <Link href={URLS.login} variant="primary" className="hidden sm:block">
                  Log in
                </Link>
              ) : (
                <MarketingButton
                  onClick={() => {
                    router.push(dashboardURL);
                  }}
                  variant="ghost"
                  className="inline-flex size-9 items-center justify-center gap-2 rounded-full bg-marketing-accent px-0 font-bold tracking-tight text-black transition-colors hover:bg-marketing-accent-active focus:bg-marketing-accent-active xs:w-auto xs:px-3"
                >
                  <Store className="!size-5" strokeWidth={2.25} />
                  <span className="hidden text-marketing-sm xs:block">Dashboard</span>
                </MarketingButton>
              )}

              {/* Mobile Menu Button */}
              <div className="flex items-center justify-center md:hidden">
                <AnimatedHamburgerButton
                  isOpen={isMobileMenuOpen}
                  toggleMenu={toggleMobileMenu}
                  className=""
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Dropdown Menus */}
      <AnimatePresence>
        {/* Product Dropdown Menu */}
        {isProductDropdownOpen && (
          <motion.div
            id="product-dropdown"
            key="product-dropdown"
            className="fixed z-[60] hidden overflow-y-auto rounded-[17px] bg-white shadow-border-lg lg:block"
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
            <div className="flex max-w-[550px] flex-row gap-3 p-3">
              {products.map((product) => (
                <div key={product.title}>
                  <FeatureCard
                    icon={product.icon}
                    color={product.color}
                    title={product.title}
                    description={product.description}
                    link={product.link}
                    borderRadius="rounded-lg"
                    className="!leading-tighter h-full text-marketing-xs"
                    size="small"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Support Dropdown Menu */}
        {isSupportDropdownOpen && (
          <motion.div
            id="support-dropdown"
            key="support-dropdown"
            className="fixed z-[60] hidden overflow-y-auto rounded-[17px] bg-white shadow-border-lg lg:block"
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
            <div className="flex min-w-[175px] flex-col py-2 text-marketing-sm">
              <Link
                href={URLS.discord}
                variant="primary"
                className="flex w-full items-center px-5 py-1.5 transition-colors hover:text-marketing-secondary"
              >
                Discord
              </Link>
              <Link
                href={URLS.github}
                target="_blank"
                variant="primary"
                className="flex w-full items-center px-5 py-1.5 transition-colors hover:text-marketing-secondary"
              >
                Github
              </Link>
              <Link
                href={URLS.docs}
                target="_blank"
                variant="primary"
                className="flex w-full items-center px-5 py-1.5 transition-colors hover:text-marketing-secondary"
              >
                Docs
              </Link>
            </div>
          </motion.div>
        )}

        {/* Mobile Full-Screen Menu */}
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            className="shadow-t fixed inset-x-0 bottom-0 z-40 overflow-y-auto bg-marketing-background text-left text-marketing-md lg:hidden"
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
              {/* Product Feature Cards */}
              <div className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
                  {products.map((product) => (
                    <div key={product.title} className="flex-1">
                      <FeatureCard
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

              {/* Navigation Links */}
              <div className="flex grow flex-col p-6 pt-2">
                {/* Main Navigation Links */}
                <Link
                  href="/#pricing"
                  variant="primary"
                  className="flex h-[60px] w-full items-center bg-marketing-background leading-5"
                >
                  Pricing
                </Link>
                <hr className="border-black/15" />
                <Link
                  href={URLS.blog}
                  target="_blank"
                  variant="primary"
                  className="flex h-[60px] w-full items-center bg-marketing-background leading-5"
                >
                  Blog
                </Link>
                <hr className="border-black/15" />

                {/* Support Section */}
                <div className="pb-2 pt-8">
                  <h3 className="text-marketing-sm uppercase tracking-wide text-marketing-secondary">
                    Get Support
                  </h3>
                </div>
                <hr className="border-black/15" />
                <Link
                  href={URLS.discord}
                  variant="primary"
                  className="flex h-[60px] w-full items-center bg-marketing-background leading-5"
                >
                  Discord
                </Link>
                <hr className="border-black/15" />
                <Link
                  href={URLS.github}
                  target="_blank"
                  variant="primary"
                  className="flex h-[60px] w-full items-center bg-marketing-background leading-5"
                >
                  Github
                </Link>
                <hr className="border-black/15" />
                <Link
                  href={URLS.docs}
                  target="_blank"
                  variant="primary"
                  className="flex h-[60px] w-full items-center bg-marketing-background leading-5"
                >
                  Docs
                </Link>
                {isLoading ||
                  (!signedIn && (
                    <>
                      <hr className="border-black/15" />
                      <Link href={URLS.login} variant="primary" className="hidden px-2 sm:block">
                        Log in
                      </Link>
                    </>
                  ))}
              </div>

              {/* Bottom Action Button */}
              <div className="sticky inset-x-0 bottom-0 border-t border-black/15 bg-marketing-background p-6">
                {isLoading || !signedIn ? (
                  <MarketingButton className="w-full">
                    <Image
                      src="/github.svg"
                      alt="github logo"
                      height={24}
                      width={24}
                      className="col-span-2 col-start-1 h-[22px] w-auto xs:h-4.5 md:h-6"
                    />
                    Sign up with Github
                  </MarketingButton>
                ) : (
                  <MarketingButton
                    onClick={() => {
                      router.push(dashboardURL);
                    }}
                    className="w-full text-marketing-sm font-bold tracking-tightish"
                  >
                    <Store className="!size-5" strokeWidth={2.25} />
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
