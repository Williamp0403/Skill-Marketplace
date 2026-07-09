import { useState } from "react";
import { Button } from "./ui/button";
import { NavLink } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import { useAppAuth } from "../store/Auth";
import { FolderOpen, Menu, UserRound, X } from "lucide-react";

export function PublicHeader() {
  const { isAuthenticated } = useAppAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 py-4 px-6 md:px-8">
      {/* Desktop */}
      <nav className="hidden md:flex flex-1 items-center gap-8 justify-between mx-auto w-full max-w-7xl h-10">
        <NavLink
          to="/"
          className="font-bold text-xl tracking-tight text-primary"
        >
          Skill Marketplace
        </NavLink>

        <div className="flex items-center gap-6">
          <NavLink
            to="/profiles"
            className={({ isActive }) =>
              `flex items-center gap-2 text-sm font-medium hover:text-primary rounded-full transition-colors ${isActive ? "text-primary" : ""}`
            }
          >
            <UserRound className="size-5" />
            Talentos
          </NavLink>
          <NavLink
            to="/jobs"
            className={({ isActive }) =>
              `flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors ${isActive ? "text-primary" : ""}`
            }
          >
            <FolderOpen className="size-5" />
            Trabajos
          </NavLink>
        </div>

        {!isAuthenticated ? (
          <div className="flex items-center gap-4">
            <NavLink to="/login">
              <Button variant="outline">Iniciar Sesión</Button>
            </NavLink>
            <NavLink to="/register">
              <Button variant="default">Registrarse</Button>
            </NavLink>
          </div>
        ) : (
          <UserButton
            appearance={{
              elements: {
                avatarBox: "size-9 shadow-sm",
              },
            }}
          />
        )}
      </nav>

      {/* Mobile */}
      <div className="md:hidden flex items-center justify-between">
        <NavLink
          to="/"
          className="font-bold text-xl tracking-tight text-primary"
        >
          Skill Marketplace
        </NavLink>
        <button
          className="p-2 -mr-2 text-muted-foreground hover:text-primary transition-colors"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 z-50 bg-background border-b border-border shadow-lg p-5 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1">
            <NavLink
              to="/profiles"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`
              }
            >
              <UserRound className="size-5" />
              Talentos
            </NavLink>
            <NavLink
              to="/jobs"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`
              }
            >
              <FolderOpen className="size-5" />
              Trabajos
            </NavLink>
          </div>

          <div className="border-t border-border pt-4 flex flex-col gap-3">
            {!isAuthenticated ? (
              <>
                <NavLink to="/login" onClick={closeMenu} className="w-full">
                  <Button variant="outline" className="w-full">
                    Iniciar Sesión
                  </Button>
                </NavLink>
                <NavLink to="/register" onClick={closeMenu} className="w-full">
                  <Button variant="default" className="w-full">
                    Registrarse
                  </Button>
                </NavLink>
              </>
            ) : (
              <div className="flex items-center justify-center py-2">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "size-9 shadow-sm",
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </header>

    {isMobileMenuOpen && (
      <div
        className="fixed inset-x-0 top-[72px] bottom-0 bg-black/50 z-40 animate-in fade-in duration-200"
        onClick={closeMenu}
      />
    )}
    </>
  );
}
