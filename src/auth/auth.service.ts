import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt/dist/jwt.service"
import { User } from "src/user/user.entity"
import { UserService } from "src/user/user.service"
import { md5 } from "src/util/util"

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(username: string, pass: string): Promise<User> {
        const user = await this.userService.findOne({ username })
        if (user && user.password === md5(pass)) {
            return user
        }
        return null
    }

    async login(user: User) {
        const payload = { id: user.id }
        return {
            access_token: `Bearer ${this.jwtService.sign(payload)}`,
        }
    }
}
