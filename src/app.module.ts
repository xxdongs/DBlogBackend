import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Connection } from "typeorm"
import { UserModule } from "./user/user.module"
import { AuthModule } from "./auth/auth.module"
import { ArticleModule } from "./article/article.module"
import { TagModule } from "./tag/tag.module"
import { CommentModule } from "./comment/comment.module"
import { MessageModule } from "./message/message.module"
import { ConfigModule } from "@nestjs/config"

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: () => ({
                type: "mysql",
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                entities: [process.env.DB_ENTITIES],
                synchronize: process.env.DB_SYNC === "true" ? true : false,
            }),
        }),
        UserModule,
        AuthModule,
        ArticleModule,
        TagModule,
        CommentModule,
        MessageModule,
        ConfigModule.forRoot(),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    constructor(private readonly connection: Connection) {}
}
