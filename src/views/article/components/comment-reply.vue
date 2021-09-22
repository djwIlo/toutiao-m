<template>
  <div class="comment-reply">
    <!-- 头部信息 -->
    <van-nav-bar :title="`${comment.reply_count}条回复`">
      <van-icon slot="left" name="arrow-left" @click="$emit('close')" />
    </van-nav-bar>
    <!-- /头部信息 -->

    <!-- 当前评论项 -->
    <comment-item :comment="comment"></comment-item>
    <!-- /当前评论项 -->

    <!-- 所有评论回复 -->
    <!-- <van-cell title="所有回复"></van-cell> -->
    <comment-list 
      :source="comment.com_id" 
      type="c"
      :list="commentList"
    ></comment-list>
    <!-- /所有评论回复 -->

    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        round
        type="default"
        size="small"
        @click="isPostShow = true"
      >
        写评论
      </van-button>
    </div>
    <!-- /底部区域 -->

    <!-- 发布回复 -->
    <van-popup v-model="isPostShow" position="bottom">
      <!-- 这里使用 v-if 的目的是为了销毁组件防止组件懒加载，不重新加赞数据，页面数据没变化 -->
    <post-comment 
      :target="comment.com_id"
      :article-id="articleId"
      @post-success="onPostSuccess"
    />
    </van-popup>
    <!-- /发布回复 -->
  </div>
</template>

<script>
import CommentItem from "./comment-item";
import CommentList from "./comment-list";
import PostComment from './post-comment'

export default {
  name: "CommentReply",
  components: {
    CommentItem,
    CommentList,
    PostComment
  },
  props: {
    comment: {
      // 查看回复的评论项
      type: Object,
      required: true,
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      isPostShow: false,
      commentList: [] // 评论的回复列表
    }
  },
  methods: {
    onPostSuccess(comment) {
      // 将发布成功的评论放到评论列表的顶部
      this.commentList.unshift(comment)

      // 更行评论回复的数量
      this.comment.reply_count++

      // 关闭发布回复的弹出层
      this.isPostShow = false
    }
  }
};
</script>

<style scoped lang="less">
.article-bottom {
  position: fixed;
  width: 100%;
  height: 44px;
  background-color: #fff;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>