import {
    Controller,
    UseGuards,
    Request,
    Get,
    Query,
    Post,
    Body,
    BadRequestException,
    Param,
    NotFoundException,
    Put,
    Delete,
} from "@nestjs/common"
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOkResponse,
} from "@nestjs/swagger"
import { Constant } from "src/util/constant"
import { JwtAuthGuard } from "src/util/jtw.authguard"
import { InsertResponse } from "src/util/ResMessage"
import {
    ArticleBindTagDto,
    ArticleCreateDto,
    ArticleUpdateDto,
} from "./article.dto"
import { Article } from "./article.entity"
import { ArticleService } from "./article.service"

@Controller("article")
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @ApiOkResponse({ type: [Article] })
    @UseGuards(new JwtAuthGuard(false))
    @Get()
    async getArticle(
        @Request() req,
        @Query("limit") limit = 10,
        @Query("offset") offset = 0,
        @Query("order") order: "ASC" | "DESC" = "DESC",
        @Query("tag") tag: string,
        @Query("key") key: string,
        @Query("order_name") orderName = "create",
    ): Promise<Article[]> {
        if (!Constant.ORDERS.includes(order)) {
            throw new BadRequestException()
        }
        let authed = req.user ? true : false
        return await this.articleService.find(
            limit,
            offset,
            order,
            orderName,
            tag,
            key,
            authed,
        )
    }

    @ApiOkResponse({ type: Article })
    @UseGuards(new JwtAuthGuard(false))
    @Get(":id")
    async getOneArticle(
        @Request() req,
        @Param("id") id: number,
    ): Promise<Article> {
        let authed = req.user ? true : false
        const art = await this.articleService.findOne(id, authed)
        if (!art) throw new NotFoundException()
        return art
    }

    @ApiBearerAuth()
    @UseGuards(new JwtAuthGuard())
    @Delete(":id")
    async delArticle(@Param("id") id: number) {
        const ok = await this.articleService.deleteOne(id)
        if (!ok) throw new NotFoundException()
    }

    @UseGuards(new JwtAuthGuard(false))
    @Post(":id")
    async counting(
        @Request() req,
        @Param("id") id: number,
        @Query("type") type: number,
    ) {
        if (req.user) return // except admin
        const ok = await this.articleService.count(id, type)
        if (!ok) throw new BadRequestException()
    }

    @ApiBearerAuth()
    @UseGuards(new JwtAuthGuard())
    @Put(":id")
    async updateArticle(
        @Param("id") id: number,
        @Body() dto: ArticleUpdateDto,
    ) {
        await this.articleService.insertOrUpdateOne(dto, id)
    }

    @ApiBearerAuth()
    @ApiCreatedResponse({ type: InsertResponse })
    @UseGuards(new JwtAuthGuard())
    @Post()
    async createArticle(
        @Body() dto: ArticleCreateDto,
    ): Promise<InsertResponse> {
        const insertId = await this.articleService.insertOrUpdateOne(dto)
        if (insertId === 0) throw new BadRequestException()
        return new InsertResponse(insertId)
    }

    @ApiBearerAuth()
    @UseGuards(new JwtAuthGuard())
    @Post(":id/bind")
    async bindTag(@Param("id") id: number, @Body() dto: ArticleBindTagDto) {
        const ok = await this.articleService.bindTag(id, dto)
        if (!ok) throw new NotFoundException()
    }
}
