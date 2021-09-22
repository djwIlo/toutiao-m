<template>
  <!-- <div class="article-item">文章列表项</div> -->
  <van-cell
    class="article-item"
    :to="{
      name: 'article',
      params: {
        articleId: item.art_id,
      },
    }"
  >
    <div slot="title" class="title van-multi-ellipsis--l3">
      {{ item.title }}
    </div>
    <div slot="label">
      <div v-if="item.cover.type === 3" class="cover-wrap">
        <div
          class="cover-wrap-item"
          v-for="(img, index) in item.cover.images"
          :key="index"
        >
          <van-image
            class="cover-item"
            fit="cover"
            :src="img"
          />
        </div>
      </div>
      <div class="label-wrap">
        <span>{{ item.aut_name }}</span>
        <span>{{ item.comm_count }}评论</span>
        <span>{{ item.pubdate | relativeTiem }}</span>
      </div>
    </div>
    <!-- 默认插槽的名字叫 default ，可以省略 -->
    <van-image
      v-if="item.cover.type === 1"
      class="right-cover"
      fit="cover"
      :src="item.cover.images[0]"
    />
  </van-cell>
</template>

<script>
export default {
  name: "ArticleItem",
  props: {
    item: {
      type: Object,
      required: true,
      default: {},
    },
  },
};
</script>

<style scoped lang="less">
.article-item {
  .title {
    font-size: 16px;
    color: #363636;
  }
  .van-cell__value {
    flex: unset;
    width: 116px;
    height: 73px;
    margin-left: 12px;
  }
  .right-cover {
    width: 116px;
    height: 73px;
  }
  .cover-wrap {
    display: flex;
    padding: 15px 0;
    .cover-wrap-item {
      flex: 1;
      height: 73px;
      &:not(:last-child) {
        padding-right: 4px;
      }
      .cover-item {
        width: 100%;
        height: 73px;
      }
    }
  }
  .label-wrap {
    font-size: 11px;
    color: #b4b4b4;
    span {
      margin-right: 12px;
    }
  }
}
</style>