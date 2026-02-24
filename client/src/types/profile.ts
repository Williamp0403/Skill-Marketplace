export interface Profile {
  id: string;
  name: string;
  bio: string | null;
  title: string | null;
  avatarUrl: string | null;
  createdAt: Date;
}
