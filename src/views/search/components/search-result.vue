<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="(article, index) in list" :key="index" :title="article.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResults } from '@/api/search'

export default {
  name: "SearchResult",
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1, // 页码
      perPage: 10 // 每页大小
    };
  },
  methods: {
    async onLoad() {
      // 1.请求获取数据
      const { data } = await getSearchResults({
        page: this.page,// 页码
        per_page: this.perPage,// 每页大小
        q: this.searchText // 搜索的字符
      })

      console.log(data);
      // 2.将数据放到数据列表中
      const { results } = data.data
      this.list.push(...results)

      // 3.关闭本次的 loading
      this.loading = false

      if (results.length) {
        // 4.判断是否有数据，如果有，则更新获取下一页数据的页码
        this.page++
      } else {
        // 如果没有，则把 finished 设置为 true 关闭加载更多
        this.finished = true
      }
    },
  },
};
</script>

<style>
</style>