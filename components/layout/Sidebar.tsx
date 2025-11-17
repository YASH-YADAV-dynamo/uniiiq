"use client";

import { useState } from "react";
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

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-gray-300 rounded-md"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          bg-gray-900 text-gray-300
          transition-transform duration-300 ease-in-out
          ${isCollapsed ? "lg:w-20" : "w-56"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
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
              <button
                onClick={toggleMobile}
                className="lg:hidden p-1.5 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
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
                    d="M6 18L18 6M6 6l12 12"
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

