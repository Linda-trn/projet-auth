import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('profile/:id')
  async getProfile(@Param('id') id: string) {
    const user = await this.usersService.findById(parseInt(id));
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    const { password, ...result } = user;
    return result;
  }
}