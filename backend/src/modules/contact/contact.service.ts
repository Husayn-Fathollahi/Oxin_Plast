import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/utils/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMessageDto) {
    const message = await this.prisma.contactMessage.create({ data: dto });
    // TODO: trigger email notification via MailService
    this.logger.log(`New contact message from ${dto.email}`);
    return message;
  }

  findAll() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string) {
    const message = await this.prisma.contactMessage.findUnique({ where: { id } });
    if (!message) throw new NotFoundException(`Message "${id}" not found`);
    return this.prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
  }
}
