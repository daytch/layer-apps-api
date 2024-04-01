import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { UsersService } from 'src/users/users.service';
import { SopService } from 'src/sop/sop.service';
import { PrismaService } from 'src/prisma/prisma.service';

export type TProgressSOP = {
  userId: number;
  detail: JSON;
};

@Injectable()
export class CronsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly sopService: SopService,
  ) {}
  private readonly logger = new Logger(CronsService.name);

  set = (obj: any, prop: any, val: boolean) =>
    Object.defineProperty(obj, prop, {
      value: val,
      writable: true,
      enumerable: true,
      configurable: true,
    });

  getSOPByRoleId = async (roleId) => {
    const sops: any = await this.sopService.findAll();
    const SOPdetail = {};
    sops.forEach((element) => {
      if (element.roleId === roleId) {
        SOPdetail[element?.id] = false;
      }
    });
    return SOPdetail;
  };

  @Cron('35 * * * * *')
  async handleCron() {
    try {
      this.logger.debug('Called when the second is 45');
      const users: any = await this.usersService.getAllActiveUsers();

      const allSOP = [];
      for (let index = 0; index < users.length; index++) {
        const user = users[index];
        const detail = await this.getSOPByRoleId(user.roleId);
        if (Object.keys(detail).length > 0)
          allSOP.push({
            userId: user?.id,
            detail,
          });
      }
      const createMany = await this.prisma.progressSOP.createMany({
        data: allSOP,
        skipDuplicates: true,
      });
      return createMany;
    } catch (error) {
      console.log(error);
    }
  }

  @Interval(10000)
  handleInterval() {
    this.logger.debug('Called every 10 seconds');
  }

  @Timeout(5000)
  handleTimeout() {
    this.logger.debug('Called once after 5 seconds');
  }
}
