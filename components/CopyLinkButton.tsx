"use client";

import { useState } from "react";

export function CopyLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-full border border-ocean px-4 py-2 text-sm font-medium text-ocean transition-colors hover:bg-ocean hover:text-white"
    >
      {copied ? "Kopierad ✓" : "Kopiera länk"}
    </button>
  );
}
