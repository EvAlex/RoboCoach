
export function padNumber(n: any, width: any, z?: any): string {
    "use strict";
    z = z || "0";
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
