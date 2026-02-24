export interface JobClient {
  id: string;
  name: string;
  title: string;
}

export interface JobApplicationCount {
  applications: number;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  clientId: string;
  createdAt: string;
  client: JobClient;
  _count: JobApplicationCount;
}
