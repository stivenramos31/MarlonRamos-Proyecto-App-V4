interface Role{
    id: number
    name:string
    image:string
    route:string
}

export interface UserResponse {
  lastname: string;
  firstname: string;
  email: string;
  id: number;
  image: string;
  lastName: string;
  name: string;
  notification_token: string | null;
  phone: string;
  roles: Role[];
}

export interface AuthResponse {
  userResponse(token: string, userResponse: any): unknown;
  token: string;
  user: UserResponse;
}