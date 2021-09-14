<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="app-nav-bar">
      <van-button
        slot="title"
        class="search-btn"
        icon="search"
        type="info"
        round
        size="small"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 文章频道列表 -->
    <!-- 标签页组件有一个功能，只有第一次查看标签页的时候才会渲染里面的内容 -->
    <van-tabs v-model="active">
      <van-tab
        v-for="(item, index) in channels"
        :key="index"
        :title="item.name"
      >
        <article-list :channel="item" />
      </van-tab>
    </van-tabs>
    <!-- /文章频道列表 -->
  </div>
</template>

<script>
import { getUserChannels } from "@/api/user";

import ArticleList from "./components/article-list";

export default {
  name: "HomeIndex",
  components: {
    ArticleList,
  },
  data() {
    return {
      active: 0, // 控制被激活的标签
      channels: [], // 频道列表
    };
  },
  created() {
    this.loadChannels();
  },
  methods: {
    async loadChannels() {
      // 请求获取频道数据
      const { data } = await getUserChannels();
      this.channels = data.data.channels;
    },
  },
};
</script>

<style scoped lang="less">
.home-container {
  /deep/.van-nav-bar__title {
    max-width: none;
    .search-btn {
      width: 277px;
      height: 32px;
      background: #5babfb;
      border: none;
      .van-icon {
        font-size: 16px;
      }
      .van-button__text {
        font-size: 14px;
      }
    }
  }
}
</style>