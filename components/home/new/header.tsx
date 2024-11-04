"use client";

import type { Color } from '@/lib/home/colors';
import type { ReactElement } from "react";
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from "@/components/home/new/link";
import Logo from "@/components/home/new/logo";
import Button from '@/components/home/new/button';
import FeatureCard from "./feature-card";
import clsx from "clsx";
import { colors } from "@/lib/home/colors";
import { ChevronDown, Package, Speech, ScanSearch } from "lucide-react";
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
  link: {
    text: string;
    href: string;
    asCard: true;
  };
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

export default function Header({ className }: { className?: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const closeMenu = () => setIsMenuOpen(false);

  const menuVariants = {
    hidden: { opacity: 0, scale: 0.99 },
    visible: { opacity: 98, scale: 1 },
  };

  const products: Product[] = [
    {
      icon: <Package />,
      color: colors["green"],
      title: "Sell",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      link: {
        text: "Learn more",
        href: "#sell",
        asCard: true,
      },
    },
    {
      icon: <Speech />,
      color: colors["purple"],
      title: "Marketing",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      link: {
        text: "Learn more",
        href: "#marketing",
        asCard: true,
      },
    },
    {
      icon: <ScanSearch />,
      color: colors["orange"],
      title: "Research",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      link: {
        text: "Learn more",
        href: "#research",
        asCard: true,
      },
    },
  ];

  return (
    <>
      <header
        className={clsx(
          "fixed left-0 right-0 top-0 z-50 w-full bg-[#F5F5F4] pl-[22px] pr-4 pt-4 md:px-6 md:pt-[18px]",
          className,
        )}
      >
        <div className="relative z-[100] flex items-center justify-between pb-2.5">
          <Logo className="h-6 w-fit md:h-7" />
          <div className="absolute left-1/2 top-[calc(50%-6px)] hidden -translate-x-1/2 -translate-y-1/2 gap-9 lg:flex">
            <Link href="#product" className="whitespace-nowrap">
              Product
            </Link>
            <Link href="#" className="whitespace-nowrap">
              Why we exist
            </Link>
            <Link href="#" className="whitespace-nowrap">
              Changelog
            </Link>
            <button className="flex items-center gap-1 whitespace-nowrap">
              Follow
              <ChevronDown
                size={16}
                className="mt-0.5 opacity-70"
                strokeWidth={3}
              />
            </button>
          </div>
          <div className="flex w-fit items-center gap-[22px] md:gap-6">
            <Link href="#" className="text-marketing-primary -mt-0.5">
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
            className="bg-marketing-background text-marketing-primary fixed inset-0 z-40 overflow-y-auto pt-[50px] md:pt-[56px] lg:hidden"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            transition={{ duration: 0.15 }}
          >
            <div className="relative">
              <div className="flex min-h-full flex-col gap-y-5 p-6 pt-4 md:pt-9">
                <div className="md:order-auto order-last w-full text-left">
                  <h2 className="text-marketing-md mb-5">Products</h2>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    {products.map((product) => (
                      <FeatureCard
                        key={product.title}
                        icon={product.icon}
                        color={product.color}
                        title={product.title}
                        description={product.description}
                        link={product.link}
                      />
                    ))}
                  </div>
                </div>
                <hr className="border-black/15" />
                <Link
                  href={"#"}
                  className="text-marketing-md w-full text-left leading-5"
                >
                  Changelog
                </Link>
                <hr className="border-black/15" />
                <Link
                  href={"#"}
                  className="text-marketing-md w-full text-left leading-5"
                >
                  Why we exist
                </Link>
                <hr className="border-black/15" />
              </div>
              <div className="p-6 fixed bottom-0 left-0 right-0">
                <Button className='w-full drop-shadow-sm'>
                  <Image
                    src="/github.svg"
                    alt="github logo"
                    height={24}
                    width={24}
                    className="h-[22px] w-auto md:h-6"
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
