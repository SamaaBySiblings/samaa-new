"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { RxCross1 } from "react-icons/rx";
import { useUIStore } from "@/store/ui";
import { CurrencySelector } from "@/components/CurrencySelector";


declare global {
  interface Window {
    __headerTimeout?: number;
  }
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const openCart = useUIStore((state) => state.openCart);

  const handleScroll = useCallback(() => {
    requestAnimationFrame(() => {
      const currentY = window.scrollY;
      setIsAtTop(currentY < 10);

      if (currentY > lastScrollY && currentY > 60) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      setLastScrollY(currentY);
    });

    clearTimeout(window.__headerTimeout);
    window.__headerTimeout = window.setTimeout(() => {}, 2000);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const handler = () => setIsOpen(false);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const closeMenu = () => setIsOpen(false);

  const isTransparent = isAtTop && !isHovered;

  return (
    <>
      <header
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out border-b
          ${showHeader ? "translate-y-0" : "-translate-y-full"}
          ${
            isTransparent
              ? "bg-transparent text-white border-transparent"
              : "bg-[#f5f5eb] text-black border-transparent"
          }
        `}
      >
        <div className="max-w-7xl mx-auto relative py-4 px-4 flex items-center justify-between">
          {/* Hamburger / Cross Menu toggle (mobile only) */}
          <button
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
            className="absolute top-4 left-4 md:hidden px-3 py-2 z-50 flex items-center justify-center"
            style={{ width: 48, height: 48 }}
          >
            {isOpen ? (
              <RxCross1 className="w-6 h-6 text-black" />
            ) : (
              <div className="flex flex-col justify-center gap-[6px] w-full">
                <span className="block h-[1px] w-full bg-black rounded" />
                <span
                  className="block h-[1px] bg-black rounded self-start"
                  style={{ width: "60%" }}
                />
                <span className="block h-[1px] w-full bg-black rounded" />
              </div>
            )}
          </button>

          {/* Currency Selector on left (desktop only) */}
          <div className="hidden md:flex items-center justify-start -ml-10">
            <CurrencySelector />
          </div>

          {/* Logo centered */}
          <Link
            href="/"
            className={`mx-auto z-20 transition-opacity duration-300 ${
              isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <h1 className="text-3xl md:text-3xl text-[#262626] tracking-tight font-[TANTanglon]">
              SAMAA
            </h1>
          </Link>

          {/* Cart Icon (desktop only) */}
          <div className="hidden md:block">
            <button
              onClick={openCart}
              className="relative"
              aria-label="Open cart"
            >
              <Image
                src={`https://res.cloudinary.com/db5c7s6lw/image/upload/v1753862359/cart_2_luoo5x.png`}
                alt="Cart"
                width={25}
                height={25}
                className="object-contain"
              />
              {cartCount > 0 && (
                <span
                  suppressHydrationWarning
                  className="absolute -top-2 -right-4 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="font-[D-DIN] mt-0 text-[#262626] hidden md:flex gap-12 text-sm justify-center max-w-6xl mx-auto">
          <Link href="/candles">CANDLES</Link>
          <Link href="/luxury">LUXURY</Link>
          <Link href="/stories">STORIES</Link>
          <Link href="/about">ABOUT</Link>
        </nav>
      </header>

      {/* Mobile full-screen sliding menu */}
      <div
        className={`fixed inset-0 z-30 bg-[#f5f5eb] bg-opacity-95 backdrop-blur-sm flex flex-col items-center justify-center text-black transform transition-transform duration-300 ease-in-out md:hidden`}
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <nav className="font-[D-DIN] flex flex-col items-center space-y-12 text-3xl font-light overflow-y-auto max-h-full px-8">
          {["candles", "luxury", "stories", "about"].map((path) => (
            <Link
              key={path}
              href={`/${path}`}
              onClick={closeMenu}
              className="hover:text-gray-600 transition-colors"
            >
              {path.toUpperCase()}
            </Link>
          ))}
        </nav>

        {/* Cart and Currency side-by-side at bottom */}
        <div className="mt-20 flex flex-row items-center justify-center space-x-6 w-full px-8">
          <button
            onClick={() => {
              closeMenu();
              openCart();
            }}
            className="relative w-10 h-10 flex items-center justify-center"
            aria-label="Open cart"
          >
            <Image
              src={`https://res.cloudinary.com/db5c7s6lw/image/upload/v1752994713/shopping-cart-icon_dncpuu.png`}
              alt="Cart"
              width={25}
              height={25}
              className="object-contain"
            />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          <CurrencySelector />
        </div>
      </div>
    </>
  );
}
