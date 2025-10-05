// role.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { User, UserRole } from 'src/user/entities/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user: User }>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('No user found');
    }
    // console.log(user);

    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(`Access denied.`);
    }

    return true;
  }
}
