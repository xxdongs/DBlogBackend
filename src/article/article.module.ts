import { Module } from "@nestjs/common"
import { NoticeModule } from "src/notice/notice.module"
import { ArticleController } from "./article.controller"
import { ArticleService } from "./article.service"

@Module({
    imports: [NoticeModule],
    controllers: [ArticleController],
    providers: [ArticleService],
})
export class ArticleModule {}
