import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Save,
  MapPin,
  Building2,
  Globe,
  FileText,
  AlertCircle,
} from "lucide-react";
import {
  getMyClientProfileService,
  updateMyClientProfileService,
} from "@/services/clientProfile";
import {
  clientProfileSchema,
  type ClientProfileFormValues,
} from "@/schemas/clientProfile.schema";
import type { ClientProfile as ClientProfileType } from "@/types/clientProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function ClientProfile() {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery<ClientProfileType>({
    queryKey: ["client-profile"],
    queryFn: getMyClientProfileService,
  });

  const form = useForm<ClientProfileFormValues>({
    resolver: zodResolver(clientProfileSchema),
    values: {
      companyName: profile?.companyName || "",
      industry: profile?.industry || "",
      website: profile?.website || "",
      about: profile?.about || "",
      location: profile?.location || "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateMyClientProfileService,
    onSuccess: (updatedData) => {
      queryClient.setQueryData(["client-profile"], updatedData);
    },
    onError: (error: Error) => {
      form.setError("root", {
        message: error.message || "Error al actualizar el perfil",
      });
    },
  });

  const onSubmit = (data: ClientProfileFormValues) => {
    updateMutation.mutate({
      companyName: data.companyName || null,
      industry: data.industry || null,
      website: data.website || null,
      about: data.about || null,
      location: data.location || null,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Mi Perfil de Empresa
        </h1>
        <p className="text-muted-foreground mt-1">
          Esta es la información que verán los profesionales cuando publiques un
          proyecto o les envíes un mensaje.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-8 space-y-8 shadow-sm">
            <div className="flex items-center gap-2 border-b border-border pb-4">
              <Building2 className="size-5 text-primary" />
              <h2 className="text-xl font-semibold">Información Básica</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la Empresa o Emprendimiento</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej. TechNova Solutions"
                        className="bg-background"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industria / Sector</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej. Desarrollo de Software"
                        className="bg-background"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <Globe className="size-4 text-muted-foreground" />
                      Sitio Web
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://www.tuempresa.com"
                        className="bg-background"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <MapPin className="size-4 text-muted-foreground" />
                      Ubicación (Sede principal)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej. Ciudad de México, México"
                        className="bg-background"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <FileText className="size-4 text-muted-foreground" />
                    Acerca de la Empresa
                  </FormLabel>
                  <FormDescription>
                    Cuéntales a los profesionales qué hace tu empresa, tus
                    valores y qué tipo de talento buscas.
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="Somos una startup innovadora buscando talento excepcional para construir herramientas del futuro..."
                      className="min-h-[150px] resize-y bg-background"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center gap-2 border border-destructive/20 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="size-4 shrink-0" />
                {form.formState.errors.root.message}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="gap-2"
            >
              {updateMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Guardar Cambios
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
