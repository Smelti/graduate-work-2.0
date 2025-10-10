import { User, UserDocument } from './users.schema';

export type ID = string;

export interface SearchUserParams {
  limit?: number;
  offset?: number;
  email?: string;
  name?: string;
  contactPhone?: string;
}

export interface IUserService {
  create(data: Partial<User>): Promise<UserDocument>;
  findById(id: ID): Promise<UserDocument | null>;
  findByEmail(email: string): Promise<UserDocument | null>;
  findAll(params: SearchUserParams): Promise<UserDocument[]>;
}
