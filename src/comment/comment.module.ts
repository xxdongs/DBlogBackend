import { Module } from "@nestjs/common"
import { NoticeModule } from "src/notice/notice.module"
import { CommentController } from "./comment.controller"
import { CommentService } from "./comment.service"

@Module({
    imports: [NoticeModule],
    controllers: [CommentController],
    providers: [CommentService],
})
export class CommentModule {}
