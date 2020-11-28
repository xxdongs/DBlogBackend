import { IsEmail, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UserCreateDto {
    @ApiProperty()
    @IsEmail()
    readonly email: string;

    @ApiProperty()
    @MinLength(4)
    readonly password: string;
}

export class UserUpdateDto {
    @ApiProperty()
    readonly username?: string;
    @ApiProperty()
    readonly email?: string;
    @ApiProperty()
    readonly avatar?: string;
    @ApiProperty()
    readonly gender?: boolean;
    @ApiProperty()
    readonly city?: string;
    @ApiProperty()
    readonly summary?: string;
    @ApiProperty()
    readonly password?: string;
}
