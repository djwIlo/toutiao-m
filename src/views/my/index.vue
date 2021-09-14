<template>
  <div class="my-container">
    <van-cell-group v-if="user" class="my-info" cover>
      <van-cell
        title="单元格"
        value="内容"
        class="base-info"
        center
        :border="false"
      >
        <van-image
          class="avatar"
          slot="icon"
          round
          fit="cover"
          :src="currentUser.photo"
        />
        <!-- https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201906%2F20%2F20190620151742_djaxu.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1634145522&t=47ee1b58fddb190886d18f05a455cf81 -->
        <div class="name" slot="title">{{currentUser.name}}</div>
        <van-button class="update-btn" round size="mini">编辑资料</van-button>
      </van-cell>
      <van-grid :border="false">
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{ currentUser.art_count }}</div>
            <div class="text">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{ currentUser.follow_count }}</div>
            <div class="text">关注</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{ currentUser.fans_count }}</div>
            <div class="text">粉丝</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{ currentUser.like_count }}</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>

    <div v-else class="not-login" @click="$router.push('./login')">
      <van-image
        slot="icon"
        round
        fit="cover"
        src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fupload-images.jianshu.io%2Fupload_images%2F7275569-03f0e0461e34f554.jpg&refer=http%3A%2F%2Fupload-images.jianshu.io&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1634190147&t=e0da5407a3f42e60f99e80eb5c3acab4"
      />
      <div class="text">登录 / 注册</div>
    </div>

    <van-grid class="nav-grid mb-4" :column-num="2">
      <van-grid-item
        class="nav-grid-item"
        icon-prefix="toutiao"
        icon="shoucang"
        text="收藏"
      />
      <van-grid-item
        class="nav-grid-item"
        icon-prefix="toutiao"
        icon="lishi"
        text="历史"
      />
    </van-grid>
    <van-cell title="消息通知" is-link to="/" />
    <van-cell class="mb-4" title="小智同学" is-link to="/" />
    <van-cell
      v-if="user"
      class="logout-cell"
      title="退出登录"
      @click="onLogout"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getCurrentUser } from '@/api/user'

export default {
  name: "MyIndex",
  data () {
    return {
      currentUser: {} // 当前登录用户信息
    }
  },
  computed: {
    ...mapState(["user"]),
  },
  created () {
    this.loadCurrentUser()
  },
  methods: {
    onLogout() {
      // 提示用户确认退出
      // 确认 -> 处理推出
      this.$dialog.confirm({
        title: "推出提示",
        message: "确认退出吗",
      })
        .then(() => { // 确认执行这里
          // on confirm
        this.$store.commit('setUser', null)
        })
        .catch(() => { //取消执行这里
          // on cancel
        });
    },
    async loadCurrentUser () {
      const { data } = await getCurrentUser()
      this.currentUser = data.data
    }
  },
};
</script>

<style scoped lang="less">
.my-container {
  .my-info {
    background: url(./yanlingji.png) no-repeat;
    background-size: cover;
    .base-info {
      background-color: unset;
      box-sizing: border-box;
      height: 115px;
      padding-top: 38px;
      padding-bottom: 11px;
      .avatar {
        box-sizing: border-box;
        width: 66px;
        height: 66px;
        border: 1px solid #fff;
        margin-right: 11px;
      }
      .name {
        color: #ff9999;
        font-size: 16px;
        font-weight: 700;
      }
      .update-btn {
        height: 16px;
        color: #666666;
      }
    }
    .data-info-item {
      height: 65px;
      color: #fff;
      .text-wrap {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .count {
          font-size: 18px;
        }
        .text {
          font-size: 11px;
        }
      }
    }
    /deep/ .van-grid-item__content {
      background-color: unset;
    }
  }
  .not-login {
    height: 180px;
    background: url("./yanlingji.png") no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .van-image {
      width: 66px;
      height: 66px;
    }
    .text {
      color: #fff;
      font-size: 14px;
    }
  }
  /deep/.nav-grid {
    .nav-grid-item {
      height: 70px;
      .toutiao {
        font-size: 22px;
      }
      .toutiao-shoucang {
        color: red;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      .van-grid-item__text {
        font-size: 14px;
        color: #333333;
      }
    }
  }
  .logout-cell {
    text-align: center;
    color: #d86262;
  }
  .mb-4 {
    margin-bottom: 4px;
  }
}
</style>