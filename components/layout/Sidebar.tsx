"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface MenuItem {
  name: string;
  href: string;
  iconSrc: string;
  hasDropdown?: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    title: "DASHBOARDS",
    items: [
      {
        name: "Student Profile",
        href: "/dashboard",
        iconSrc: "/dashboards/student.png",
      },
      {
        name: "SmartAdmit",
        href: "/smartadmit",
        iconSrc: "/dashboards/analytics.png",
      },
      {
        name: "Chat",
        href: "/chat",
        iconSrc: "/dashboards/chat.png",
      },
    ],
  },
  {
    title: "APPLICATIONS",
    items: [
      {
        name: "Profile Planner",
        href: "/profile-planner",
        iconSrc: "/applications/profile-planner.png",
        hasDropdown: true,
      },
      {
        name: "University Finder",
        href: "/university-finder",
        iconSrc: "/applications/finder.png",
        hasDropdown: true,
      },
      {
        name: "Essay Builder",
        href: "/essay-builder",
        iconSrc: "/applications/essay.png",
        hasDropdown: true,
      },
      {
        name: "Counsellor Centre",
        href: "/counsellor-centre",
        iconSrc: "/applications/counsellor.png",
      },
      {
        name: "App Tracker",
        href: "/app-tracker",
        iconSrc: "/applications/tracker.png",
      },
      {
        name: "My Preferences",
        href: "/preferences",
        iconSrc: "/applications/preferences.png",
      },
    ],
  },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* Mobile Menu Button - Elegant Hamburger (Outside when closed) */}
      {!isMobileOpen && (
        <button
          onClick={toggleMobile}
          className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white shadow-lg rounded-xl border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className="block h-0.5 w-full bg-gray-800 rounded-full transition-all duration-300" />
            <span className="block h-0.5 w-full bg-gray-800 rounded-full transition-all duration-300" />
            <span className="block h-0.5 w-full bg-gray-800 rounded-full transition-all duration-300" />
          </div>
        </button>
      )}

      {/* Mobile Overlay - Smooth fade */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          bg-gray-900 text-gray-300
          transition-transform duration-300 ease-out
          ${isCollapsed ? "lg:w-20" : "w-56"}
          ${isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            {!isCollapsed && (
              <Link href="/">
                <Image
                  src="/white-logo.png"
                  alt="Uniiq Logo"
                  width={120}
                  height={40}
                  className="object-contain"
                />
              </Link>
            )}
            <div className="flex items-center gap-2 ml-auto">
              {/* Mobile Close Button - Inside Navbar */}
              <button
                onClick={toggleMobile}
                className="lg:hidden p-2 rounded-lg bg-gray-800 hover:bg-gray-700 active:scale-95 transition-all duration-200 text-gray-300 hover:text-white"
                aria-label="Close menu"
              >
                <div className="w-5 h-5 flex flex-col justify-center items-center relative">
                  <span className="block h-0.5 w-full bg-gray-300 rounded-full rotate-45 absolute transition-all duration-300" />
                  <span className="block h-0.5 w-full bg-gray-300 rounded-full -rotate-45 absolute transition-all duration-300" />
                </div>
              </button>
              {/* Desktop Collapse Button */}
              <button
                onClick={toggleCollapse}
                className="hidden lg:flex p-1.5 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Menu Sections */}
          <nav className="flex-1 overflow-y-auto py-4">
            {menuSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-6">
                {!isCollapsed && (
                  <h3 className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {section.title}
                  </h3>
                )}
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={`
                            flex items-center gap-3 px-4 py-2.5 mx-2 rounded-md
                            transition-colors duration-150
                            ${
                              isActive
                                ? "bg-gray-700 text-white border-l-2 border-white"
                                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                            }
                          `}
                          title={isCollapsed ? item.name : undefined}
                        >
                          <span className="flex-shrink-0">
                            <Image
                              src={item.iconSrc}
                              alt={item.name}
                              width={20}
                              height={20}
                              className="w-5 h-5 object-contain"
                            />
                          </span>
                          {!isCollapsed && (
                            <>
                              <span className="flex-1">{item.name}</span>
                              {item.hasDropdown && (
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              )}
                            </>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}

