<template>
  <div class="post-comment">
    <van-field
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入评论"
      show-word-limit
    />
    <van-button
      class="to-btn"
      size="mini"
      round
      @click="onPost"
      :disabled="!message"
      >发布</van-button
    >
  </div>
</template>

<script>
import { addComment } from "@/api/comment";

export default {
  name: "PostComment",
  props: {
    // 如果是发布文章评论，则传递文章 ID
    // 如果是发布评论回复，则传递评论 ID
    target: {
      type: [Number, String, Object],
      required: true,
    },
    articleId: {
      type: [Number, String, Object],
      default: null,
    },
  },
  data() {
    return {
      message: "", // 输入框内容
    };
  },
  methods: {
    async onPost() {
      this.$toast.loading({
        message: "发布中...",
        forbidClick: true, // 禁止背景点击
      });

      // 找到数据接口
      // 封装请求方法
      // 请求提交数据
      const { data } = await addComment({
        target: this.target.toString(), // 评论 ID
        content: this.message, // 评论的内容
        art_id: this.articleId ? this.articleId.toString() : null,
      });

      this.$emit("post-success", data.data.new_obj);

      // 处理响应结果
      this.$toast.success(`发布成功`);

      // 发布成功：清空文本框内容
      this.message = "";
    },
  },
};
</script>

<style scoped lang="less">
.post-comment {
  padding: 14px;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}

.to-btn {
  padding: 20px 0;
}
</style>