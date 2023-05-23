import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Role } from '../enum/role'
import { RoleGuard } from '../guards/role.guard'

export function Auth(...role: Role[]) {
  return applyDecorators(SetMetadata('roles', role), UseGuards(AuthGuard('jwt'), RoleGuard))
}
