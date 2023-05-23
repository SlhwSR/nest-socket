import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { user } from '@prisma/client'
import { Observable } from 'rxjs'
import { Role } from '../enum/role'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    //获取user表role字段
    const user = context.switchToHttp().getRequest().user as user

    const roles = this.reflector.getAllAndMerge<Role[]>('roles', [context.getHandler(), context.getClass()])
    return roles.length ? roles.some((role) => user.role == role) : true
  }
}
