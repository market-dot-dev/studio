"use client";

import useCurrentSession from "@/app/hooks/use-current-session";
import { MarketingButton } from "@/components/home/button";
import FeatureCard from "@/components/home/feature-card";
import Link from "@/components/home/link";
import Logo from "@/components/home/logo";
import { Button as UIButton } from "@/components/ui/button";
import type { Color } from "@/lib/home/colors";
import { colors } from "@/lib/home/colors";
import { blogURL, discordURL, loginURL, twitterUrl } from "@/lib/home/social-urls";
import clsx from "clsx";
import {
  BookOpenCheck,
  ChevronDown,
  ChevronRight,
  ListCheck,
  Menu,
  Package,
  Speech,
  Store,
  X,
  Github
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
  left?: number;
  right?: number;
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

interface SupportLink {
  title: string;
  href: string;
  icon: ReactElement<any>;
}

interface DropdownMenuProps {
  id: string;
  isOpen: boolean;
  position: DropdownPosition;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  className?: string;
  children: React.ReactNode;
}

interface NavItemWithDropdownProps {
  label: string;
  menuRef: React.RefObject<HTMLDivElement | null>;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const AnimatedHambugerButton = ({ isOpen, toggleMenu, className }: AnimatedHambugerButtonProps) => (
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

const DropdownMenu = ({ id, isOpen, position, onMouseEnter, onMouseLeave, className, children }: DropdownMenuProps) => (
  <motion.div
    id={id}
    key={id}
    className={clsx(
      "fixed z-[60] hidden overflow-y-auto rounded-[17px] bg-white shadow-border-lg lg:block",
      className
    )}
    initial={{ opacity: 0, scale: 0.95, y: -10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95, y: -10 }}
    transition={{
      type: "tween",
      duration: 0.2,
      ease: "easeOut"
    }}
    style={{
      top: position.top,
      left: position.left,
      right: position.right
    }}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {children}
  </motion.div>
);

const NavItemWithDropdown = ({ label, menuRef, onMouseEnter, onMouseLeave }: NavItemWithDropdownProps) => (
  <div
    className="relative"
    ref={menuRef}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <button className="flex items-center gap-1 whitespace-nowrap !text-marketing-primary hover:text-marketing-secondary transition-colors">
      {label}
      <ChevronDown className="h-4 w-4" />
    </button>
  </div>
);

export default function Header({ className }: { className?: string }) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isSupportDropdownOpen, setIsSupportDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const productMenuButtonRef = useRef<HTMLDivElement>(null);
  const supportMenuButtonRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLDivElement>(null);
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
    left: 0
  });

  const [supportDropdownPosition, setSupportDropdownPosition] = useState<DropdownPosition>({
    top: 60,
    left: 0
  });

  const [mobileDropdownPosition, setMobileDropdownPosition] = useState<DropdownPosition>({
    top: 60,
    right: 16
  });

  const dropdownOffsets: DropdownOffsets = {
    vertical: 14,
    horizontal: 0
  };

  // Generic dropdown handlers
  const createDropdownHandlers = (
    dropdownType: 'product' | 'support',
    setCurrentOpen: (open: boolean) => void,
    setOtherOpen: (open: boolean) => void,
    updatePosition: () => void
  ) => ({
    onMouseEnter: () => {
      setCurrentOpen(true);
      setOtherOpen(false);
      setTimeout(updatePosition, 0);
    },
    onMouseLeave: () => {
      setCurrentOpen(false);
    }
  });

  // Position update functions
  const createPositionUpdater = useCallback((
    buttonRef: React.RefObject<HTMLDivElement | null>,
    setPosition: (pos: DropdownPosition) => void,
    offsetLeft: number = -32
  ) => () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + dropdownOffsets.vertical,
        left: rect.left + offsetLeft
      });
    }
  }, [dropdownOffsets.vertical]);

  const updateProductDropdownPosition = createPositionUpdater(
    productMenuButtonRef,
    setProductDropdownPosition
  );

  const updateSupportDropdownPosition = createPositionUpdater(
    supportMenuButtonRef,
    setSupportDropdownPosition
  );

  const updateMobileDropdownPosition = useCallback(() => {
    if (mobileMenuButtonRef.current) {
      const rect = mobileMenuButtonRef.current.getBoundingClientRect();
      setMobileDropdownPosition({
        top: rect.bottom + dropdownOffsets.vertical,
        right: window.innerWidth - rect.right + dropdownOffsets.horizontal
      });
    }
  }, [dropdownOffsets.vertical, dropdownOffsets.horizontal]);

  // Create dropdown handlers
  const productHandlers = createDropdownHandlers(
    'product',
    setIsProductDropdownOpen,
    setIsSupportDropdownOpen,
    updateProductDropdownPosition
  );

  const supportHandlers = createDropdownHandlers(
    'support',
    setIsSupportDropdownOpen,
    setIsProductDropdownOpen,
    updateSupportDropdownPosition
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
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
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdowns = [
        { isOpen: isProductDropdownOpen, ref: productMenuButtonRef, id: "product-dropdown", setState: setIsProductDropdownOpen },
        { isOpen: isSupportDropdownOpen, ref: supportMenuButtonRef, id: "support-dropdown", setState: setIsSupportDropdownOpen },
        { isOpen: isMobileDropdownOpen, ref: mobileMenuButtonRef, id: "mobile-dropdown", setState: setIsMobileDropdownOpen }
      ];

      dropdowns.forEach(({ isOpen, ref, id, setState }) => {
        if (isOpen && ref.current && !ref.current.contains(event.target as Node)) {
          const dropdown = document.getElementById(id);
          if (dropdown && !dropdown.contains(event.target as Node)) {
            setState(false);
          }
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProductDropdownOpen, isSupportDropdownOpen, isMobileDropdownOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const toggleMobileDropdown = () => {
    const newState = !isMobileDropdownOpen;
    setIsMobileDropdownOpen(newState);
    if (newState) {
      setTimeout(updateMobileDropdownPosition, 0);
    }
  };

  const handleLinkClick: React.MouseEventHandler<HTMLElement> = (event) => {
    event.preventDefault();

    const href = (event.currentTarget as HTMLAnchorElement).getAttribute("href");
    if (!href) return;

    // Close all dropdowns
    setIsMobileMenuOpen(false);
    setIsProductDropdownOpen(false);
    setIsSupportDropdownOpen(false);
    setIsMobileDropdownOpen(false);

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

  const supportLinks: SupportLink[] = [
    {
      title: "Discord",
      href: discordURL,
      icon: <div className="flex h-5 w-5 items-center justify-center rounded bg-[#5865F2] text-white text-xs font-bold">D</div>
    },
    {
      title: "GitHub",
      href: "https://github.com/market-dot-dev/store",
      icon: <Github className="h-5 w-5" />
    }
  ];

  // Generic resize effect hook
  useEffect(() => {
    const dropdownConfigs = [
      { isOpen: isProductDropdownOpen, updatePosition: updateProductDropdownPosition },
      { isOpen: isSupportDropdownOpen, updatePosition: updateSupportDropdownPosition },
      { isOpen: isMobileDropdownOpen, updatePosition: updateMobileDropdownPosition }
    ];

    const activeDropdowns = dropdownConfigs.filter(config => config.isOpen);

    if (activeDropdowns.length > 0) {
      const handleResize = () => {
        activeDropdowns.forEach(config => config.updatePosition());
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [isProductDropdownOpen, isSupportDropdownOpen, isMobileDropdownOpen, updateProductDropdownPosition, updateSupportDropdownPosition, updateMobileDropdownPosition]);

  return (
    <>
      <header
        ref={headerRef}
        className={clsx(
          "fixed inset-x-0 top-0 z-50 mx-auto flex w-full flex-col bg-marketing-background text-marketing-sm tracking-tight transition-all ease-in-out md:text-marketing-base",
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

            {/* Desktop Navigation */}
            <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 justify-center gap-8 lg:flex">
              <NavItemWithDropdown
                label="Product"
                menuRef={productMenuButtonRef}
                onMouseEnter={productHandlers.onMouseEnter}
                onMouseLeave={productHandlers.onMouseLeave}
              />

              <Link href="#pricing" className="whitespace-nowrap !text-marketing-primary">
                Pricing
              </Link>

              <Link href={blogURL} className="whitespace-nowrap !text-marketing-primary">
                Blog
              </Link>

              <NavItemWithDropdown
                label="Support"
                menuRef={supportMenuButtonRef}
                onMouseEnter={supportHandlers.onMouseEnter}
                onMouseLeave={supportHandlers.onMouseLeave}
              />
            </div>

            {/* Mobile Navigation - simplified centered links */}
            <div className="absolute left-1/2 top-1/2 flex max-w-0 -translate-x-1/2 -translate-y-1/2 justify-center gap-6 lg:hidden">
              <Link href="#pricing" className="whitespace-nowrap !text-marketing-primary text-sm">
                Pricing
              </Link>
              <Link href={blogURL} className="whitespace-nowrap !text-marketing-primary text-sm">
                Blog
              </Link>
            </div>

            <div className="flex w-fit items-center gap-4">
              {isLoading || !signedIn ? (
                <Link href={loginURL} variant="primary" className="hidden px-2 sm:block">
                  Log in
                </Link>
              ) : (
                <UIButton
                  onClick={() => {
                    router.push(dashboardURL);
                  }}
                  variant="ghost"
                  className="size-9 rounded-full bg-marketing-accent !text-sm font-bold tracking-tight text-black transition-colors hover:bg-marketing-accent-active focus:bg-marketing-accent-active sm:px-3 md:w-auto"
                >
                  <Store className="!size-5" />
                  <span className="hidden md:inline">Dashboard</span>
                </UIButton>
              )}
              {/* Mobile menu button */}
              <div className="flex items-center justify-center lg:hidden" ref={mobileMenuButtonRef}>
                <AnimatedHambugerButton
                  isOpen={isMobileDropdownOpen}
                  toggleMenu={toggleMobileDropdown}
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
          <DropdownMenu
            id="product-dropdown"
            isOpen={isProductDropdownOpen}
            position={productDropdownPosition}
            onMouseEnter={productHandlers.onMouseEnter}
            onMouseLeave={productHandlers.onMouseLeave}
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
          </DropdownMenu>
        )}

        {/* Support dropdown menu */}
        {isSupportDropdownOpen && (
          <DropdownMenu
            id="support-dropdown"
            isOpen={isSupportDropdownOpen}
            position={supportDropdownPosition}
            onMouseEnter={supportHandlers.onMouseEnter}
            onMouseLeave={supportHandlers.onMouseLeave}
          >
            <div className="flex min-w-[150px] flex-col py-2 text-marketing-sm">
              {supportLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  variant="primary"
                  className="flex w-full items-center gap-3 px-4 py-2 transition-colors hover:text-marketing-secondary"
                >
                  {link.icon}
                  {link.title}
                </Link>
              ))}
            </div>
          </DropdownMenu>
        )}

        {/* Mobile dropdown menu */}
        {isMobileDropdownOpen && (
          <DropdownMenu
            id="mobile-dropdown"
            isOpen={isMobileDropdownOpen}
            position={mobileDropdownPosition}
            onMouseEnter={() => { }}
            onMouseLeave={() => { }}
            className="lg:hidden"
          >
            <div className="flex min-w-[175px] flex-col py-2 text-marketing-sm">
              <Link
                href="/"
                variant="primary"
                className="flex w-full items-center px-5 py-1.5 transition-colors hover:text-marketing-secondary"
                onClick={handleLinkClick}
              >
                Product
              </Link>
              <Link
                href={discordURL}
                variant="primary"
                className="flex w-full items-center px-5 py-1.5 transition-colors hover:text-marketing-secondary"
              >
                Discord
              </Link>
              <Link
                href="https://github.com/market-dot-dev/store"
                variant="primary"
                className="flex w-full items-center px-5 py-1.5 transition-colors hover:text-marketing-secondary"
              >
                GitHub
              </Link>
            </div>
          </DropdownMenu>
        )}

        {/* Mobile full-screen menu */}
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
              {/* Product feature cards */}
              <div className="p-4">
                <h3 className="mb-3 text-sm font-medium text-marketing-secondary">Product Features</h3>
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

              <div className="flex grow flex-col p-6 pt-2">
                <Link
                  href="#pricing"
                  variant="primary"
                  className="flex h-[60px] w-full items-center bg-marketing-background leading-5"
                >
                  Pricing
                </Link>
                <hr className="border-black/15" />
                <Link
                  href={blogURL}
                  variant="primary"
                  className="flex h-[60px] w-full items-center bg-marketing-background leading-5"
                >
                  Blog
                </Link>
                <hr className="border-black/15" />
                <Link
                  href={discordURL}
                  variant="primary"
                  className="flex h-[60px] w-full items-center bg-marketing-background leading-5"
                >
                  Discord
                </Link>
                <hr className="border-black/15" />
                <Link
                  href="https://github.com/market-dot-dev/store"
                  variant="primary"
                  className="flex h-[60px] w-full items-center bg-marketing-background leading-5"
                >
                  GitHub
                </Link>
                <hr className="border-black/15 sm:hidden" />
                {isLoading ||
                  (!signedIn && (
                    <Link href={loginURL} variant="primary" className="hidden px-2 sm:block">
                      Log in
                    </Link>
                  ))}
              </div>
              <div className="sticky inset-x-0 bottom-0 border-t border-black/10 bg-marketing-background p-6">
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
                    className="w-full text-sm font-bold tracking-tightish"
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
