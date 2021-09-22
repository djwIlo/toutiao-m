<template>
  <div class="article-list" ref="article-list">
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      :success-text="isPullRefresh"
      success-duration="800"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- <van-cell
          v-for="(item, index) in articles"
          :key="index"
          :title="item.title"
        /> -->
        <article-item
          v-for="(item, index) in articles"
          :key="index"
          :item="item"
        ></article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from "@/api/article";
import ArticleItem from "@/components/index";
import { debounce } from "lodash";

export default {
  name: "ArticleList",
  components: {
    ArticleItem,
  },
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
      refreshing: false, //下拉刷新的 loading 状态
      isPullRefresh: "",
      scrollTop: 0, // 文章位置
    };
  },
  mounted() {
    const articleList = this.$refs["article-list"];
    articleList.onscroll = debounce(() => {
      this.scrollTop = articleList.scrollTop;
      // console.log(this.scrollTop);
    }, 50);
  },
  activated() {
    // 把记录的位置设置回来
    this.$refs["article-list"].scrollTop = this.scrollTop;
  },
  // deactivated() {
  //   this.scrollTop = this.$refs["article-list"].scrollTop;
  // },
  methods: {
    async onLoad() {
      // 1. 请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id, //频道 id
        timestamp: this.timestamp || Date.now(),
        with_top: 1,
      });

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
    async onRefresh() {
      // 下拉刷新，组件自己就会展示 loading 状态
      // 1.请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id, //频道 id
        timestamp: this.timestamp || Date.now(),
        with_top: 1,
      });

      // 2.把数据放到数据列表中（往顶部追加）
      const results = data.data.results;
      this.articles.unshift(...results);

      // 3.关闭刷新的状态 loading
      this.refreshing = false;

      // 加载成功
      this.isPullRefresh = `更新了${results.length}条数据`;
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