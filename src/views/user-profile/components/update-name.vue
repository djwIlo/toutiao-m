<template>
  <div class="update-name">
    <van-nav-bar
      title="修改昵称"
      left-text="取消"
      right-text="确认"
      @click-left="$emit('close')"
      @click-right="onComfirm"
    />
    <div class="name-filed-wrap">
      <van-field
        v-model="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="20"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user";

export default {
  name: "UpdateName",
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      localName: this.value, // 昵称
    };
  },
  methods: {
    async onComfirm() {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true,
      });

      try {
        // 请求提交更新用户昵称
        await updateUserProfile({
          name: this.localName,
        });

        // 更新成功 -> 修改父组件的 name -> 关闭弹出层
        this.$emit('input', this.localName)
        // this.$emit('update-name', this.localName)
        this.$emit("close");

        this.$toast.success("保存成功");

      } catch (err) {
        if (err && err.response && err.response.status === 409) {
          this.$toast.fail('昵称已存在')
        }
      }
    },
  },
};
</script>

<style scoped lang="less">
.name-filed-wrap {
  padding: 10px;
}
</style>