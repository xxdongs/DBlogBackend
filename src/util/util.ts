import * as crypto from "crypto";

export function md5(text) {
    const md5 = crypto.createHash("md5");
    return md5.update(text).digest("hex");
}
