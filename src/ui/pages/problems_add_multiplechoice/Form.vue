<template>
  <div>
    <div class="form-row">
      <p>题目名称</p>
      <input type="text" name="name" placeholder="题目名称" autofocus />
    </div>
    <div class="form-row">
      <p>题目描述</p>
      <textarea
        name="desc"
        placeholder="题目描述"
        rows="3"
        class="form-textarea"
        autofocus
      ></textarea>
    </div>
    <div class="form-row" v-for="(item, idx) in options" :key="idx">
      <p>选项{{ idx + 1 }}</p>
      <div>
        <input
          type="text"
          name="options"
          v-model.trim:value="item.desc"
          key="idx"
          placeholder="选项描述"
          autofocus
          style="width: 80%"
        />
        <div class="text-right" style="display: inline-block">
          <input
            type="checkbox"
            style="line-height: 50px; vertical-align: middle"
            :name="`answer.${idx}`"
            :checked="item.answer"
          />
          <span style="vertical-align: middle">正确</span>
        </div>
      </div>
    </div>
    <div class="form-row" style="margin: 20px auto">
      <input
        type="button"
        class="com-button"
        value="添加选项"
        @click="addOption"
      />
    </div>
    <div class="form-row text-center" style="margin: 20px auto">
      <input type="submit" class="com-button" value="添加" />
    </div>
    <a-button>asdasd</a-button>
  </div>
</template>

<script>
import antd from '@lib/antd-components';

export default {
  name: 'Form',
  data() {
    return {
      options: [
        { idx: 1, desc: '' },
        { idx: 2, desc: '' },
        { idx: 3, desc: '' },
        { idx: 4, desc: '' },
      ],
    };
  },
  methods: {
    addOption() {
      this.options.push({ idx: this.options.length, desc: '' });
    },
  },
  mounted() {
    antd.message.info('Hello!');
    antd.notification.success({ message: 'asdasd', description: 'asdasdas' });
  },
};
</script>

<style scoped></style>
