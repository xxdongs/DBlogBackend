import {
    BadRequestException,
    Controller,
    Get,
    Param,
    Post,
    Query,
    UseGuards,
} from "@nestjs/common"
import { ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger"
import { Constant, OrderType } from "src/util/constant"
import { JwtAuthGuard } from "src/util/jtw.authguard"
import { Notice } from "./notice.entity"
import { NoticeService } from "./notice.service"

@Controller("notice")
export class NoticeController {
    constructor(private readonly noticeService: NoticeService) {}

    @ApiBearerAuth()
    @ApiOkResponse({ type: [Notice] })
    @UseGuards(new JwtAuthGuard())
    @Get()
    async getNotices(
        @Query("limit") limit = 10,
        @Query("offset") offset = 0,
        @Query("order") order: OrderType = "DESC",
        @Query("order_name") orderName = "create",
    ): Promise<Notice[]> {
        if (!Constant.ORDERS.includes(order)) {
            throw new BadRequestException()
        }
        return await this.noticeService.find(limit, offset, order, orderName)
    }

    @ApiBearerAuth()
    @UseGuards(new JwtAuthGuard())
    @Post("mark/:id")
    async markRead(@Param("id") id: number) {
        await this.noticeService.markRead(id)
    }

    @ApiBearerAuth()
    @UseGuards(new JwtAuthGuard())
    @Post("mark")
    async markReadAll(@Param("id") id: number) {
        await this.noticeService.markReadAll()
    }
}
