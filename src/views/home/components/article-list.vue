<template>
  <div class="article-list">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(item, index) in articles"
        :key="index"
        :title="item.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getArticles } from "@/api/article";

export default {
  name: "ArticleList",
  props: {
    channel: {
      type: Object,
      required: true,
      default: {},
    },
  },
  data() {
    return {
      articles: [], // 数据列表
      loading: false, // 控制加载中的 loading 状态
      finished: false, // 控制加载结束的状态，当加载结束，不在触发加载更多
      timestamp: null, // 获取下一页数据的时间戳
    };
  },
  methods: {
    async onLoad() {
      // 1. 请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id, //频道 id
        timestamp: this.timestamp || Date.now(),
        with_top: 1,
      });
      console.log(data);

      // 2.把数据放到 list 数组中
      const { results } = data.data;
      this.articles.push(...results);

      // 3.设置本次加载状态结束，它才可以判断是否需要加载下一次，否则就会永远停在这
      this.loading = false;

      // 4.数据全部加载完成
      if (results.length) {
        this.timestamp = data.data.pre_timestamp; // 更新获取下一页数据页码
      } else {
        this.finished = true; // 没有数据了
      }
    },
  },
};
</script>

<style scoped lang="less">
.article-list {
  position: fixed;
  left: 0;
  right: 0;
  top: 90px;
  bottom: 50px;
  overflow-y: auto;
}
</style>