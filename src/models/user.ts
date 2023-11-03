export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
  emailVerified: boolean;
  phoneNumber?: string | null;
  role: Role;
  providerData?: any[];
  status?: string;
  createdAt?: any;
  billing?: any;
  acceptsMarketing?: boolean;
  shopifyID: string;
}

export enum Role {
  Admin = "Admin",
  Editor = "Editor",
  Contributor = "Contributor",
  Subscriber = "Subscriber", //Client
}
