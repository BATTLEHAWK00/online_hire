<template>
  <div>
    <div class="form-row">
      <p>试卷名称</p>
      <input type="text" name="name" placeholder="试卷名称" autofocus />
    </div>
    <div class="form-row" v-for="(item, index) in problems" :key="index">
      <h2>{{ index + 1 }}. {{ item.name }}</h2>
      <input type="hidden" name="content" :value="item._id" />
      <p>题目类型:{{ problemType(item.type) }}</p>
      <p>题目描述:{{ item.desc }}</p>
      <input
        type="button"
        class="com-button"
        value="移除"
        @click="
          () => {
            problems.splice(i, 1);
            pList.push(item);
          }
        "
      />
      <hr style="border-width: 0; border-bottom-width: 2px" />
    </div>
    <div class="form-row text-center" v-show="pList.length">
      <select
        id="addProblemSelect"
        v-model="selectedProblem"
        style="margin-right: 20px"
      >
        <option v-for="(item, index) in pList" :key="index" :value="item._id">
          {{ item.name }}
        </option>
      </select>
      <button class="com-button" @click="addProblem">添加题目</button>
    </div>
    <div class="form-row text-center" style="margin: 20px auto">
      <input type="submit" class="com-button" value="提交" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'addForm',
  data() {
    return {
      problems: [],
      selectedProblem: null,
      pList: window.UIContext.pList,
    };
  },
  methods: {
    addProblem(evt) {
      evt.preventDefault();
      this.problems.push(
        this.pList.find(obj => obj._id === this.selectedProblem, this)
      );
      // eslint-disable-next-line no-restricted-syntax
      for (const i in this.pList) {
        if (this.pList[i]._id === this.selectedProblem) {
          this.pList.splice(i, 1);
          break;
        }
      }
      this.selectedProblem = null;
      // this.pList.remove()
    },
    problemType(val) {
      switch (val) {
        case 'SingleChoice':
          return '单选题';
        case 'MultipleChoice':
          return '多选题';
        case 'ShortAnswer':
          return '简答题';
        default:
          return 'null';
      }
    },
  },
};
</script>

<style scoped></style>