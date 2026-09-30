"use client";

import { navItems } from "@/lib/constants";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowUp, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { ShoppingCartIcon } from "@phosphor-icons/react";
import { UserIcon } from "@phosphor-icons/react";
import { useUser } from "@/lib/useUser";
import { signOut } from "@/lib/auth";
import Logo from "@/public/images/resources/cabana_wear_logo.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const pathname = usePathname();

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const { user, loading } = useUser();

  const toggleNavbar = () => setOpen((prev) => !prev);
  const closeNavBar = () => setOpen(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // -- Escape key to close --
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) closeNavBar();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // -- Body scroll lock --
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // -- Move focus into drawer when it opens, return it when it closes --
  useEffect(() => {
    if (open) {
      closeButtonRef.current?.focus();
    } else {
      menuButtonRef.current?.focus();
    }
  }, [open]);

  // -- Scroll listener --
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { totalItems } = useCart();

  return (
    <nav>
      <div
        id="navbar"
        className={`w-full h-[8ch] backdrop-blur-sm flex items-center justify-between md:px-10 sm:px-10 px-4 p-9 top-0 transition-all ease-in-out duration-300 z-50 ${
          isScrolled ? "bg-sky-50/30 border-sky-200" : "bg-nav-bg"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center h-full ">
          <div className="relative h-10 md:h-14 w-20 md:w-28">
            <Link href="/" className="block h-full w-full">
              <Image
                src={Logo}
                alt="Cabana Wear logo"
                fill
                className="object-contain p-1"
              />
            </Link>
          </div>
          <div className="hidden sm:flex flex-col justify-center leading-tight ">
            <span className="text-sm tracking-wide font-fredoka font-semibold text-nav-text">
              CABANA
            </span>
            <span className="text-sm tracking-wide font-fredoka font-semibold text-nav-text">
              WEAR
            </span>
          </div>
        </div>

        {/* Right-side controls (mobile: hamburger + cart, desktop: auth + cart) */}
        <div className="flex items-center gap-4">
          {/* Cart icon - always visible */}
          <div className="relative">
            <Link href="/cart" onClick={closeNavBar}>
              <button>
                <ShoppingCartIcon
                  size={24}
                  weight="fill"
                  mirrored={false}
                  className="cursor-pointer text-[#E9C46A] hover:text-[#fca311] hover:scale-110 hover:-translate-y-1 transition-all duration-300 ease-out"
                />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-sky-600 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </button>
            </Link>
          </div>

          {/* Desktop-only auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            {!loading &&
              (user ? (
                <div className="flex items-center gap-3">
                  <button className="bg-white px-4 py-2 rounded-full">
                    <UserIcon
                      size={22}
                      weight="duotone"
                      className="text-sky-700 cursor-pointer"
                    />
                  </button>

                  <Button
                    onClick={() => signOut()}
                    className="w-fit text-nowrap px-4 py-2 text-nav-text duration-300 cursor-pointer rounded-2xl border-2 border-nav-text  hover:border-[#fca311] font-grotesque  hover:text-[#fca311] transition-all ease-out bg-opacity-0 hover:scale-110 hover:-translate-y-1 "
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link href="/email-password">
                  <Button className="w-fit text-nowrap px-4 py-2 text-nav-text  duration-300 cursor-pointer rounded-2xl border-2 border-nav-text  hover:border-[#fca311] font-grotesque  hover:text-[#fca311]  bg-opacity-0 hover:scale-110 hover:-translate-y-1 transition-all ease-out">
                    Sign In
                  </Button>
                </Link>
              ))}
          </div>

          {/* Hamburger button (mobile only) */}
          <button
            ref={menuButtonRef}
            onClick={toggleNavbar}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Open navigation menu"
            className="md:hidden text-neutral-100 focus:outline-none"
          >
            <Menu size={26} />
          </button>
        </div>
      </div>

      {/* -- Backdrop -- */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={closeNavBar}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed md:hidden top-0 right-0 h-screen w-[80%] max-w-[320px] bg-sidebar-mobile text-sidebar-mobile-links font-grotesque shadow-2xl ease-in-out duration-300 transition-transform flex flex-col z-[60] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Logo + close button inside drawer */}
        <div className="w-full flex items-center justify-between px-5 py-5 border-b border-neutral-200">
          <Link
            href="/"
            onClick={closeNavBar}
            className="text-lg font-semibold text-sky-700 flex items-center gap-x-2"
          >
            <div className="relative w-10 h-10 bg-[#001d3d] p-6 rounded-3xl">
              <Image
                src={Logo}
                alt="Cabana Wear logo"
                fill
                className="object-contain p-1"
              />
            </div>
          </Link>

          <button
            ref={closeButtonRef}
            onClick={closeNavBar}
            aria-label="Close navigation menu"
            className="focus:outline-none"
          >
            <X size={22} className="text-neutral-500" />
          </button>
        </div>

        {/* Nav items */}
        <ul className="flex flex-col gap-1 px-3 py-4">
          {navItems.map((item) => (
            <li key={item.name} onClick={closeNavBar}>
              <Link
                href={item.href}
                className={`block px-3 py-3 rounded-lg text-base font-medium ease-in-out duration-200 ${
                  pathname === item.href
                    ? "text-nav-text-active "
                    : "text-nav-bg hover:bg-[#E9C46A]"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Auth section pinned to bottom of drawer */}
        <div className="mt-auto px-5 py-6 border-t border-neutral-200">
          {!loading &&
            (user ? (
              <div className="flex items-center gap-3">
                <button className="bg-white p-2 rounded-full border border-neutral-200">
                  <UserIcon
                    size={22}
                    weight="duotone"
                    className="text-sky-700"
                  />
                </button>
                <button
                  onClick={() => {
                    signOut();
                    closeNavBar();
                  }}
                  className="flex-1 px-4 py-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-50 ease-in-out duration-300 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/email-password" onClick={closeNavBar}>
                <button className="w-full px-4 py-2 text-[#001d3d] hover:bg-[#fca311] hover:border-none ease-in-out duration-300 cursor-pointer rounded-2xl border-2 border-[#001d3d]">
                  Sign In
                </button>
              </Link>
            ))}
        </div>
      </div>

      {/* Desktop floating pill nav (md and up only) */}
      <div className="hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 z-50 flex-row items-center w-fit gap-6 hover:scale-115 hover:-translate-y-1 transition duration-300 ease-out">
        <ul className="flex-1 flex flex-row items-center justify-center gap-4 text-[14px] text-neutral-700 bg-sky-50/50 backdrop-blur-2xl font-inter rounded-full px-4 py-2">
          {navItems.map((item) => (
            <li
              key={item.name}
              onClick={closeNavBar}
              className={`hover:text-[#fca311] text-sm lg:text-lg text-nowrap ease-in-out duration-200 ${
                pathname === item.href ? "text-[#fca311]" : "text-neutral-600"
              } cursor-pointer`}
            >
              <Link href={item.href}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Scroll-to-top button */}
      <Button
        onClick={scrollToTop}
        size="icon"
        aria-label="Scroll to top"
        className={`fixed bottom-6 right-6 z-50 rounded-full h-11 w-11 shadow-lg bg-[#0a1128] hover:bg-[#0a1128]/90 text-white transition-all duration-300 ${
          showScrollTop
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <ArrowUp size={20} />
      </Button>
    </nav>
  );
}
