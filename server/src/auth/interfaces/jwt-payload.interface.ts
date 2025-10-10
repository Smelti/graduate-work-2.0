import { UserRole } from '../../users/users.schema';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}
