import {
    BadRequestException,
    Request,
    Body,
    Controller,
    Post,
    UseGuards,
    Get,
    Param,
    NotFoundException,
    Put,
    Delete,
    UseInterceptors,
    ClassSerializerInterceptor,
} from "@nestjs/common"
import { ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger"
import { JwtAuthGuard } from "src/util/jtw.authguard"
import { ResMessage } from "src/util/ResMessage"
import { UserGroup } from "src/util/user.group"
import { UserCreateDto, UserUpdateDto } from "./user.dto"
import { User } from "./user.entity"
import { UserService } from "./user.service"

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async register(@Body() dto: UserCreateDto) {
        const ok = await this.userService.insertOne(dto)
        if (!ok) throw new BadRequestException(ResMessage.ENTITY_EXIST)
    }

    @ApiBearerAuth()
    @ApiOkResponse({
        type: [User],
    })
    @UseGuards(new JwtAuthGuard())
    @Get("list")
    async get(): Promise<User[]> {
        const [users] = await this.userService.find()
        return users
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @ApiOkResponse({
        type: User,
    })
    @UseGuards(new JwtAuthGuard(false))
    @Get(":id")
    async profile(@Request() req, @Param("id") id: number): Promise<User> {
        const user = await this.userService.findOne({ id })
        if (!user) throw new NotFoundException()
        return user
    }

    @ApiBearerAuth()
    @UseGuards(new JwtAuthGuard())
    @Put()
    async update(@Request() req, @Body() dto: UserUpdateDto) {
        const id = (req.user as User).id
        const ok = await this.userService.updateOne(id, dto)
        if (!ok) throw new BadRequestException()
    }

    @ApiBearerAuth()
    @UseGuards(new JwtAuthGuard())
    @Delete()
    async delete(@Request() req, @Body("target") target: number) {
        const id = (req.user as User).id
        const myself = await this.userService.findOne({ id })
        let deleteId: number = id
        if (target) {
            if (myself.group !== UserGroup.ADMIN)
                throw new BadRequestException()
            deleteId = target
        }
        const ok = await this.userService.deleteOne(deleteId)
        if (!ok) throw new BadRequestException()
    }
}
