"use client";

import type { Color } from '@/lib/home/colors';
import type { ReactElement } from "react";
import type { FeatureCardLinkProps } from "./feature-card";
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from "@/components/home/link";
import { useRouter } from 'next/navigation';
import Logo from "@/components/home/logo";
import Button from '@/components/home/button';
import FeatureCard from "./feature-card";
import Dropdown from '@/components/home/dropdown';
import clsx from "clsx";
import { Package, Speech, ScanSearch } from "lucide-react";
import { colors } from "@/lib/home/colors";
import { loginURL, discordURL, blogURL, twitterUrl } from '@/lib/home/social-urls';
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedHambugerButtonProps {
  isOpen: boolean;
  toggleMenu: () => void;
  className?: string;
}

interface Product {
  icon: ReactElement<any>;
  color: Color;
  title: string;
  description: string;
  link: FeatureCardLinkProps;
}

const AnimatedHambugerButton = ({
  isOpen,
  toggleMenu,
  className,
}: AnimatedHambugerButtonProps) => {
  const topBarVariants = {
    closed: { rotate: 0, y: 0, transformOrigin: "21px 50%" },
    open: { rotate: -45, y: 6, transformOrigin: "21px 50%" },
  };

  const middleBarVariants = {
    closed: { opacity: 1, x: 0 },
    open: { opacity: 0, x: 22 },
  };

  const bottomBarVariants = {
    closed: { rotate: 0, y: 0, transformOrigin: "3px 50%" },
    open: { rotate: 45, y: -6, transformOrigin: "3px 50%" },
  };

  return (
    <Button
      variant='ghost'
      onClick={toggleMenu}
      className={clsx('text-marketing-primary', className )}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <motion.svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <motion.line
          x1="3"
          x2="21"
          y1="6"
          y2="6"
          variants={topBarVariants}
          animate={isOpen ? "open" : "closed"}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        />
        <motion.line
          x1="3"
          x2="21"
          y1="12"
          y2="12"
          variants={middleBarVariants}
          animate={isOpen ? "open" : "closed"}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        />
        <motion.line
          x1="3"
          x2="21"
          y1="18"
          y2="18"
          variants={bottomBarVariants}
          animate={isOpen ? "open" : "closed"}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        />
      </motion.svg>
    </Button>
  );
};

export default function Header({ className }: { className?: string }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    isMenuOpen 
      ? document.body.classList.add("overflow-hidden") 
      : document.body.classList.remove("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Intercept product card links to close menu when clicked
  const handleLinkClick: React.MouseEventHandler<HTMLElement> = (
    event,
  ) => {
    event.preventDefault();

    const href = (event.currentTarget as HTMLAnchorElement).getAttribute(
      "href",
    );
    if (!href) return;

    setIsMenuOpen(false);
    setTimeout(() => {
      router.push(href);
    }, 150);
  };

  const menuVariants = {
    hidden: { opacity: 0, scale: 0.99 },
    visible: { opacity: 98, scale: 1 },
  };

  const products: Product[] = [
    {
      icon: <Package />,
      color: colors["green"],
      title: "Sell",
      description: "Sell products & services, find packages that work.",
      link: {
        text: "Learn more",
        href: "#sell",
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
        href: "#promote",
        asCard: true,
        onClick: handleLinkClick,
      },
    },
    {
      icon: <ScanSearch />,
      color: colors["orange"],
      title: "Research",
      description: "See who's using your stuff & find new customers.",
      link: {
        text: "Learn more",
        href: "#research",
        asCard: true,
        onClick: handleLinkClick,
      },
    },
  ];

  return (
    <>
      <header
        className={clsx(
          "fixed left-0 right-0 top-0 z-50 w-full bg-[#F5F5F4] pl-5 pr-6 pt-1.5 tracking-tight",
          className,
        )}
      >
        <div className="relative z-[100] flex items-center justify-between py-3">
          <button onClick={() => isMenuOpen && setIsMenuOpen(false)}>
            <Logo className="h-[22px] w-auto xs:h-[26px]" />
          </button>
          <div className="absolute left-1/2 top-1/2 ml-0.5 hidden -translate-x-1/2 -translate-y-1/2 gap-9 lg:flex">
            <Dropdown
              title="Product"
              orientation="horizontal"
              className="-bottom-[221px] left-1/2 grid w-[700px] -translate-x-1/2 grid-cols-3 gap-4 rounded-[24px] px-4 py-4"
            >
              {products.map((product) => (
                <Dropdown.Item key={product.title}>
                  <FeatureCard
                    key={product.title}
                    icon={product.icon}
                    color={product.color}
                    title={product.title}
                    description={product.description}
                    link={product.link}
                    borderRadius="rounded-lg"
                    className="h-full"
                  />
                </Dropdown.Item>
              ))}
            </Dropdown>
            <Link href={blogURL} target="_blank" className="whitespace-nowrap">
              Changelog
            </Link>
            <Dropdown title="Follow">
              <Dropdown.Item href={discordURL}>Discord</Dropdown.Item>
              <Dropdown.Item href={twitterUrl}>Twitter</Dropdown.Item>
            </Dropdown>
          </div>
          <div className="flex w-fit items-center gap-[22px] md:gap-6">
            <Link
              href={loginURL}
              variant="primary"
              className="-mt-0.5 text-marketing-sm xs:text-marketing-base"
            >
              Log in
            </Link>
            <AnimatedHambugerButton
              isOpen={isMenuOpen}
              toggleMenu={toggleMenu}
              className="lg:hidden"
            />
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 overflow-y-auto bg-marketing-background pb-[72px] pt-[52px] text-left text-marketing-md lg:hidden"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            transition={{ duration: 0.15 }}
          >
            <div className="relative">
              <div className="flex min-h-full flex-col p-6 pl-[22px] pt-2">
                <hr className="border-black/15" />
                <Link
                  href="#product"
                  variant="primary"
                  className="flex h-[60px] w-full items-center leading-5 sm:hidden"
                  onClick={(e) => handleLinkClick(e)}
                >
                  Product
                </Link>
                <div className="hidden w-full pb-6 sm:block">
                  <h2 className="flex h-[60px] items-center leading-5 text-marketing-primary">
                    Product
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    {products.map((product) => (
                      <FeatureCard
                        key={product.title}
                        icon={product.icon}
                        color={product.color}
                        title={product.title}
                        description={product.description}
                        link={product.link}
                        borderRadius="rounded-lg"
                      />
                    ))}
                  </div>
                </div>
                <hr className="border-black/15" />
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
                <hr className="border-black/15" />
              </div>
              <div className="fixed bottom-0 left-0 right-0 p-6">
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
