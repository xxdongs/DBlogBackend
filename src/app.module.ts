import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Connection } from "typeorm";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { ArticleModule } from "./article/article.module";
import { TagModule } from "./tag/tag.module";
import { CommentModule } from "./comment/comment.module";
import { MessageModule } from "./message/message.module";
import { ConfigModule } from "@nestjs/config";
import { NoticeModule } from "./notice/notice.module";

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        UserModule,
        AuthModule,
        ArticleModule,
        TagModule,
        CommentModule,
        MessageModule,
        ConfigModule.forRoot(),
        NoticeModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    constructor(private readonly connection: Connection) {}
}
