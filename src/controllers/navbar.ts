import { ControllerInterceptor } from '../service/router';
import { Controller } from '../service/controller';
import { addGlobal } from '../service/nunjucks';
import { RoleChecker } from '../service/interceptors/RoleChecker';
import { RoleType } from '../models/user';

const navbarItems: any[] = [];

function registerNavBar(
  name: string,
  routePath: string,
  ...checkers: ControllerInterceptor[]
) {
  navbarItems.push({
    name,
    routePath,
    checkers,
  });
}

function getNavItems(handler: Controller) {
  return navbarItems.filter(({ checkers }) => {
    try {
      checkers.forEach((checker: any) => checker(handler.getRequest()));
      return true;
    } catch (e) {
      return false;
    }
  });
}

addGlobal({ getNavItems });

addGlobal({
  hasRole(handler: Controller, role: RoleType) {
    return handler.getRequest().session.context.loggedUser.role === role;
  },
});

registerNavBar('职位管理', '/positions', RoleChecker('admin', 'manager'));
registerNavBar('题库管理', '/problems', RoleChecker('admin', 'manager'));
registerNavBar('问卷管理', '/questionnaire', RoleChecker('admin', 'manager'));
registerNavBar('简历管理', '/resumes', RoleChecker('admin', 'manager'));
registerNavBar('我的投递', '/mycvs', RoleChecker('applicant', 'manager'));
registerNavBar('系统管理', '/manage', RoleChecker('admin'));
