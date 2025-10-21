import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SupportRequest, SupportRequestSchema } from './support-request.schema';
import { SupportRequestService } from './service/support-request.service';
import { SupportRequestClientService } from './service/support-request-client.service';
import { SupportRequestEmployeeService } from './service/support-request-employee.service';
import { ClientSupportRequestsController } from './controller/client-support-requests.controller';
import { ManagerSupportRequestsController } from './controller/manager-support-requests.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
    ]),
  ],
  controllers: [
    ClientSupportRequestsController,
    ManagerSupportRequestsController,
  ],
  providers: [
    SupportRequestService,
    SupportRequestClientService,
    SupportRequestEmployeeService,
  ],
  exports: [
    SupportRequestService,
    SupportRequestClientService,
    SupportRequestEmployeeService,
  ],
})
export class SupportRequestModule {}
