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
        to="/search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 文章频道列表 -->
    <!-- 标签页组件有一个功能，只有第一次查看标签页的时候才会渲染里面的内容 -->
    <van-tabs class="item-tab" v-model="active">
      <van-tab
        v-for="(item, index) in channels"
        :key="index"
        :title="item.name"
      >
        <article-list :channel="item" />
      </van-tab>
      <!-- 防止汉堡按钮把最后的内容挡住 -->
      <div slot="nav-right" class="wap-nav-placeholder"></div>
      <div
        slot="nav-right"
        @click="isChannelEditshow = true"
        class="wap-nav-wrap"
      >
        <van-icon name="wap-nav" />
      </div>
    </van-tabs>
    <!-- /文章频道列表 -->
    <van-popup
      v-model="isChannelEditshow"
      position="bottom"
      class="channel-edit-popup"
      closeable
      close-icon-position="top-left"
      get-container="body"
      style="height: 100%"
    >
      <!-- 模板中的 $event 表示事件参数 -->
      <channel-edit
        :user-channels="channels"
        :active="active"
        @close="isChannelEditshow = false"
        @update-active="active = $event"
      ></channel-edit>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from "@/api/user";

import ArticleList from "./components/article-list";
import ChannelEdit from "./components/channel-edit.vue";

import { mapState } from "vuex";

import { getItem } from "@/utils/storage";

export default {
  name: "HomeIndex",
  components: {
    ArticleList,
    ChannelEdit,
  },
  data() {
    return {
      active: 0, // 控制被激活的标签
      channels: [], // 频道列表
      isChannelEditshow: false, // 控制编辑频道的显示状态
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  created() {
    this.loadChannels();
  },
  methods: {
    async loadChannels() {
      let channels = [];
      if (this.user) {
        // 已登录，请求获取线上的用户频道列表数据
        const { data } = await getUserChannels();
        channels = data.data.channels;
      } else {
        // 没有登陆，判断是否由本地存储的列表数据
        const localchannels = getItem("user-channels");

        // 如果有本地存储的频道列表则使用
        if (localchannels) {
          channels = localchannels;
        } else {
          // 用户没有登录，也没有本地存储的频道列表，那就请求获取默认推荐的频道列表
          const { data } = await getUserChannels();
          channels = data.data.channels;
        }
      }

      // 把处理好的数据放到 data 中以供模板使用
      this.channels = channels;
      // 请求获取频道数据
      // const { data } = await getUserChannels();
      // this.channels = data.data.channels;
      // console.log(this.channels);
    },

    // onUpdateActive(index) {
    //   this.active = index
    // }
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
  // /deep/.item-tab {
  //   .van-tab {
  //     flex: 1 0 24%;
  //   }
  // }
  /deep/.item-tab {
    .van-tab {
      border-right: 1px solid #edeff3;
      border-bottom: 1px solid #edeff3;
    }
    /deep/.van-tabs__line {
      width: 25px;
      height: 3px;
      background: #3296fa;
      margin-bottom: 5px;
    }
    .wap-nav-placeholder {
      width: 33px;
      flex-shrink: 0;
    }
    .wap-nav-wrap {
      position: fixed;
      right: 0;
      width: 33px;
      height: 43px;
      display: flex;
      justify-content: center;
      align-items: center;
      .van-icon {
        box-sizing: border-box;
        padding: 3px 9px;
        font-size: 24px;
        // border-left: 1px solid rgba(0, 0, 0, 0.2);
        margin-left: -8px;
        background: #fff;
        opacity: 0.9;
      }
    }
  }
}
</style>