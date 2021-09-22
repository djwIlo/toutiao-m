<template>
  <div class="comment-list">
    <van-cell title="全部评论"></van-cell>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <comment-item
        v-for="(comment, index) in list"
        :key="index"
        :comment="comment"
        @reply-click="$emit('reply-click', $event)"
      />
      <!-- <van-cell
        v-for="(comment, index) in list"
        :key="index"
        :title="comment.content"
      /> -->
    </van-list>
  </div>
</template>

<script>
import { getComments } from "@/api/comment";
import CommentItem from "./comment-item";

export default {
  name: "CommentList",
  components: {
    CommentItem,
  },
  props: {
    source: {
      type: [Number, Object, String],
      required: true,
    },
    // 获取文章评论，使用字符 a
    // 获取评论回复，使用字符 c
    type: {
      type: String,
      default: 'a'
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据的页码
      limmit: 10, // 每页大小
    };
  },
  methods: {
    async onLoad() {
      // /1.请求获取数据
      const { data } = await getComments({
        type: this.type,
        source: this.source.toString(),
        offset: this.offset,
        limit: this.limit,
      });
      
      this.$emit('update-total-count', data.data.total_count)

      //2.把数据放到列表中
      const { results } = data.data;
        this.list.push(...results);

      //3.将本次的1oading关闭
      this.loading = false;

      if (results.length) {
        //4.判断是否还有数据,如果有，更新获取下一页数据的页码
        this.offset = data.data.last_id;
      } else {
        // 如果没有，则将finished设置为
        // ture，不再触发加载更多了
        this.finished = true;
      }
    },
  },
};
</script>

<style>
</style>