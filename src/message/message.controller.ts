import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Query,
    UseGuards,
} from "@nestjs/common"
import { ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger"
import { Constant, OrderType } from "src/util/constant"
import { JwtAuthGuard } from "src/util/jtw.authguard"
import { MessageCreateDto } from "./message.dto"
import { Message } from "./message.entity"
import { MessageService } from "./message.service"

@Controller("message")
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Post()
    async createArticle(@Body() dto: MessageCreateDto) {
        await this.messageService.insertOne(dto)
    }

    @ApiBearerAuth()
    @ApiOkResponse({ type: [Message] })
    @UseGuards(new JwtAuthGuard())
    @Get()
    async getArticle(
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
