import { ApiProperty } from "@nestjs/swagger"
import { IsDefined } from "class-validator"

export class MessageCreateDto {
    @ApiProperty()
    contact: string

    @ApiProperty()
    @IsDefined()
    content: string
}
