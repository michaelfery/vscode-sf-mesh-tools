import * as fs from "fs";

export function write(path: string, data: any): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, err => {
            if (err) {
                reject(err);
            }
            else {
                resolve(path);
            }
        });
    });
}