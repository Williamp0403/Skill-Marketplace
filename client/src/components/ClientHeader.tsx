import { UserButton } from "@clerk/clerk-react";
import { Bell, MessageSquare, Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export function ClientHeader({ onMenuClick }: HeaderProps) {
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
