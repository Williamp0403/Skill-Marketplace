import { NavLink } from "react-router-dom";
import { Briefcase, Github, Linkedin, Mail, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1 flex flex-col gap-3">
            <NavLink
              to="/"
              className="flex items-center gap-2 font-bold text-lg"
            >
              <div className="bg-primary rounded-lg p-1.5">
                <Briefcase className="size-4 text-primary-foreground" />
              </div>
              Skill Marketplace
            </NavLink>
            <p className="text-sm text-muted-foreground leading-relaxed">
              La plataforma de matching basada en habilidades para profesionales
              y empresas innovadoras.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="size-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="size-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="size-5" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-sm text-foreground">
              Plataforma
            </h3>
            <nav className="flex flex-col gap-2">
              <NavLink
                to="/jobs"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Buscar trabajos
              </NavLink>
              <NavLink
                to="/profiles"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Explorar talentos
              </NavLink>
              <NavLink
                to="/register"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Crear cuenta
              </NavLink>
            </nav>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-sm text-foreground">Recursos</h3>
            <nav className="flex flex-col gap-2">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Centro de ayuda
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Blog
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Guía para profesionales
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-sm text-foreground">Contacto</h3>
            <a
              href="mailto:soporte@skillmarketplace.com"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="size-4" />
              soporte@skillmarketplace.com
            </a>
            <p className="text-sm text-muted-foreground">
              Lunes a Viernes, 9:00 - 18:00
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Skill Marketplace. Todos los derechos
            reservados.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Política de privacidad
            </a>
            <a
              href="#"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Términos de servicio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
