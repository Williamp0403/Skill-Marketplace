import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getClientJobsService } from "@/services/jobs";
import { createInvitationService } from "@/services/invitations";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, AlertCircle, CheckCircle2 } from "lucide-react";

interface Props {
  professionalId: string;
  professionalName: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteProfessionalModal({ professionalId, professionalName, open, onOpenChange }: Props) {
  const [selectedJobId, setSelectedJobId] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const queryClient = useQueryClient();

  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["client-jobs"],
    queryFn: getClientJobsService,
    enabled: open,
  });

  const openJobs = jobs?.filter((j) => j.status === "OPEN") ?? [];

  const { mutate, isPending, error } = useMutation({
    mutationFn: () =>
      createInvitationService({
        professionalId,
        jobId: selectedJobId,
        message: message || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      setSelectedJobId("");
      setMessage("");
      setIsSuccess(true);
    },
  });

  const handleOpenChange = (val: boolean) => {
    onOpenChange(val);
    if (!val) {
      // Small timeout to prevent the success screen from flickering during close transition
      setTimeout(() => {
        setIsSuccess(false);
      }, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {isSuccess ? (
          <div className="flex flex-col items-center text-center py-6 space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="bg-emerald-500/10 text-emerald-500 p-4 rounded-full">
              <CheckCircle2 className="size-12 shrink-0 animate-bounce" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">¡Invitación Enviada!</DialogTitle>
              <DialogDescription className="text-muted-foreground mt-2">
                Le enviamos la invitación a {professionalName || "el profesional"} para unirse a tu proyecto.
              </DialogDescription>
            </div>
            <Button className="w-full mt-4" onClick={() => handleOpenChange(false)}>
              Entendido
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Invitar a proyecto</DialogTitle>
              <DialogDescription>
                {professionalName
                  ? `Seleccioná un proyecto abierto para invitar a ${professionalName}.`
                  : "Seleccioná un proyecto abierto para enviar una invitación."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {jobsLoading ? (
                <div className="flex items-center justify-center py-6 text-muted-foreground">
                  <Loader2 className="size-5 animate-spin mr-2" />
                  Cargando proyectos...
                </div>
              ) : openJobs.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
                  <AlertCircle className="size-8 opacity-50" />
                  <p className="text-sm text-center">No tenés proyectos abiertos para invitar.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Proyecto</label>
                    <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccioná un proyecto..." />
                      </SelectTrigger>
                      <SelectContent>
                        {openJobs.map((job) => (
                          <SelectItem key={job.id} value={job.id}>
                            <div className="flex items-center justify-between w-full gap-4">
                              <span className="truncate">{job.title}</span>
                              <span className="text-xs text-muted-foreground shrink-0">
                                ${job.budget}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Mensaje <span className="text-muted-foreground">(opcional)</span>
                    </label>
                    <Textarea
                      placeholder="Escribí un mensaje para el profesional..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-destructive flex items-center gap-1.5">
                      <AlertCircle className="size-4" />
                      {error instanceof AxiosError
                        ? error.response?.data?.error || "Error al enviar la invitación"
                        : "Error al enviar la invitación"}
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Cancelar
              </Button>
              {openJobs.length > 0 && (
                <Button onClick={() => mutate()} disabled={!selectedJobId || isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      Enviar Invitación
                    </>
                  )}
                </Button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
