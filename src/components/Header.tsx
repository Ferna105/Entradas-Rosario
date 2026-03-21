"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function Header() {
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-black text-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between py-4 px-4 md:px-0">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight hover:text-gray-300 transition-colors"
          >
            Entradas Rosario
          </Link>
        </div>
        <ul className="flex gap-6 text-base font-medium items-center">
          <li>
            <Link
              href="/"
              className="hover:text-gray-300 transition-colors"
            >
              Eventos
            </Link>
          </li>
          {loading ? null : user ? (
            <li className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 hover:text-gray-300 transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden md:inline">{user.name}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400 capitalize mt-1">
                      {user.type === "seller" ? "Organizador" : user.type === "buyer" ? "Comprador" : user.type === "scanner" ? "Escaneador" : user.type}
                    </p>
                  </div>
                  {(user.type === "seller" || user.type === "admin") && (
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Mis Eventos
                    </Link>
                  )}
                  {user.type === "scanner" && (
                    <Link
                      href="/scanner"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Escanear Entradas
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </li>
          ) : (
            <>
              <li>
                <Link
                  href="/login"
                  className="hover:text-gray-300 transition-colors"
                >
                  Ingresar
                </Link>
              </li>
              <li>
                <Link
                  href="/registro"
                  className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm"
                >
                  Registrarse
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
