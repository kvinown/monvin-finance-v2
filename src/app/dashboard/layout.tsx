"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-background text-on-surface font-body-base h-screen flex overflow-hidden">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SideNavBar */}
      <nav className={`w-64 h-full fixed left-0 top-0 bg-primary-container border-r border-border-dark flex flex-col p-stack-md transition-transform duration-200 ease-in-out z-30 md:relative md:translate-x-0 flex-shrink-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-stack-lg flex flex-col items-start px-stack-sm">
          <div className="flex items-center gap-stack-sm mb-stack-sm w-full justify-between">
            <div className="flex items-center gap-stack-sm">
              <div className="w-8 h-8 rounded flex items-center justify-center overflow-hidden">
                <Image src="/logo.png" alt="Monvin Finance Logo" width={32} height={32} className="object-cover" />
              </div>
              <div>
                <h1 className="font-display-lg text-display-lg text-on-primary font-bold text-lg leading-none">Monvin Finance</h1>
                <span className="text-on-primary-container text-[10px] uppercase tracking-wider block mt-1">Institutional Grade</span>
              </div>
            </div>
            <button className="md:hidden text-on-primary" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
        <button className="w-full bg-secondary text-on-secondary h-[40px] rounded-lg mb-stack-lg font-table-data text-table-data font-medium flex items-center justify-center gap-2 hover:bg-secondary-container transition-colors">
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Transaction
        </button>
        <div className="flex flex-col gap-1 flex-grow font-body-base text-body-base">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              pathname === "/dashboard"
                ? "bg-secondary text-on-secondary font-bold shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                : "text-on-primary-container hover:bg-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]" style={pathname === "/dashboard" ? { fontVariationSettings: "'FILL' 1" } : {}}>dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link
            href="/dashboard/wallets"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              pathname === "/dashboard/wallets"
                ? "bg-secondary text-on-secondary font-bold shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                : "text-on-primary-container hover:bg-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]" style={pathname === "/dashboard/wallets" ? { fontVariationSettings: "'FILL' 1" } : {}}>account_balance_wallet</span>
            <span>Wallets</span>
          </Link>
          <Link
            href="/dashboard/transactions"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              pathname === "/dashboard/transactions"
                ? "bg-secondary text-on-secondary font-bold shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                : "text-on-primary-container hover:bg-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]" style={pathname === "/dashboard/transactions" ? { fontVariationSettings: "'FILL' 1" } : {}}>receipt_long</span>
            <span>Transactions</span>
          </Link>
          <Link
            href="/dashboard/savings"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              pathname.startsWith("/dashboard/savings")
                ? "bg-secondary text-on-secondary font-bold shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                : "text-on-primary-container hover:bg-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]" style={pathname.startsWith("/dashboard/savings") ? { fontVariationSettings: "'FILL' 1" } : {}}>savings</span>
            <span>Savings Goals</span>
          </Link>
          <Link
            href="/dashboard/friends"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              pathname.startsWith("/dashboard/friends")
                ? "bg-secondary text-on-secondary font-bold shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                : "text-on-primary-container hover:bg-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]" style={pathname.startsWith("/dashboard/friends") ? { fontVariationSettings: "'FILL' 1" } : {}}>group</span>
            <span>Friends & P2P</span>
          </Link>
          <Link
            href="/dashboard/vaults"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              pathname.startsWith("/dashboard/vaults")
                ? "bg-secondary text-on-secondary font-bold shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                : "text-on-primary-container hover:bg-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]" style={pathname.startsWith("/dashboard/vaults") ? { fontVariationSettings: "'FILL' 1" } : {}}>account_balance</span>
            <span>Shared Vaults</span>
          </Link>
          <Link
            href="/dashboard/reports"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              pathname.startsWith("/dashboard/reports")
                ? "bg-secondary text-on-secondary font-bold shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                : "text-on-primary-container hover:bg-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]" style={pathname.startsWith("/dashboard/reports") ? { fontVariationSettings: "'FILL' 1" } : {}}>bar_chart</span>
            <span>Reports</span>
          </Link>
          <Link
            href="/dashboard/profile"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              pathname === "/dashboard/profile"
                ? "bg-secondary text-on-secondary font-bold shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                : "text-on-primary-container hover:bg-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]" style={pathname === "/dashboard/profile" ? { fontVariationSettings: "'FILL' 1" } : {}}>person</span>
            <span>Profile</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              pathname === "/dashboard/settings"
                ? "bg-secondary text-on-secondary font-bold shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                : "text-on-primary-container hover:bg-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]" style={pathname === "/dashboard/settings" ? { fontVariationSettings: "'FILL' 1" } : {}}>settings</span>
            <span>Settings</span>
          </Link>
        </div>
        <div className="mt-auto pt-stack-md border-t border-border-dark flex items-center justify-center">
          <span className="text-on-primary-container text-[10px]">v1.0.0</span>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:w-[calc(100%-256px)] h-screen overflow-hidden">
        {/* TopAppBar */}
        <header className="h-16 flex-shrink-0 bg-surface border-b border-border-subtle flex justify-between items-center px-margin-mobile md:px-margin-desktop z-10 sticky top-0">
          <div className="flex items-center md:hidden">
            <button className="text-primary mr-4 p-2 hover:bg-surface-variant rounded-full" onClick={() => setIsMobileMenuOpen(true)}>
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface">Monvin Finance</h1>
          </div>
          <div className="hidden md:flex flex-1 max-w-md items-center relative">
            <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[20px]">search</span>
            <input className="w-full h-[38px] pl-10 pr-4 bg-surface-container-lowest border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-slate-400 focus:ring-0 placeholder-on-surface-variant transition-colors" placeholder="Search transactions, wallets..." type="text"/>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <ThemeToggle />
            <button className="text-on-surface-variant hover:text-secondary transition-colors cursor-pointer active:opacity-80 p-2 rounded-full hover:bg-surface-variant relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <button className="text-on-surface-variant hover:text-secondary transition-colors cursor-pointer active:opacity-80 p-2 rounded-full hover:bg-surface-variant hidden md:block">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="hidden md:flex items-center gap-3 ml-2 pl-4 border-l border-border-subtle cursor-pointer hover:opacity-80 transition-opacity">
                  <div className="flex flex-col items-end">
                    <span className="text-on-surface text-sm font-medium leading-tight">Administrator</span>
                    <span className="text-on-surface-variant text-xs">admin@monvin.com</span>
                  </div>
                  <div className="w-9 h-9 rounded-full border border-border-subtle bg-surface-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">person</span>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-surface-container-lowest border-border-subtle">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="flex items-center cursor-pointer">
                    <span className="material-symbols-outlined mr-2 text-[18px]">person</span>
                    Edit Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border-subtle" />
                <DropdownMenuItem onClick={() => signOut()} className="text-error focus:text-error focus:bg-error/10 cursor-pointer">
                  <span className="material-symbols-outlined mr-2 text-[18px]">logout</span>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="w-8 h-8 rounded-full border border-border-subtle md:hidden flex items-center justify-center bg-surface-variant ml-2 cursor-pointer">
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">person</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-surface-container-lowest border-border-subtle">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="flex items-center cursor-pointer">
                    <span className="material-symbols-outlined mr-2 text-[18px]">person</span>
                    Edit Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border-subtle" />
                <DropdownMenuItem onClick={() => signOut()} className="text-error focus:text-error focus:bg-error/10 cursor-pointer">
                  <span className="material-symbols-outlined mr-2 text-[18px]">logout</span>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Canvas */}
        <main className="flex-1 overflow-y-auto p-margin-mobile md:p-margin-desktop bg-background pb-20 md:pb-8">
          <div className="max-w-container-max mx-auto space-y-stack-lg">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
