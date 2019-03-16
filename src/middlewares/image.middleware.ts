import {injectable} from 'inversify';
import {BaseMiddleware} from 'inversify-express-utils';
import {NextFunction, Request, Response} from 'express';

export const accepted_extensions = ['jpg', 'png'];


@injectable()
export class ImageMiddleware extends BaseMiddleware {

    handler(req: Request, res: Response, next: NextFunction): void {

        // if the file is not present
        if (!req.file || !req.files)
            return next(new Error('No file/files found in request body'));


        // For MemoryStorage, validate the format using `req.file.buffer`
        // For DiskStorage, validate the format using `fs.readFile(req.file.path)` from Node.js File System Module
        // let mime = fileType(req.file.buffer);

        // if can't be determined or format not accepted
        // @ts-ignore
        // if (!mime || !accepted_extensions.includes(mime.ext))
        //     return next(new Error('The uploaded file is not in ' + accepted_extensions.join(", ") + ' format!'));

        next();
    }
}