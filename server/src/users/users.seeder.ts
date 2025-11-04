import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole } from './users.schema';

@Injectable()
export class UsersSeeder implements OnModuleInit {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    const adminExists = await this.userModel.findOne({ role: UserRole.ADMIN });
    if (!adminExists) {
      const adminPassword = await bcrypt.hash('admin123', 10);
      await this.userModel.create({
        email: 'admin@hotel.com',
        passwordHash: adminPassword,
        name: 'Администратор',
        role: UserRole.ADMIN,
      });
      console.log('Default admin user created: admin@hotel.com / admin123');
    }

    const managerExists = await this.userModel.findOne({
      role: UserRole.MANAGER,
    });
    if (!managerExists) {
      const managerPassword = await bcrypt.hash('manager123', 10);
      await this.userModel.create({
        email: 'manager@hotel.com',
        passwordHash: managerPassword,
        name: 'Менеджер',
        role: UserRole.MANAGER,
      });
      console.log(
        'Default manager user created: manager@hotel.com / manager123',
      );
    }
  }
}
