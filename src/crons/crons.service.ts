import { Injectable, Logger } from '@nestjs/common';
import { Cron, /*Interval, Timeout,*/ CronExpression } from '@nestjs/schedule';
import { UsersService } from '../users/users.service';
import { SopService } from '../sop/sop.service';
import { PrismaService } from '../prisma/prisma.service';

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

  getSOPByRoleId = async (roleId) => {
    const sops: any = await this.sopService.findAll(roleId);
    const SOPdetail = {};
    sops.forEach((element) => {
      if (element.roleId === roleId) {
        SOPdetail[element?.id] = false;
      }
    });
    return SOPdetail;
  };

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleCron() {
    try {
      this.logger.debug('job insert data SOP is starting.');
      const users: any = await this.usersService.getAllActiveUsers();

      const allSOP = [];
      const progress = await this.prisma.progressSOP.findMany({
        where: {
          createdAt: {
            // new Date() creates date with current time and day and etc.
            gte: new Date(),
          },
        },
      });

      for (let index = 0; index < users.length; index++) {
        const user = users[index];
        const detail = await this.getSOPByRoleId(user.roleId);
        if (
          Object.keys(detail).length > 0 &&
          progress.filter((x) => x.userId === user.id).length < 1
        )
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

  // @Interval(10000)
  // handleInterval() {
  //   this.logger.debug('Called every 10 seconds');
  // }

  // @Timeout(5000)
  // handleTimeout() {
  //   this.logger.debug('Called once after 5 seconds');
  // }
}
