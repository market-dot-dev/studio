"use client";

import type { Color } from '@/lib/home/colors';
import type { ReactElement } from "react";
import type { FeatureCardLinkProps } from "./feature-card";
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from "@/components/home/new/link";
import { useRouter } from 'next/navigation';
import Logo from "@/components/home/new/logo";
import Button from '@/components/home/new/button';
import FeatureCard from "./feature-card";
import Dropdown from '@/components/home/new/dropdown';
import clsx from "clsx";
import { ChevronRight, Package, Speech, ScanSearch } from "lucide-react";
import { colors } from "@/lib/home/colors";
import { loginURL, discordURL, blogURL, twitterUrl } from '@/lib/home/social-urls';
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedHambugerButtonProps {
  isOpen: boolean;
  toggleMenu: () => void;
  className?: string;
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
      className={clsx('lg:hidden text-marketing-primary', className )}
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

const Accordion = ({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const childrenArray = React.Children.toArray(children);

  const DURATION = 0.2;

  const containerVariants = {
    open: { opacity: 1, height: "auto" },
    collapsed: { opacity: 0, height: 0 },
  };

  const childVariants = {
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: DURATION },
    }),
    collapsed: (i: number) => ({
      opacity: 0,
      y: -10,
      transition: {
        delay: (childrenArray.length - i - 1) * 0.1,
        duration: DURATION,
      },
    }),
  };

  return (
    <details
      className={clsx(isOpen && "pb-6", className)}
      open={isOpen}
    >
      <summary
        className={clsx(
          "hover:text-marketing-primary group flex h-[60px] cursor-pointer list-none transition-colors",
          isOpen && "text-marketing-primary",
        )}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
      >
        <div className="flex w-full items-center justify-between">
          <h2 className="text-marketing-md leading-5">{title}</h2>
          <ChevronRight
            className={clsx(
              "text-marketing-secondary/70 -mr-[3px] h-6 w-6 transition-all duration-200 group-hover:opacity-100",
              isOpen && "rotate-90",
            )}
          />
        </div>
      </summary>
      <AnimatePresence initial={false}>
        <motion.div
          key={isOpen ? "open" : "closed"}
          initial="collapsed"
          animate={isOpen ? "open" : "collapsed"}
          exit="collapsed"
          variants={containerVariants}
          transition={{
            duration: childrenArray.length * DURATION,
            ease: [0.04, 0.62, 0.23, 0.98],
          }}
        >
          <motion.div className="flex flex-col gap-4 pt-1 sm:flex-row">
            {childrenArray.map((child, index) => (
              <motion.div
                key={index}
                custom={isOpen ? index : childrenArray.length - index - 1}
                variants={childVariants}
                initial="collapsed"
                animate={isOpen ? "open" : "collapsed"}
                exit="collapsed"
              >
                {child}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </details>
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
    const handleProductCardClick: React.MouseEventHandler<HTMLElement> = (
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
        onClick: handleProductCardClick,
      },
    },
    {
      icon: <Speech />,
      color: colors["purple"],
      title: "Marketing",
      description: "Promote your work with customizable marketing tools.",
      link: {
        text: "Learn more",
        href: "#marketing",
        asCard: true,
        onClick: handleProductCardClick,
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
        onClick: handleProductCardClick,
      },
    },
  ];

  return (
    <>
      <header
        className={clsx(
          "fixed left-0 right-0 top-0 z-50 w-full bg-[#F5F5F4] pl-[18px] pr-[22px] pt-4 md:pl-[22px] md:pr-6 md:pt-[18px] tracking-tight",
          className,
        )}
      >
        <div className="relative z-[100] flex items-center justify-between pb-2.5">
          <button onClick={() => isMenuOpen && setIsMenuOpen(false)}>
            <Logo className="h-[26px] w-fit md:h-7" />
          </button>
          <div className="absolute left-1/2 top-[calc(50%-6px)] ml-0.5 hidden -translate-x-1/2 -translate-y-1/2 gap-9 lg:flex">
            <Dropdown
              title="Product"
              orientation="horizontal"
              className="grid grid-cols-3 -bottom-[220px] left-1/2 -translate-x-1/2 w-[700px] gap-4 rounded-[24px] px-4 py-4"
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
            <Link href={loginURL} variant='primary' className="-mt-[3px] sm:-mt-1">
              Log in
            </Link>
            <AnimatedHambugerButton
              isOpen={isMenuOpen}
              toggleMenu={toggleMenu}
            />
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="bg-marketing-background text-marketing-md fixed inset-0 z-40 overflow-y-auto pb-[72px] pt-[50px] text-left md:pt-[56px] lg:hidden"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            transition={{ duration: 0.15 }}
          >
            <div className="relative">
              <div className="flex min-h-full flex-col p-6 pt-4 md:pt-3">
                <hr className="border-black/15 sm:hidden" />
                <Accordion title="Product" className="sm:hidden">
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
                </Accordion>
                <div className="hidden w-full pb-6 sm:block">
                  <h2 className="text-marketing-primary flex h-[60px] items-center leading-5">
                    Products
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
                  className="bg-marketing-background flex h-[60px] w-full items-center leading-5"
                >
                  Changelog
                </Link>
                <hr className="border-black/15" />
                <Link
                  href={discordURL}
                  className="bg-marketing-background flex h-[60px] w-full items-center leading-5"
                >
                  Discord
                </Link>
                <hr className="border-black/15" />
                <Link
                  href={twitterUrl}
                  className="bg-marketing-background flex h-[60px] w-full items-center leading-5"
                >
                  Twitter
                </Link>
                <hr className="border-black/15" />
              </div>
              <div className="fixed bottom-0 left-0 right-0 p-6">
                <Button className="w-full md:py-3.5">
                  <Image
                    src="/github.svg"
                    alt="github logo"
                    height={24}
                    width={24}
                    className="col-span-2 col-start-1 h-[22px] w-auto md:h-6"
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
