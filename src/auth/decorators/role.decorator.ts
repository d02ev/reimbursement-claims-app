import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/user/enum';

export const UseRole = (roles: Role[]) => SetMetadata('roles', roles);
