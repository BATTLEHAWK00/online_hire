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
        autofocus
      ></textarea>
    </div>
    <div class="form-row" v-for="(item, idx) in options" :key="idx">
      <p>选项{{ idx + 1 }}</p>
      <input
        type="text"
        name="options"
        v-model.trim:value="item.desc"
        key="idx"
        placeholder="选项描述"
        autofocus
      />
    </div>
    <div class="form-row" style="margin: 20px auto">
      <input
        type="button"
        class="com-button"
        value="添加选项"
        @click="addOption"
      />
      <span style="margin-left: 10px">正确答案: </span>
      <select name="answer" style="margin-left: 10px">
        <option :value="idx" v-for="(item, idx) in options" :key="idx">
          选项{{ idx + 1 }}
        </option>
      </select>
    </div>
    <div class="form-row text-center" style="margin: 20px auto">
      <input type="submit" class="com-button" value="添加" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Form',
  data() {
    return {
      options: [
        { idx: 1, desc: '' },
        { idx: 2, desc: '' },
        { idx: 3, desc: '' },
      ],
      answer: null,
    };
  },
  methods: {
    addOption() {
      this.options.push({ idx: this.options.length, desc: '' });
    },
  },
};
</script>

<style scoped></style>
