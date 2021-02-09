import { Module } from "@nestjs/common"
import { NoticeModule } from "src/notice/notice.module"
import { MessageController } from "./message.controller"
import { MessageService } from "./message.service"

@Module({
    imports: [NoticeModule],
    controllers: [MessageController],
    providers: [MessageService],
})
export class MessageModule {}
