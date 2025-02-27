"use client";

import type { Color } from '@/lib/home/colors';
import type { ReactElement } from "react";
import type { FeatureCardLinkProps } from "./feature-card";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from 'next/image';
import Link from "@/components/home/link";
import { useRouter } from 'next/navigation';
import Logo from "@/components/home/logo";
import Button from '@/components/home/button';
import clsx from "clsx";
import { Menu, X, Package, Speech, ListCheck, ChevronRight, BookOpenCheck } from "lucide-react";
import { colors } from "@/lib/home/colors";
import { loginURL, discordURL, blogURL, twitterUrl } from '@/lib/home/social-urls';
import { motion, AnimatePresence } from "framer-motion";
import FeatureCard from "@/components/home/feature-card";

interface AnimatedHambugerButtonProps {
  isOpen: boolean;
  toggleMenu: () => void;
  className?: string;
}

interface DropdownPosition {
  top: number;
  right: number;
}

interface DropdownOffsets {
  vertical: number;
  horizontal: number;
}

interface Product {
  icon: ReactElement;
  color: Color;
  title: string;
  description: string;
  link: FeatureCardLinkProps;
}

const AnimatedHambugerButton = ({
  isOpen,
  toggleMenu,
  className,
}: AnimatedHambugerButtonProps) => (
  <Button
    variant="ghost"
    onClick={toggleMenu}
    className={clsx("-m-1.5 text-marketing-primary flex items-center justify-center !p-1.5", className)}
    aria-label={isOpen ? "Close menu" : "Open menu"}
  >
    <span className="flex items-center justify-center">
      {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </span>
  </Button>
);

export default function Header({ className }: { className?: string }) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
  const desktopMenuButtonRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({ top: 60, right: 16 });
  
  const dropdownOffsets: DropdownOffsets = {
    vertical: 14,
    horizontal: 0,
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    isMobileMenuOpen 
      ? document.body.classList.add("overflow-hidden") 
      : document.body.classList.remove("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    
    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isDesktopDropdownOpen &&
        desktopMenuButtonRef.current &&
        !desktopMenuButtonRef.current.contains(event.target as Node)
      ) {
        const dropdown = document.getElementById('desktop-dropdown');
        if (dropdown && !dropdown.contains(event.target as Node)) {
          setIsDesktopDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDesktopDropdownOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleDesktopDropdown = () => {
    const newState = !isDesktopDropdownOpen;
    setIsDesktopDropdownOpen(newState);
    if (newState) {
      setTimeout(updateDropdownPosition, 0);
    }
  };

  const handleLinkClick: React.MouseEventHandler<HTMLElement> = (
    event,
  ) => {
    event.preventDefault();

    const href = (event.currentTarget as HTMLAnchorElement).getAttribute(
      "href",
    );
    if (!href) return;

    setIsMobileMenuOpen(false);
    setIsDesktopDropdownOpen(false);
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
        onClick: handleLinkClick,
      },
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
        onClick: handleLinkClick,
      },
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
        onClick: handleLinkClick,
      },
    },
  ];

  const updateDropdownPosition = useCallback(() => {
    if (desktopMenuButtonRef.current) {
      const rect = desktopMenuButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + dropdownOffsets.vertical,
        right: window.innerWidth - rect.right + dropdownOffsets.horizontal
      });
    }
  }, [dropdownOffsets.vertical, dropdownOffsets.horizontal]);

  useEffect(() => {
    if (isDesktopDropdownOpen) {
      updateDropdownPosition();
      window.addEventListener('resize', updateDropdownPosition);
      
      return () => {
        window.removeEventListener('resize', updateDropdownPosition);
      };
    }
  }, [isDesktopDropdownOpen, updateDropdownPosition]);

  return (
    <>
      <header
        ref={headerRef}
        className={clsx(
          "fixed left-0 right-0 top-0 z-50 mx-auto flex w-full flex-col bg-marketing-background text-marketing-sm tracking-tight transition-all ease-in-out md:text-marketing-base",
          isMobileMenuOpen && "duration-150",
          className,
        )}
      >
        <Link
          href="https://explore.market.dev/"
          className="group flex h-10 items-center justify-center gap-0.5 bg-black px-4 text-sm font-medium tracking-normal !text-white"
        >
          <BookOpenCheck className="mr-2 size-4 opacity-60 transition-opacity group-hover:opacity-100" />
          <span className="sm:hidden">
            Get listed on our developer marketplace
          </span>
          <span className="hidden sm:inline">
            List your products & services on our developer marketplace
          </span>
          <ChevronRight className="mt-px h-4 w-4 transition-transform group-hover:translate-x-px" />
        </Link>

        <div className="mx-auto w-full px-4 lg:max-w-[var(--marketing-max-width)] xl:px-16">
          <div
            className={clsx(
              "duration-[500ms] relative z-[100] flex h-12 w-full items-center justify-between text-[19px] transition-shadow ease-in-out",
              isScrolled && "shadow-border-b",
            )}
          >
            <Link href="/" className="flex">
              <button
                onClick={() => {
                  isMobileMenuOpen && setIsMobileMenuOpen(false);
                  isDesktopDropdownOpen && setIsDesktopDropdownOpen(false);
                }}
              >
                <Logo
                  className={clsx(
                    "hidden h-[26px] w-auto self-center justify-self-start md:block",
                  )}
                />
                <Image
                  src="/logo.svg"
                  alt="market.dev logo"
                  width={22}
                  height={22}
                  className="self-center justify-self-start md:hidden"
                />
              </button>
            </Link>
            <div className="flex justify-center absolute left-1/2 top-1/2  -translate-x-1/2 -translate-y-1/2 gap-7 max-w-0">
              <Link
                href="/"
                className="whitespace-nowrap !text-marketing-primary"
              >
                Sell
              </Link>
              <Link
                href="https://explore.market.dev"
                className="whitespace-nowrap"
              >
                Explore
              </Link>
            </div>
            <div className="flex w-fit items-center gap-4">
              <Link
                href={loginURL}
                variant="primary"
                className="hidden px-2 sm:block"
              >
                Log in
              </Link>
              {/* Desktop menu button */}
              <div
                className="relative hidden items-center justify-center lg:flex"
                ref={desktopMenuButtonRef}
              >
                <AnimatedHambugerButton
                  isOpen={isDesktopDropdownOpen}
                  toggleMenu={toggleDesktopDropdown}
                  className=""
                />
              </div>
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
        {/* Desktop dropdown menu */}
        {isDesktopDropdownOpen && (
          <motion.div
            id="desktop-dropdown"
            key="desktop-dropdown"
            className="fixed z-[60] hidden overflow-y-auto rounded-[17px] bg-white shadow-border-lg lg:block"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{
              type: "tween",
              duration: 0.2,
              ease: "easeOut",
            }}
            style={{
              top: dropdownPosition.top,
              right: dropdownPosition.right,
            }}
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
                    className="!leading-tighter h-full text-marketing-xs"
                    size="small"
                  />
                </div>
              ))}
            </div>

            <div className="border-t border-black/10"></div>

            <div className="flex min-w-[175px] flex-col py-2 text-marketing-sm">
              <Link
                href={blogURL}
                variant="primary"
                className="flex w-full items-center px-5 py-1.5 transition-colors hover:text-marketing-secondary"
              >
                Changelog
              </Link>
              <Link
                href={discordURL}
                variant="primary"
                className="flex w-full items-center px-5 py-1.5 transition-colors hover:text-marketing-secondary"
              >
                Discord
              </Link>
              <Link
                href={twitterUrl}
                variant="primary"
                className="flex w-full items-center px-5 py-1.5 transition-colors hover:text-marketing-secondary"
              >
                Twitter
              </Link>
            </div>
          </motion.div>
        )}

        {/* Mobile full-screen menu */}
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            className="shadow-t fixed inset-x-0 bottom-0 z-[40] overflow-y-auto bg-marketing-background text-left text-marketing-md lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              top: "calc(var(--header-height, 84px))",
              height: "calc(100vh - var(--header-height, 84px))",
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

              <div className="flex flex-grow flex-col p-6 pt-2">
                <Link
                  href={blogURL}
                  variant="primary"
                  className="flex h-[60px] w-full items-center bg-marketing-background leading-5"
                >
                  Changelog
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
                  href={twitterUrl}
                  variant="primary"
                  className="flex h-[60px] w-full items-center bg-marketing-background leading-5"
                >
                  Twitter
                </Link>
                <hr className="border-black/15 sm:hidden" />
                <Link
                  href={loginURL}
                  variant="primary"
                  className="flex sm:hidden h-[60px] w-full items-center bg-marketing-background leading-5"
                >
                  Log in
                </Link>
              </div>
              <div className="sticky bottom-0 left-0 right-0 border-t border-black/10 bg-marketing-background p-6">
                <Button className="w-full">
                  <Image
                    src="/github.svg"
                    alt="github logo"
                    height={24}
                    width={24}
                    className="col-span-2 col-start-1 h-[22px] w-auto xs:h-[18px] md:h-6"
                  />
                  Sign up with Github
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
