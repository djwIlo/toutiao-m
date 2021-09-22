<template>
  <div class="user-chat">
    <van-nav-bar
      class="app-nav-bar"
      title="小智同学"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 消息列表 -->
    <van-cell-group class="message-list">
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" label="描述信息" />
    </van-cell-group>
    <!-- 、消息列表 -->

    <!-- 发送消息 -->
    <van-cell-group class="send-message-wrap">
      <van-field v-model="message" placeholder="请输入消息" :border="false" />
      <van-button size="mini" type="primary" round style="width: 60px"
        >发送</van-button
      >
    </van-cell-group>
    <!-- /发送消息 -->
  </div>
</template>

<script>
// import io from "socket.io-client";

// 建立连接
// const socket = io("http://ttapi.research.itcast.cn");

export default {
  name: "UserChat",
  data() {
    return {
      message: "",
    };
  },
  created() {
    // socket.on("connect", function () {
    //   console.log("连接建立成功了");
    // });
    // // socket.on('event',function(data){});

    // socket.on("disconnect", function () {
    //   console.log("断开连接了");
    // });

    // window.socket = socket;
  },
};
</script>

<style scoped lang="less">
.message-list {
  position: fixed;
  left: 0;
  right: 0;
  top: 46px;
  bottom: 44px;
  overflow-y: auto;
}

.send-message-wrap {
  position: fixed;
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
  padding: 0 14px;
  align-items: center;
}
</style>