"use client";

import { useState } from "react";

interface CountryCode {
  code: string;
  flag: string;
  name: string;
}

const countryCodes: CountryCode[] = [
  { code: "+1", flag: "🇺🇸", name: "US" },
  { code: "+91", flag: "🇮🇳", name: "IN" },
  { code: "+44", flag: "🇬🇧", name: "GB" },
  { code: "+86", flag: "🇨🇳", name: "CN" },
  { code: "+81", flag: "🇯🇵", name: "JP" },
  { code: "+49", flag: "🇩🇪", name: "DE" },
  { code: "+33", flag: "🇫🇷", name: "FR" },
  { code: "+61", flag: "🇦🇺", name: "AU" },
];

interface CountryCodeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CountryCodeSelect({
  value,
  onChange,
}: CountryCodeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedCountry = countryCodes.find((c) => c.code === value) || countryCodes[1];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-[48px] w-full items-center justify-between gap-2 rounded border border-gray-300 bg-white px-3 py-[14px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <span>{selectedCountry.flag}</span>
        <span>{selectedCountry.code}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
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
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-full z-20 mt-1 max-h-60 w-full overflow-auto rounded border border-gray-300 bg-white shadow-lg">
            {countryCodes.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => {
                  onChange(country.code);
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100"
              >
                <span>{country.flag}</span>
                <span>{country.code}</span>
                <span className="ml-auto text-gray-500">{country.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

