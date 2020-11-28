import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
    constructor(private auth: boolean = true) {
        super();
        this.auth = auth;
    }
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    handleRequest(err, user) {
        if (err || !user) {
            if (this.auth) throw new UnauthorizedException();
            return null;
        }
        return user;
    }
}
