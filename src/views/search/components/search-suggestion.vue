<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(str, index) in suggestions"
      :key="index"
      @click="$emit('search', str)"
    >
      <div slot="title" v-html="highlight(str)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from "@/api/search";
import { debounce } from "lodash";

export default {
  name: "SearchSuggestion",
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      suggestions: [], //联想建议数据列表
      htmlStr: 'Hello <span style="color:red">World</span>',
    };
  },
  // watch 的详细使用APi：https://cn.vuejs.org/v2/api/#watch
  watch: {
    // 属性名：要监视的数据的名称
    // searchText() {
    //   console.log('hello');
    // }

    // 这才是监视的完整写法
    searchText: {
      // 当数据发生变化则会执行 handler 处理函数
      handler: debounce(async function () {
        // 找到数据接口
        // 请求获取数据
        // 模板绑定展示
        const { data } = await getSearchSuggestions(this.searchText);
        this.suggestions = data.data.options;
      }, 200),
      // async handler() {
      //   // 找到数据接口
      //   // 请求获取数据
      //   // 模板绑定展示
      //   const { data } = await getSearchSuggestions(this.searchText);
      //   this.suggestions = data.data.options;
      // },
      immediate: true,
    },
  },
  methods: {
    highlight(str) {
      // 错误写法： /this.searchText/gi
      // RegExp 是正则表达式的构造函数
      // 参数1：字符串
      // 参数2：匹配模式
      // 返回值：正则对象
      return str.replace(
        new RegExp(this.searchText, "gi"),
        `<span style="color: red">${this.searchText}</span>`
      );
      return 123;
    },
  },
};
</script>

<style>
</style>