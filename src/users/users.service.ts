import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export type User = any;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(username: string, pass: string): Promise<User | undefined> {
    const user = await this.prisma.users.findUnique({
      where: { nik: username },
    });

    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(pass, user?.password);
    if (!isMatch) {
      return null;
    }
    return user;
  }
}
