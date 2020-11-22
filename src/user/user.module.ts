import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "./user.entity"
import { UserController } from "./user.controller"
import { UserService } from "./user.service"
import { UserSubscriber } from "./user.subscriber"

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    exports: [UserService],
    controllers: [UserController],
    providers: [UserService, UserSubscriber],
})
export class UserModule {}
