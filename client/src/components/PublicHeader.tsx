import { Button } from "./ui/button";
import { NavLink } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import { useAppAuth } from "../store/Auth";
import { FolderOpen, UserRound } from "lucide-react";

export function PublicHeader() {
  const { isAuthenticated } = useAppAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 py-4 px-6 md:px-8">
      <nav className="flex flex-1 items-center gap-8 justify-between mx-auto w-full max-w-7xl h-10">
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
    </header>
  );
}
