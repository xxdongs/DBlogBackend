import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { Tag } from "./tag.entity";
import { TagService } from "./tag.service";

@Controller("tag")
export class TagController {
    constructor(private readonly tagService: TagService) {}

    @ApiOkResponse({ type: [Tag] })
    @Get()
    async tags() {
        return await this.tagService.find();
    }
}
