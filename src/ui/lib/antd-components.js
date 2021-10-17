import { Button, message, Modal, notification } from 'ant-design-vue';
import 'ant-design-vue/lib/message/style/index.less';
import 'ant-design-vue/lib/button/style/index.less';
import 'ant-design-vue/lib/notification/style/index.less';
import 'ant-design-vue/lib/modal/style/index.less';

const components = [Button];

function use(app) {
  components.forEach(com => app.use(com));
}

export default {
  use,
  message,
  notification,
  Modal,
};
