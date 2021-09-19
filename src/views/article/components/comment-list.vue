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
  },
  data() {
    return {
      list: [],
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
        type: "a",
        source: this.source,
        offset: this.offset,
        limit: this.limit,
      });

      // console.log(data);
      //2.把数据放到列表中
      const { results } = data.data;
      const yanlingji = [
        {
          aut_name: "焰灵姬",
          content: "焰灵姬国漫第一美",
          pubdate: "2021-07-16T23:10:58",
          reply_count: 18,
          like_count: 2,
          is_liking: false,
          com_id: {}
        },
        {
          aut_name: "美杜莎",
          content: "美杜莎女王，很霸气，萧炎竟然玩蛇，跟许仙比有过之而不及！",
          pubdate: "2020-11-19T08:10:43",
          reply_count: 25,
          like_count: 1,
          is_liking: false,
          com_id: {}
        },
        {
          aut_name: "删库跑路",
          content: "人跟代码有一个能跑就行，想好了没谁先跑",
          pubdate: "2020-07-15T14:16:22",
          reply_count: 8,
          like_count: 1,
          is_liking: true,
          com_id: {}
        },
      ];

      if (!results.length) {
        this.list.push(...yanlingji);
      } else {
        this.list.push(...results);
      }

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