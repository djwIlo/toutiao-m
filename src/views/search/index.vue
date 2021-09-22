<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch(searchText)"
        @cancel="$router.back()"
        @focus="isResultShow = false"
      />
    </form>
    <!-- /搜索栏 -->

    <!-- 搜索结果 -->
    <search-result
      v-if="isResultShow"
      class="search-result"
      :search-text="searchText"
    ></search-result>
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    ></search-suggestion>
    <!-- /联想建议 -->

    <!-- 历史记录 -->
    <search-history
      v-else
      :search-historys="searchHistorys"
      @updata-histories="searchHistorys = $event"
      @search="onSearch"
    ></search-history>
    <!-- /历史记录 -->
  </div>
</template>

<script>
import SearchSuggestion from "./components/search-suggestion";
import SearchHistory from "./components/search-history";
import SearchResult from "./components/search-result";
import { setItem, getItem } from "@/utils/storage";
import { getSearchHistorys } from "@/api/search";
import { mapState } from "vuex";

export default {
  name: "SearchIndex",
  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResult,
  },
  data() {
    return {
      searchText: "", // 搜索输入框的内容
      isResultShow: false, // 控制搜索结果的显示状态
      searchHistorys: [], // 搜索历史数据
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  watch: {
    // 监视搜索历史记录的变化，存储到本地存储
    searchHistorys() {
        setItem('search-historys', this.searchHistorys)
    }
  },
  async created() {
    this.loadSearchHistories();
  },
  methods: {
    onSearch(searchText) {
      // 把输入框设置为你要搜索的文本
      this.searchText = searchText;

      const index = this.searchHistorys.indexOf(searchText);
      if (index !== -1) {
        // 把重复项删除
        this.searchHistorys.splice(index, 1);
      }

      // 把最新的历史纪录放到顶部
      this.searchHistorys.unshift(searchText);

      // 如果用户已登录，则把搜索历史记录存储到线上
      // 如果用户未登录，则把搜索历史记录存储到本地
      // setItem("search-historys", this.searchHistorys);

      // 展示搜索结果
      this.isResultShow = true;
    },

    async loadSearchHistories() {
      let searchHistories = getItem("search-historys") || [];

      if (this.user) {
        const { data } = await getSearchHistorys();
        searchHistories = [
          ...new Set([...searchHistories, ...data.data.keywords]),
        ];
      }
      this.searchHistorys = searchHistories;
    },
  },
};
</script>

<style scoped lang="less">
.search-container {
  .search-result {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 59px;
    overflow-y: auto;
  }
}
</style>