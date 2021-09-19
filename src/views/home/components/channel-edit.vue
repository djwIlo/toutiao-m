<template>
  <div class="channel-edit">
    <van-cell center :border="false">
      <div slot="title" class="channel-title">我的频道</div>
      <van-button
        type="danger"
        plain
        round
        size="mini"
        style="width: 40px; height: 20px"
        @click="isEdit = !isEdit"
        >{{ isEdit ? "完成" : "编辑" }}</van-button
      >
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item"
        :class="{ active: index === active }"
        :icon="isEdit && index !== 0 ? 'clear' : ''"
        v-for="(channel, index) in userChannels"
        :key="index"
        :text="channel.name"
        @click="onUserChannelClick(channel, index)"
      />
    </van-grid>
    <van-cell center :border="false">
      <div slot="title" class="channel-title">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        @click="onAdd(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel,
} from "@/api/channel";
import { mapState } from "vuex";
import { setItem } from "@/utils/storage";

export default {
  name: "ChannelEdit",
  props: {
    userChannels: {
      type: Array,
      required: true,
    },
    active: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      allChannels: [], // 所有频道数据
      isEdit: false, // 控制编辑的显示状态
    };
  },
  computed: {
    ...mapState(["user"]),
    // 推荐的频道列表
    // 计算属性会观测内部依赖数据的变化而变化而重新求值
    recommendChannels() {
      // 思路：所有频道 - 我的频道 = 剩下的推荐频道
      // filter 方法：过滤数据，根据方法返回的布尔值 true 来收集数据
      // filter 方法查早满足条件的所有元素
      return this.allChannels.filter((channel) => {
        // 判断 channel 是否属于用户频道
        // find 方法查找满足条件的单个元素
        return !this.userChannels.find((userChannel) => {
          // 找到满足条件的元素
          return userChannel.id === channel.id;
        });
      });
    },
  },
  created() {
    this.loadtAllChannels();
  },
  methods: {
    async loadtAllChannels() {
      const { data } = await getAllChannels();
      this.allChannels = data.data.channels;
    },

    async onAdd(channel) {
      this.userChannels.push(channel);

      // TODO: 数据持久化
      if (this.user) {
        // 登录了，数据存储到线上
        await addUserChannel({
          channels: [
            {
              id: channel.id,
              seq: this.userChannels.length,
            },
          ],
        });
      } else {
        // 没有登录，数据存储到本地
        console.log("本地");
        setItem("user-channels", this.userChannels);
      }
    },

    onUserChannelClick(channel, index) {
      if (this.isEdit && index !== 0) {
        // 编辑状态：删除频道
        this.deleteChannel(channel, index);
      } else {
        // 非编辑状态，切换频道
        this.switchChannel(index);
      }
    },

    async deleteChannel(channel, index) {
      // 如果删除的是当前激活频道之前的频道
      if (index <= this.active) {
        //更新激活频道的索引
        this.$emit("update-active", this.active - 1);
      }
      this.userChannels.splice(index, 1);

      // 数据持久化
      if (this.user) {
        // 登录了，持久化到线上
        await deleteUserChannel(channel.id)
      } else {
        // 没有登录，数据存储到本地
        console.log("本地");
        setItem("user-channels", this.userChannels);
      }
    },

    switchChannel(index) {
      console.log("qiehuan");
      // 切换频道
      this.$emit("update-active", index);

      //关闭弹出层
      this.$emit("close");
    },
  },
};
</script>

<style scoped lang="less">
.channel-edit {
  padding: 54px 0;

  .channel-title {
    font-size: 16px;
    color: #333333;
  }

  .grid-item {
    width: 80px;
    height: 43px;
    /deep/.van-grid-item__content {
      background-color: #f4f5f6;
      .van-grid-item__text {
        font-size: 14px;
        color: #444;
        margin-top: 0;
      }
    }
    /deep/.van-icon {
      position: absolute;
      right: -5px;
      top: -5px;
      font-size: 15px;
      color: #ccc;
    }
  }

  .active {
    /deep/.van-grid-item__text {
      color: red !important;
    }
  }
}
</style>