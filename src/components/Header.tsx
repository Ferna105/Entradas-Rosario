"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function Header() {
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [navOpen]);

  const closeNav = () => setNavOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-zinc-900/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-h-[44px] min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            aria-expanded={navOpen}
            aria-controls="mobile-nav"
            onClick={() => setNavOpen((o) => !o)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-white/10 bg-zinc-800/80 text-zinc-100 md:hidden"
          >
            <span className="sr-only">Abrir menú</span>
            {navOpen ? (
              <span className="text-xl leading-none" aria-hidden>
                ×
              </span>
            ) : (
              <span className="flex flex-col gap-1.5" aria-hidden>
                <span className="block h-0.5 w-5 rounded-full bg-current" />
                <span className="block h-0.5 w-5 rounded-full bg-current" />
                <span className="block h-0.5 w-5 rounded-full bg-current" />
              </span>
            )}
          </button>
          <Link
            href="/"
            onClick={closeNav}
            className="truncate text-lg font-bold tracking-tight text-white sm:text-xl md:text-2xl"
          >
            Entradas Rosario
          </Link>
        </div>

        <ul className="hidden items-center gap-6 text-sm font-medium md:flex">
          <li>
            <Link
              href="/"
              className="rounded-lg px-2 py-2 text-zinc-300 transition-colors hover:text-violet-400"
            >
              Eventos
            </Link>
          </li>
          {loading ? null : user ? (
            <li className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex min-h-[44px] items-center gap-2 rounded-xl px-2 py-1 text-zinc-200 transition-colors hover:text-white"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden max-w-[140px] truncate lg:inline">
                  {user.name}
                </span>
              </button>
              {menuOpen && (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-40 cursor-default bg-black/40 md:hidden"
                    aria-label="Cerrar menú"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 py-2 shadow-xl shadow-black/40">
                    <div className="border-b border-white/10 px-4 py-3">
                      <p className="truncate text-sm font-semibold text-zinc-100">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-zinc-400">{user.email}</p>
                      <p className="mt-1 text-xs capitalize text-zinc-500">
                        {user.type === "seller"
                          ? "Organizador"
                          : user.type === "buyer"
                            ? "Comprador"
                            : user.type === "scanner"
                              ? "Escaneador"
                              : user.type}
                      </p>
                    </div>
                    {(user.type === "seller" || user.type === "admin") && (
                      <Link
                        href="/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-3 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-violet-400"
                      >
                        Mis Eventos
                      </Link>
                    )}
                    {user.type === "buyer" && (
                      <Link
                        href="/mis-entradas"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-3 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-violet-400"
                      >
                        Mis entradas
                      </Link>
                    )}
                    {user.type === "scanner" && (
                      <Link
                        href="/scanner"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-3 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-violet-400"
                      >
                        Escanear Entradas
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-red-400 transition-colors hover:bg-red-950/40"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </>
              )}
            </li>
          ) : (
            <>
              <li>
                <Link
                  href="/login"
                  className="rounded-lg px-2 py-2 text-zinc-300 transition-colors hover:text-violet-400"
                >
                  Ingresar
                </Link>
              </li>
              <li>
                <Link
                  href="/registro"
                  className="inline-flex min-h-[44px] items-center rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                >
                  Registrarse
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Compact auth on small screens when nav closed — show register / avatar hint */}
        <div className="flex shrink-0 items-center gap-2 md:hidden">
          {loading ? null : !user ? (
            <Link
              href="/registro"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-violet-600 px-3 text-sm font-semibold text-white"
            >
              Registro
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white"
              aria-label="Menú de cuenta"
            >
              {user.name.charAt(0).toUpperCase()}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile drawer */}
      {navOpen && (
        <div className="fixed inset-0 z-[100] md:hidden" id="mobile-nav">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Cerrar navegación"
            onClick={closeNav}
          />
          <div className="absolute left-0 top-0 flex h-full w-[min(100%,320px)] flex-col border-r border-white/10 bg-zinc-900 shadow-2xl">
            <div className="border-b border-white/10 px-4 py-4">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Menú
              </p>
            </div>
            <ul className="flex flex-col gap-1 p-3">
              <li>
                <Link
                  href="/"
                  onClick={closeNav}
                  className="flex min-h-[44px] items-center rounded-xl px-4 text-zinc-200 hover:bg-white/5"
                >
                  Eventos
                </Link>
              </li>
              {loading ? null : user ? (
                <>
                  {(user.type === "seller" || user.type === "admin") && (
                    <li>
                      <Link
                        href="/dashboard"
                        onClick={closeNav}
                        className="flex min-h-[44px] items-center rounded-xl px-4 text-zinc-200 hover:bg-white/5"
                      >
                        Mis Eventos
                      </Link>
                    </li>
                  )}
                  {user.type === "buyer" && (
                    <li>
                      <Link
                        href="/mis-entradas"
                        onClick={closeNav}
                        className="flex min-h-[44px] items-center rounded-xl px-4 text-zinc-200 hover:bg-white/5"
                      >
                        Mis entradas
                      </Link>
                    </li>
                  )}
                  {user.type === "scanner" && (
                    <li>
                      <Link
                        href="/scanner"
                        onClick={closeNav}
                        className="flex min-h-[44px] items-center rounded-xl px-4 text-zinc-200 hover:bg-white/5"
                      >
                        Escanear
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        closeNav();
                      }}
                      className="flex min-h-[44px] w-full items-center rounded-xl px-4 text-left text-red-400 hover:bg-red-950/30"
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/login"
                      onClick={closeNav}
                      className="flex min-h-[44px] items-center rounded-xl px-4 text-zinc-200 hover:bg-white/5"
                    >
                      Ingresar
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/registro"
                      onClick={closeNav}
                      className="flex min-h-[44px] items-center rounded-xl bg-violet-600 px-4 font-semibold text-white"
                    >
                      Registrarse
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Mobile user dropdown (same panel as desktop when opened from avatar) */}
      {menuOpen && (
        <div className="fixed inset-0 z-[110] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Cerrar"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-3 top-[72px] w-[min(calc(100vw-24px),280px)] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 py-2 shadow-xl">
            {user && (
              <>
                <div className="border-b border-white/10 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-zinc-100">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-zinc-400">{user.email}</p>
                </div>
                {(user.type === "seller" || user.type === "admin") && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-sm text-zinc-300 hover:bg-white/5"
                  >
                    Mis Eventos
                  </Link>
                )}
                {user.type === "buyer" && (
                  <Link
                    href="/mis-entradas"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-sm text-zinc-300 hover:bg-white/5"
                  >
                    Mis entradas
                  </Link>
                )}
                {user.type === "scanner" && (
                  <Link
                    href="/scanner"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-sm text-zinc-300 hover:bg-white/5"
                  >
                    Escanear Entradas
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-950/40"
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
