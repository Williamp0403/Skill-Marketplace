import { Briefcase, CodeXml, MessageCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import heroBg from "../assets/hero-bg-10.jpg";
import clientBg from "../assets/client.jpg";
import professionalBg from "../assets/professional.jpg";
import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <div className="flex flex-col flex-1">
      <section
        className="flex flex-col items-center justify-center gap-6 lg:mx-16 md:mx-10 mx-6 lg:py-16 md:py-12 py-10 lg:px-10 md:px-8 px-6 my-10 rounded-3xl bg-cover bg-center border border-border/50 shadow-sm"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.20), rgba(255, 255, 255, 0.20)), url(${heroBg})`,
        }}
      >
        <h1 className="md:text-5xl text-3xl font-extrabold text-center max-w-4xl tracking-tight">
          Encuentra al profesional correcto para resolver tus problemas.
          <br />O encuentra la oportunidad correcta para crecer.
        </h1>
        <p className="md:text-2xl text-xl text-center text-gray-800 font-semibold max-w-3xl">
          La plataforma de matching basada en habilidades para profesionales y
          empresas innovadoras.
        </p>
        <div className="flex md:flex-row flex-col gap-4">
          <Link to="/profiles">
            <Button variant="default" size="xl">
              Explorar habilidades
            </Button>
          </Link>
          <Link to="/jobs">
            <Button variant="outline" size="xl">
              Buscar oportunidades
            </Button>
          </Link>
        </div>
      </section>
      <section className="flex flex-col justify-center gap-14 flex-1 lg:m-20 md:m-10 m-6">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-extrabold max-w-4xl">Cómo funciona</h1>
          <p className="text-xl text-muted-foreground font-medium max-w-3xl">
            Tres pasos para encontrar la oportunidad correcta.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-4 border border-border rounded-2xl bg-card p-8 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="w-fit flex items-center justify-center bg-primary/10 rounded-lg p-3">
              <Briefcase className="size-6 text-primary" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xl font-bold tracking-tight">
                Publica vacantes
              </span>
              <p className="text-muted-foreground leading-relaxed">
                Describe el perfil que buscas y deja que nuestro algoritmo
                encuentre el match perfecto basado en stacks técnicos reales.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 border border-border rounded-2xl bg-card p-8 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="w-fit flex items-center justify-center bg-primary/10 rounded-lg p-3">
              <CodeXml className="size-6 text-primary" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xl font-bold tracking-tight">
                Demuestra tus habilidades
              </span>
              <p className="text-muted-foreground leading-relaxed">
                Crea un perfil basado en tus proyectos reales, valida tus
                conocimientos y aplica directamente a retos técnicos.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 border border-border rounded-2xl bg-card p-8 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="w-fit flex items-center justify-center bg-primary/10 rounded-lg p-3">
              <MessageCircle className="size-6 text-primary" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xl font-bold tracking-tight">
                Comunicación directa
              </span>
              <p className="text-muted-foreground leading-relaxed">
                Chatea directamente con reclutadores o candidatos. Sin
                intermediarios, procesos transparentes y rápidos.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-col justify-center items-center gap-14 flex-1 lg:m-20 md:m-10 m-6">
        <div className="flex flex-col gap-1 items-center">
          <h1 className="text-3xl font-extrabold max-w-4xl">
            Beneficios para todos
          </h1>
          <div className="bg-primary w-16 h-1" />
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
          <div className="flex flex-col gap-4">
            <img
              src={clientBg}
              alt="client"
              className="w-full h-80 object-cover rounded-2xl shadow-sm"
            />
            <div className="flex flex-col gap-2 p-4">
              <div className="flex items-center gap-2">
                <Briefcase className="size-6 text-primary" />
                <span className="text-lg text-primary font-bold">
                  Para clientes
                </span>
              </div>
              <h2 className="text-2xl font-bold">
                Escala tu equipo de confianza
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Accede a una red global de talento verificado. Publica tus
                vacantes y deja que nuestro algoritmo encuentre el match
                perfecto basado en habilidades reales.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <img
              src={professionalBg}
              alt="professional"
              className="w-full h-80 object-cover rounded-2xl shadow-sm"
            />
            <div className="flex flex-col gap-2 p-4">
              <div className="flex items-center gap-2 ">
                <CodeXml className="size-6 text-primary" />
                <span className="text-lg text-primary font-bold">
                  Para profesionales
                </span>
              </div>
              <h2 className="text-2xl font-bold">Encuentra tu próximo reto</h2>
              <p className="text-muted-foreground leading-relaxed">
                Olvida las aplicacion genericas. Te conectamos con empresas que
                buscan exactamente lo que sabes hacer. Trabajos con propósito y
                renumeracion competitiva.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
