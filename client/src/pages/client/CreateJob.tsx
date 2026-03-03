import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createJobService } from "@/services/jobs";
import {
  createJobSchema,
  type CreateJobFormValues,
} from "@/schemas/createJobSchema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Briefcase,
  DollarSign,
  MapPin,
  MonitorSmartphone,
  ClipboardList,
  GraduationCap,
  X,
  Loader2,
  Sparkles,
  AlertCircle,
} from "lucide-react";

export function CreateJob() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [skillInput, setSkillInput] = useState("");

  const form = useForm<CreateJobFormValues>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      title: "",
      description: "",
      budget: undefined,
      workModel: undefined,
      experienceLevel: undefined,
      jobType: undefined,
      location: "",
      skills: [],
    },
  });

  const skills = form.watch("skills") || [];
  const workModel = form.watch("workModel");
  const isLocationRequired = workModel === "HYBRID" || workModel === "ONSITE";

  // Mutation
  const mutation = useMutation({
    mutationFn: createJobService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      navigate("/client/jobs");
    },
    onError: (error: Error) => {
      form.setError("root", {
        message: error.message || "Error al publicar el proyecto",
      });
    },
  });

  // Skills handling
  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      form.setValue("skills", [...skills, trimmed]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    form.setValue(
      "skills",
      skills.filter((s) => s !== skill),
    );
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  // Submit
  const onSubmit = (values: CreateJobFormValues) => {
    // Limpiar campos opcionales vacíos antes de enviar
    const data = {
      ...values,
      location: values.location || undefined,
      skills:
        values.skills && values.skills.length > 0 ? values.skills : undefined,
    };
    mutation.mutate(data);
  };

  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Publicar Nuevo Proyecto
        </h1>
        <p className="text-muted-foreground mt-1">
          Describe tu proyecto y encuentra al profesional ideal.
        </p>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Los campos marcados con <span className="text-destructive">*</span> son
        obligatorios
      </p>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* ─── Información Principal ─── */}
          <section className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Briefcase className="size-5 text-primary" />
              Información Principal
            </h2>

            {/* Título */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título del Proyecto *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Desarrollo de Landing Page con React"
                      className="bg-background"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descripción */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción del Proyecto *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe en detalle lo que necesitas: objetivos, entregables, plazos estimados..."
                      className="bg-background min-h-[150px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between items-center">
                    <FormMessage />
                    <p className="text-xs text-muted-foreground ml-auto">
                      {field.value?.length || 0} caracteres
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-6">
              {/* Presupuesto */}
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <DollarSign className="size-3.5 inline mr-1" />
                      Presupuesto (USD) *
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          type="number"
                          min="1"
                          placeholder="Ej: 500"
                          className="pl-9 bg-background"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "") {
                              field.onChange(undefined);
                              return;
                            }
                            const num = Number(val);
                            if (num >= 0) {
                              field.onChange(num);
                            }
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ubicación */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <MapPin className="size-3.5 inline mr-1" />
                      Ubicación {isLocationRequired && "*"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          isLocationRequired
                            ? "Ej: Madrid, España"
                            : "Ej: Madrid, España (opcional)"
                        }
                        className="bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          {/* ─── Detalles del Puesto ─── */}
          <section className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ClipboardList className="size-5 text-primary" />
              Detalles del Puesto
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Modalidad */}
              <FormField
                control={form.control}
                name="workModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <MonitorSmartphone className="size-3.5 inline mr-1" />
                      Modalidad *
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Seleccionar..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="REMOTE">Remoto</SelectItem>
                        <SelectItem value="HYBRID">Híbrido</SelectItem>
                        <SelectItem value="ONSITE">Presencial</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tipo de Trabajo */}
              <FormField
                control={form.control}
                name="jobType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <ClipboardList className="size-3.5 inline mr-1" />
                      Tipo de Trabajo *
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Seleccionar..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FULL_TIME">
                          Tiempo Completo
                        </SelectItem>
                        <SelectItem value="PART_TIME">Medio Tiempo</SelectItem>
                        <SelectItem value="FREELANCE">Freelance</SelectItem>
                        <SelectItem value="CONTRACT">Contrato</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nivel de Experiencia */}
              <FormField
                control={form.control}
                name="experienceLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <GraduationCap className="size-3.5 inline mr-1" />
                      Nivel de Experiencia *
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Seleccionar..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="JUNIOR">Junior</SelectItem>
                        <SelectItem value="MID_LEVEL">Semi-Senior</SelectItem>
                        <SelectItem value="SENIOR">Senior</SelectItem>
                        <SelectItem value="EXPERT">Experto</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          {/* ─── Skills Requeridas ─── */}
          <section className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              Skills Requeridas
            </h2>

            <div className="space-y-3">
              <FormLabel htmlFor="skill-input">
                Agrega las habilidades que necesitas
              </FormLabel>
              <div className="flex gap-2">
                <Input
                  id="skill-input"
                  placeholder="Ej: React, Node.js, Figma..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  className="bg-background flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSkill}
                  disabled={!skillInput.trim()}
                >
                  Agregar
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Presiona Enter o haz clic en "Agregar" para añadir cada skill.
              </p>

              {/* Tags */}
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-sm font-medium px-3 py-1.5 rounded-full transition-colors hover:bg-primary/20"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-destructive transition-colors"
                      >
                        <X className="size-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Submission Error */}
          {form.formState.errors.root && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center gap-2 border border-destructive/20 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="size-4 shrink-0" />
              {form.formState.errors.root.message}
            </div>
          )}

          {/* ─── Submit ─── */}
          <div className="flex items-center justify-end pt-2">
            <Button size="xl" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Publicando...
                </>
              ) : (
                "Publicar Proyecto"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
