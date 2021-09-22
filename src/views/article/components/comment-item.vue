<template>
  <van-cell class="comment-item">
    <van-image
      class="avatar"
      slot="icon"
      round
      fit="cover"
      :src="comment.aut_photo"
    />
    <div slot="title">
      <div class="title-wrap" @click="onCommentLike">
        <div class="name">{{ comment.aut_name }}</div>
        <div class="like-wrap">
          <van-icon
            class="like-icon"
            :class="{ liked: comment.is_liking }"
            :name="comment.is_liking ? 'good-job' : 'good-job-o'"
          />
          <span class="like-count">{{ comment.like_count }}</span>
        </div>
      </div>
      <div class="content">{{ comment.content }}</div>
      <div class="date">
        <span class="pubdate"
          >{{ comment.pubdate | dateTime("MM-DD HH:mm") }}·</span
        >
        <van-button
          class="reply-btn"
          size="mini"
          round
          @click="$emit('reply-click', comment)"
          >{{ comment.reply_count }} 回复</van-button
        >
      </div>
    </div>
  </van-cell>
</template>

<script>
import { addCommentLike, deleteCommentLike } from "@/api/comment";
export default {
  name: "CommentItem",
  props: {
    comment: {
      type: [Number, Object, String],
      required: true,
    },
  },
  methods: {
    async onCommentLike() {
      const commentId = this.comment.com_id.toString();
      if (this.comment.is_liking) {
        // 以点赞，取消点赞
        await deleteCommentLike(commentId);
        this.comment.like_count--;
      } else {
        // 未点赞，添加点赞
        await addCommentLike(commentId);
        this.comment.like_count++;
      }

      // 更新视图
      this.comment.is_liking = !this.comment.is_liking;
    },
  },
};
</script>

<style scoped lang="less">
.comment-item {
  .avatar {
    width: 36px;
    height: 36px;
    margin-right: 13px;
  }

  .like-wrap {
    display: flex;
    align-items: center;
  }

  .name {
    font-size: 13px;
    color: #406599;
  }

  .content {
    font-size: 16px;
    color: #222222;
  }

  .pubdate {
    font-size: 9px;
    margin-right: 10px;
  }

  .title-wrap {
    display: flex;
    justify-content: space-between;
  }

  .date {
    display: flex;
    align-items: center;
  }

  .reply-btn {
    font-size: 9px;
    padding: 2px 2px;
    background-color: #fff;
  }

  .like-icon.liked {
    color: #ff69b4;
  }
}
</style>