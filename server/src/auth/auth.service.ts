import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { UserRole, UserDocument } from '../users/users.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.passwordHash);
    return ok ? user : null;
  }

  async register(dto: RegisterDto): Promise<UserDocument> {
    const exist = await this.usersService.findByEmail(dto.email);
    if (exist) throw new BadRequestException('Email already taken');

    const hash = await bcrypt.hash(dto.password, 10);
    return this.usersService.create({
      email: dto.email,
      passwordHash: hash,
      name: dto.name,
      contactPhone: dto.contactPhone,
      role: UserRole.CLIENT,
    });
  }

  async loginWithCredentials(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        contactPhone: user.contactPhone,
        role: user.role,
      },
    };
  }
}
