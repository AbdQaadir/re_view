"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { LogInIcon } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full flex justify-between items-center p-4 h-16 shadow-sm bg-white">
      <Link href="/">
        <h1 className="text-lg md:text-2xl font-bold">re_view</h1>
      </Link>

      <div className="flex items-center gap-2 md:gap-4">
        <SignedOut>
          <SignInButton>
            <Button variant="default" size="sm">
              Sign in <LogInIcon className="w-4 h-4" />
            </Button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <Link href="/my-reviews">
            <Button size="sm" variant="outline" className="rounded-md">
              My reviews
            </Button>
          </Link>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
