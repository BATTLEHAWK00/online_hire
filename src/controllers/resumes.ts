import { Controller } from '../service/controller';
import { storageService } from '../service/fileStorage';
import Router from '../service/router';
import { loginChecker } from '../service/interceptors/LoginChecker';
import { RoleChecker } from '../service/interceptors/RoleChecker';
import resumesModel from '../models/resume';

export class resumesController extends Controller {
  async get() {
    this.setTitle('简历');
    const rdocs = await resumesModel.getResumeList();
    this.setUIContext('resdoc', rdocs);
    this.render('resumes_main');
  }
}

export class resumeFileController extends Controller {
  async get() {
    const path = `${this.params.user}/${this.params.filename}`;
    const file = await storageService.get('resumeFiles', path);
    file.pipe(this.resp);
  }
}

Router.RegisterRoute('resumes_main', '/resumes', resumesController, [
  loginChecker,
  RoleChecker('admin', 'manager'),
]);
Router.RegisterRoute(
  'resumes_file',
  '/resumes/file/:user/:filename',
  resumeFileController,
  [loginChecker, RoleChecker('admin', 'manager')]
);
