export const getWorkModelText = (model?: string) => {
  switch (model) {
    case "REMOTE":
      return "Remoto";
    case "HYBRID":
      return "Híbrido";
    case "ONSITE":
      return "Presencial";
    default:
      return "";
  }
};

export const getJobTypeText = (type?: string) => {
  switch (type) {
    case "FULL_TIME":
      return "Tiempo Completo";
    case "PART_TIME":
      return "Medio Tiempo";
    case "FREELANCE":
      return "Proyectos / Gigs";
    case "CONTRACT":
      return "Contrato Fijo";
    default:
      return "";
  }
};

export const getExperienceLevelText = (level?: string) => {
  switch (level) {
    case "JUNIOR":
      return "Junior";
    case "MID_LEVEL":
      return "Semi-Senior";
    case "SENIOR":
      return "Senior";
    case "EXPERT":
      return "Experto";
    default:
      return "";
  }
};
