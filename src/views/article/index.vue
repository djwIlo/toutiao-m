<template>
  <div class="article-container">
    <van-nav-bar
      class="app-nav-bar"
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />

    <div class="article-wrap">
      <h1 class="title">{{ article.title }}</h1>
      <van-cell center class="user-info">
        <div slot="title" class="name">{{ article.aut_name }}</div>
        <van-image
          class="avatar"
          slot="icon"
          fit="cover"
          round
          :src="article.aut_photo"
        />
        <div slot="label" class="pubdate">
          {{ article.pubdate | relativeTiem }}
        </div>
        <van-button
          class="follow-btn"
          round
          :icon="article.is_followed ? '' : 'plus'"
          size="mini"
          :type="article.is_followed ? 'default' : 'info'"
          :loading="isFollowLoading"
          @click="onFollow"
          >{{ article.is_followed ? "已关注" : "关注" }}</van-button
        >
      </van-cell>
      <div
        class="markdown-body"
        v-html="article.content"
        ref="article-content"
      ></div>

      <!-- 文章评论列表 -->
      <comment-list
        :source="articleId"
        :list="commentList"
        @update-total-count="totalCommentCount = $event"
        @reply-click="onReplyClick"
      ></comment-list>
      <!-- 文章评论列表 -->
    </div>

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
      <van-icon name="comment-o" :info="totalCommentCount" />
      <van-icon
        :name="article.is_collected ? 'star' : 'star-o'"
        :color="article.is_collected ? 'orange' : '#777'"
        @click="onCollect"
      />
      <van-icon
        :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
        :color="article.attitude === 1 ? 'hotpink' : '#777'"
        @click="onLike"
      />
      <van-icon name="share" color="#777" />
    </div>
    <!-- /底部区域 -->

    <!-- 发布评论 -->
    <van-popup v-model="isPostShow" position="bottom">
      <post-comment :target="articleId" @post-success="onPostSuccess" />
    </van-popup>
    <!-- /发布评论 -->

    <!-- 评论回复 -->
    <van-popup v-model="isReplyShow" position="bottom">
      <!-- 这里使用 v-if 的目的是为了销毁组件防止组件懒加载，不重新加赞数据，页面数据没变化 -->
      <comment-reply
        v-if="isReplyShow"
        :comment="replyComment"
        :article-id="articleId"
        @close="isReplyShow = false"
      />
    </van-popup>
    <!-- /评论回复 -->
  </div>
</template>

<script>
import "./github-markdown.css";
import {
  getArticleById,
  addCollect,
  deleteCollect,
  addLike,
  deleteLike,
} from "@/api/article";
import { ImagePreview } from "vant";
import { addFollow, deleteFollow } from "@/api/user";
import CommentList from "./components/comment-list";
import PostComment from "./components/post-comment";
import CommentReply from "./components/comment-reply";

// 在组件中获取动态路由参数：
// 方式一：this.$route.params.articleId
// 方式二：props传参 推荐
// this.articleId
export default {
  name: "ArticleIndex",
  components: {
    CommentList,
    PostComment,
    CommentReply,
  },
  props: {
    articleId: {
      type: [String, Object, Number],
      required: true,
    },
  },
  data() {
    return {
      article: {}, //文章数据对象
      isFollowLoading: false, // 关注用户按钮 loading 状态
      isCollectLoading: false, // 点赞的 loading 状态
      isPostShow: false, // 控制发布评论的显示状态
      commentList: [], // 文章评论列表
      totalCommentCount: 0, // 评论总数量
      isReplyShow: false, // 控制回复的显示状态
      replyComment: {}, // 当前回复评论对象
    };
  },
  created() {
    this.loadArticle();
  },
  methods: {
    async loadArticle() {
      const { data } = await getArticleById(this.articleId);
      this.article = data.data;

      // 数据改变影响数据更新（DOM数据）不是立即的
      // 所以如果需要在修改数据之后马上操作被该数据影响的试图 DOM，需要把这个代码放到 $nextTick 中
      // 得到所有的 img 标签
      // this.$nextTick 是 vue 中提供的一个方法
      this.$nextTick(() => {
        this.handelPerviewImage();
      });
      // 循环 img 列表，给 img 注册点击事件
      // 在事件处理函数中调用 ImagePreview 预览
    },

    handelPerviewImage() {
      // 获取文章内容 DOM 容器
      const articleContent = this.$refs["article-content"];
      const imgs = articleContent.querySelectorAll("img");

      const imgPaths = [];
      imgs.forEach((img, index) => {
        imgPaths.push(img.src);
        img.onclick = function () {
          ImagePreview({
            images: imgPaths, // 预览图片路径列表
            startPosition: index, // 起始位置
          });
        };
      });
    },

    async onFollow() {
      this.isFollowLoading = true;
      if (this.article.is_followed) {
        // 已关注，取消关注
        await deleteFollow(this.article.aut_id);
      } else {
        // 没有关注，添加关注
        await addFollow(this.article.aut_id);
      }
      // 更新视图
      this.article.is_followed = !this.article.is_followed;
      this.isFollowLoading = false;
    },

    async onCollect() {
      this.isCollectLoading = true;
      if (this.article.is_collected) {
        // 已收藏，取消收藏
        await deleteCollect(this.articleId);
      } else {
        // 没有收藏，添加收藏
        await addCollect(this.articleId);
      }
      // 更新视图
      this.article.is_collected = !this.article.is_collected;
      this.isCollectLoading = false;
      this.$toast.success(
        `${this.article.is_collected ? "收藏成功" : "取消收藏"}`
      );
    },

    async onLike() {
      this.$toast.loading({
        message: "操作中...",
        forbidClick: true, // 禁止背景点击
      });
      if (this.article.attitude === 1) {
        // 已点赞，取消点赞
        await deleteLike(this.articleId);
        this.article.attitude = -1;
      } else {
        // 没有点赞，添加点赞
        await addLike(this.articleId);
        this.article.attitude = 1;
      }
      // 更新视图
      this.$toast.success(
        `${this.article.attitude === 1 ? "点赞成功" : "取消点赞"}`
      );
    },

    onPostSuccess(comment) {
      console.log(comment);
      // 把发布成功的评论数据对象放到评论列表顶部
      this.commentList.unshift(comment);

      // 更新评论的总数量
      this.totalCommentCount++;

      // 关闭发布评论弹出层
      this.isPostShow = false;
    },

    onReplyClick(comment) {
      console.log("onReplyClick", comment);
      this.replyComment = comment;

      // 展示回复内容
      this.isReplyShow = true;
    },
  },
};
</script>

<style scoped lang="less">
.article-wrap {
  position: fixed;
  top: 46px;
  left: 0;
  right: 0;
  bottom: 44px;
  overflow-y: auto;
}

.title {
  font-size: 20px;
  color: #3a3a3a;
  padding: 14px;
  background-color: #fff;
  margin: 0;
}

.user-info {
  .name {
    font-size: 12px;
    color: #333333;
  }
  .avatar {
    width: 35px;
    height: 35px;
    margin-right: 8px;
  }
  .pubdate {
    font-size: 11px;
    color: #b4b4b4;
  }
  .follow-btn {
    width: 75px;
    height: 29px;
  }
}

ul {
  list-style: unset;
}

.markdown-body {
  padding: 14px;
  background-color: #fff;
}

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