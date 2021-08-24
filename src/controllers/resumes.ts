import {Controller} from "../service/controller";
import {storageService} from "../service/fileStorage";
import crypto from 'crypto'
import {RequestInvalidError} from "../service/error";
import path from 'path'

export class resumesController extends Controller {
    async get() {
        this.setTitle('简历')
        this.render('resumes_main')
    }
}

export class resumesUploadController extends Controller {
    async get() {
        this.setTitle('投递简历')
        this.render('resume_upload')
    }

    async post() {
        if (!this.req.file) throw new RequestInvalidError()
        const fileMD5 = crypto.createHash('md5')
            .update(this.req.file.buffer)
            .digest('hex')
            .toString()
        const fileExt = path.extname(this.req.file.originalname)
        const objName = `${this.getSessionContext('loggedUser')._id}/${fileMD5}${fileExt}`
        await storageService.put('resumeFiles', objName, this.req.file.buffer)
        this.renderMessage('投递成功!')
    }
}