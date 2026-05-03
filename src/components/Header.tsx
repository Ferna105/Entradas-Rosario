"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Avatar, Icon } from "@/components/ui";

const NAV_LINKS = [
  { href: "/", label: "Explorar" },
  { href: "/#esta-semana", label: "Esta semana" },
];

export default function Header() {
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setNavOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [navOpen]);

  const closeAll = () => { setNavOpen(false); setMenuOpen(false); };

  const userLinks = () => {
    if (!user) return null;
    if (user.type === "seller" || user.type === "admin") {
      return (
        <>
          <DropdownLink href="/dashboard" onClick={closeAll}>Mis eventos</DropdownLink>
          <DropdownLink href="/eventos/crear" onClick={closeAll}>Crear evento</DropdownLink>
        </>
      );
    }
    if (user.type === "buyer") {
      return (
        <>
          <DropdownLink href="/mis-entradas" onClick={closeAll}>Mis entradas</DropdownLink>
          <DropdownLink href="/mis-favoritos" onClick={closeAll}>Mis favoritos</DropdownLink>
        </>
      );
    }
    if (user.type === "scanner") {
      return <DropdownLink href="/scanner" onClick={closeAll}>Escanear entradas</DropdownLink>;
    }
    return null;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-ink-4 bg-ink-1/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-6 py-[14px] lg:px-8">

        {/* ── Logo ── */}
        <div className="flex items-center gap-8">
          <Link href="/" onClick={closeAll} className="flex items-center gap-[10px]">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-yellow-300"
              style={{ transform: "rotate(-8deg)" }}
            >
              <Icon name="flash" size={18} color="var(--violet-900)" strokeWidth={2.5} />
            </div>
            <span className="text-[17px] font-bold tracking-snug text-text-primary">
              Entradas Rosario
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full px-[14px] py-2 text-[13px] font-medium text-text-secondary transition-colors hover:bg-ink-3 hover:text-text-primary"
              >
                {l.label}
              </Link>
            ))}
            {user && user.type === "buyer" && (
              <>
                <Link
                  href="/mis-entradas"
                  className="rounded-full px-[14px] py-2 text-[13px] font-medium text-text-secondary transition-colors hover:bg-ink-3 hover:text-text-primary"
                >
                  Mis entradas
                </Link>
                <Link
                  href="/mis-favoritos"
                  className="rounded-full px-[14px] py-2 text-[13px] font-medium text-text-secondary transition-colors hover:bg-ink-3 hover:text-text-primary"
                >
                  Favoritos
                </Link>
              </>
            )}
            {user && (user.type === "seller" || user.type === "admin") && (
              <Link
                href="/eventos/crear"
                className="rounded-full px-[14px] py-2 text-[13px] font-medium text-text-secondary transition-colors hover:bg-ink-3 hover:text-text-primary"
              >
                Crear evento
              </Link>
            )}
          </nav>
        </div>

        {/* ── Acciones desktop ── */}
        <div className="hidden items-center gap-[10px] md:flex">
          {!loading && (
            <>
              {/* Notificaciones placeholder */}
              <button
                type="button"
                className="relative flex h-[38px] w-[38px] items-center justify-center rounded-full border border-ink-4 bg-ink-3 text-text-secondary transition-colors hover:text-text-primary"
                aria-label="Notificaciones"
              >
                <Icon name="bell" size={16} />
                {/* dot indicador */}
                <span className="absolute right-[9px] top-[8px] h-2 w-2 rounded-full border-2 border-ink-3 bg-yellow-300" />
              </button>

              {user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((o) => !o)}
                    className="flex h-[42px] items-center gap-2 rounded-xl px-2 py-1 transition-colors hover:bg-ink-3"
                  >
                    <Avatar name={user.name} size={34} ring="var(--violet-500)" />
                    <span className="hidden max-w-[140px] truncate text-[13px] font-medium lg:inline">
                      {user.name}
                    </span>
                    <Icon name="chevronDown" size={14} className="text-text-tertiary" />
                  </button>

                  {menuOpen && (
                    <>
                      <button
                        type="button"
                        className="fixed inset-0 z-40 cursor-default"
                        aria-label="Cerrar menú"
                        onClick={() => setMenuOpen(false)}
                      />
                      <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-[16px] border border-ink-4 bg-ink-2 py-2 shadow-xl">
                        <div className="border-b border-ink-4 px-4 py-3">
                          <p className="truncate text-[14px] font-semibold text-text-primary">{user.name}</p>
                          <p className="truncate text-[12px] text-text-tertiary">{user.email}</p>
                          <p className="mt-1 text-[11px] capitalize text-text-tertiary">
                            {user.type === "seller" ? "Organizador" : user.type === "buyer" ? "Comprador" : user.type === "scanner" ? "Escaneador" : user.type}
                          </p>
                        </div>
                        {userLinks()}
                        <button
                          type="button"
                          onClick={() => { logout(); closeAll(); }}
                          className="w-full px-4 py-3 text-left text-[13px] text-danger transition-colors hover:bg-danger-bg"
                        >
                          Cerrar sesión
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-full px-[14px] py-2 text-[13px] font-medium text-text-secondary transition-colors hover:text-text-primary"
                  >
                    Ingresar
                  </Link>
                  <Link
                    href="/registro"
                    className="inline-flex h-[42px] items-center rounded-full bg-yellow-300 px-[18px] text-[14px] font-semibold text-text-on-yellow transition-all hover:brightness-110"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* ── Mobile: hamburger + avatar compacto ── */}
        <div className="flex items-center gap-2 md:hidden">
          {!loading && !user && (
            <Link
              href="/registro"
              className="inline-flex h-[42px] items-center rounded-full bg-yellow-300 px-4 text-[13px] font-semibold text-text-on-yellow"
            >
              Registro
            </Link>
          )}
          {!loading && user && (
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-violet-500 text-[14px] font-bold text-white"
              aria-label="Menú de cuenta"
            >
              {user.name.charAt(0).toUpperCase()}
            </button>
          )}
          <button
            type="button"
            aria-expanded={navOpen}
            aria-controls="mobile-nav"
            onClick={() => setNavOpen((o) => !o)}
            className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-ink-4 bg-ink-3 text-text-primary"
          >
            <span className="sr-only">Abrir menú</span>
            {navOpen
              ? <Icon name="close" size={18} />
              : <Icon name="menu" size={18} />
            }
          </button>
        </div>
      </nav>

      {/* ── Mobile nav drawer ── */}
      {navOpen && (
        <div className="fixed inset-0 z-[100] md:hidden" id="mobile-nav">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Cerrar navegación"
            onClick={() => setNavOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-[min(100%,320px)] flex-col border-r border-ink-4 bg-ink-1 shadow-2xl">
            {/* Header del drawer */}
            <div className="flex items-center gap-3 border-b border-ink-4 px-5 py-4">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-yellow-300"
                style={{ transform: "rotate(-8deg)" }}
              >
                <Icon name="flash" size={15} color="var(--violet-900)" strokeWidth={2.5} />
              </div>
              <span className="text-[15px] font-bold">Entradas Rosario</span>
            </div>

            <ul className="flex flex-col gap-1 p-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setNavOpen(false)}
                    className="flex min-h-[44px] items-center rounded-xl px-4 text-[14px] text-text-secondary hover:bg-ink-3 hover:text-text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              {!loading && user && (
                <>
                  {userLinks()}
                  <li>
                    <button
                      type="button"
                      onClick={() => { logout(); closeAll(); }}
                      className="flex min-h-[44px] w-full items-center rounded-xl px-4 text-left text-[14px] text-danger hover:bg-danger-bg"
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </>
              )}
              {!loading && !user && (
                <>
                  <li>
                    <Link href="/login" onClick={() => setNavOpen(false)} className="flex min-h-[44px] items-center rounded-xl px-4 text-[14px] text-text-secondary hover:bg-ink-3">
                      Ingresar
                    </Link>
                  </li>
                  <li>
                    <Link href="/registro" onClick={() => setNavOpen(false)} className="flex min-h-[44px] items-center rounded-xl bg-yellow-300 px-4 text-[14px] font-semibold text-text-on-yellow">
                      Registrarse
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* ── Mobile user dropdown ── */}
      {menuOpen && user && (
        <div className="fixed inset-0 z-[110] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Cerrar"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-3 top-[68px] w-[min(calc(100vw-24px),280px)] overflow-hidden rounded-[16px] border border-ink-4 bg-ink-2 py-2 shadow-xl">
            <div className="border-b border-ink-4 px-4 py-3">
              <p className="truncate text-[14px] font-semibold text-text-primary">{user.name}</p>
              <p className="truncate text-[12px] text-text-tertiary">{user.email}</p>
            </div>
            {userLinks()}
            <button
              type="button"
              onClick={() => { logout(); closeAll(); }}
              className="w-full px-4 py-3 text-left text-[13px] text-danger hover:bg-danger-bg"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function DropdownLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-3 text-[13px] text-text-secondary transition-colors hover:bg-ink-3 hover:text-text-primary"
    >
      {children}
    </Link>
  );
}
