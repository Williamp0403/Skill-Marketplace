import { UserButton } from "@clerk/clerk-react";
import { Bell, MessageSquare, Search, Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export function ProfessionalHeader({ onMenuClick }: HeaderProps) {
  return (
    <header className="h-16 bg-background/80 border-b border-border flex items-center justify-between px-6 max-sm:px-4 sticky top-0 z-30 backdrop-blur-md">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-primary transition-colors"
          onClick={onMenuClick}
        >
          <Menu className="size-6" />
        </button>

        {/* Search Bar - Hidden on very small screens or adjusted */}
        <div className="relative w-full max-w-[400px] hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar trabajos, habilidades..."
            className="w-full bg-secondary border border-border rounded-md pl-10 pr-4 py-2 text-sm outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10"
          />
        </div>
      </div>

      {/* Right Side: Notifications + Messages + User */}
      <div className="flex items-center gap-3">
        <button
          className="relative p-2 rounded-full text-muted-foreground transition-all hover:bg-accent hover:text-primary"
          title="Mensajes"
        >
          <MessageSquare className="size-5" />
        </button>
        <button
          className="relative p-2 rounded-full text-muted-foreground transition-all hover:bg-accent hover:text-primary"
          title="Notificaciones"
        >
          <Bell className="size-5" />
          <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-background" />
        </button>
        <div className="w-px h-6 bg-border mx-1" />
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-9 h-9",
            },
          }}
        />
      </div>
    </header>
  );
}
