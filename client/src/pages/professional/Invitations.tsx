import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyInvitationsService,
  respondToInvitationService,
} from "@/services/invitations";
import { formatDate } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  AlertCircle,
  Check,
  X,
  MailQuestion,
  Building2,
} from "lucide-react";
import type { InvitationStatus } from "@/types/invitation";

const statusConfig: Record<
  InvitationStatus,
  { label: string; variant: "secondary" | "outline" | "default" | "ghost" }
> = {
  PENDING: { label: "Pendiente", variant: "secondary" },
  ACCEPTED: { label: "Aceptada", variant: "default" },
  DECLINED: { label: "Rechazada", variant: "outline" },
};

export function ProfessionalInvitations() {
  const queryClient = useQueryClient();

  const {
    data: invitations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["invitations"],
    queryFn: getMyInvitationsService,
  });

  const respondMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "ACCEPTED" | "DECLINED";
    }) => respondToInvitationService(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
        <Loader2 className="size-8 animate-spin mb-3 text-primary" />
        <p>Cargando invitaciones...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-lg mx-auto mt-20">
        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-xl p-6 text-center">
          <AlertCircle className="size-10 mx-auto mb-3 opacity-70" />
          <p className="font-medium text-lg">Error al cargar invitaciones</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Invitaciones</h1>
        <p className="text-muted-foreground mt-1">
          Aquí puedes gestionar las invitaciones que recibes para trabajar en
          los proyectos.
        </p>
      </div>

      {!invitations || invitations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <MailQuestion className="size-12 mb-4 opacity-40" />
          <p className="text-lg font-medium">No tenés invitaciones</p>
          <p className="text-sm mt-1">
            Cuando un cliente te invite a un proyecto, aparecerá acá.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {invitations.map((invitation) => {
            const config = statusConfig[invitation.status];
            const isPending = invitation.status === "PENDING";
            const isLoadingResponse =
              respondMutation.isPending &&
              respondMutation.variables?.id === invitation.id;

            return (
              <div
                key={invitation.id}
                className="bg-card border border-border rounded-xl p-6 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground truncate">
                        {invitation.job.title}
                      </h3>
                      <Badge variant={config.variant}>{config.label}</Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                      {invitation.client && (
                        <span className="flex items-center gap-1.5">
                          <Building2 className="size-4" />
                          {invitation.client.clientProfile?.companyName ||
                            invitation.client.name ||
                            "Cliente"}
                        </span>
                      )}
                      <span>${invitation.job.budget}</span>
                      <span>{formatDate(invitation.createdAt)}</span>
                    </div>

                    {invitation.message && (
                      <p className="text-sm text-foreground/80 bg-muted/50 rounded-lg p-3 mt-2">
                        "{invitation.message}"
                      </p>
                    )}
                  </div>

                  {isPending && (
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() =>
                          respondMutation.mutate({
                            id: invitation.id,
                            status: "ACCEPTED",
                          })
                        }
                        disabled={isLoadingResponse}
                      >
                        {isLoadingResponse &&
                        respondMutation.variables?.status === "ACCEPTED" ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Check className="size-4" />
                        )}
                        Aceptar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          respondMutation.mutate({
                            id: invitation.id,
                            status: "DECLINED",
                          })
                        }
                        disabled={isLoadingResponse}
                      >
                        {isLoadingResponse &&
                        respondMutation.variables?.status === "DECLINED" ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <X className="size-4" />
                        )}
                        Rechazar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
