import * as fs from "fs";

export function createFolder(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(path)) {
            resolve(path);
        } else {
            fs.mkdir(path, err => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(path);
                }
            });
        }
    });
}

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