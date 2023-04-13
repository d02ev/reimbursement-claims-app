import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/user/enum';

export const UseRole = (role: Role) => SetMetadata('role', role);
