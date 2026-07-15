import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../../common/utils/decorators';
import { UserRole } from '../../common/constants';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /api/v1/users — admin only
   * TODO: return paginated user list
   */
  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    // TODO: return paginated list
    return [];
  }
}
