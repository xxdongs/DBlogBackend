import {
    BadRequestException,
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    Query,
    UseGuards,
} from "@nestjs/common"
import { ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger"
import { NoticeService } from "src/notice/notice.service"
import { Constant, OrderType } from "src/util/constant"
import { JwtAuthGuard } from "src/util/jtw.authguard"
import { MessageCreateDto } from "./message.dto"
import { Message } from "./message.entity"
import { MessageService } from "./message.service"

@Controller("message")
export class MessageController {
    constructor(
        private readonly messageService: MessageService,
        private readonly noticeService: NoticeService,
    ) {}

    @Post()
    async createMessage(@Body() dto: MessageCreateDto) {
        let id = await this.messageService.insertOne(dto)
        await this.noticeService.insertOne("MESSAGE", `/message/${id}`)
    }

    @UseGuards(new JwtAuthGuard())
    @Get(":id")
    async getMessage(@Param("id") id: number): Promise<Message> {
        const msg = await this.messageService.findOne(id)
        if (!msg) throw new NotFoundException()
        return msg
    }

    @ApiBearerAuth()
    @ApiOkResponse({ type: [Message] })
    @UseGuards(new JwtAuthGuard())
    @Get()
    async getMessages(
        @Query("limit") limit = 10,
        @Query("offset") offset = 0,
        @Query("order") order: OrderType = "DESC",
        @Query("order_name") orderName = "create",
    ): Promise<Message[]> {
        if (!Constant.ORDERS.includes(order)) {
            throw new BadRequestException()
        }
        return await this.messageService.find(limit, offset, order, orderName)
    }
}
