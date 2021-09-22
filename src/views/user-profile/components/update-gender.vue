<template>
  <div class="update-gender">
    <van-picker
      show-toolbar
      :columns="columns"
      :default-index="defaultIndex"
      @cancel="$emit('close')"
      @confirm="onComfirm"
      @change="onGenderChange"
    />
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user";

export default {
  name: "UpdateGender",
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      columns: ["男", "女"],
      defaultIndex: this.value,
    };
  },
  methods: {
    onGenderChange(piker, value, index) {
      this.defaultIndex = index;
    },

    async onComfirm() {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true,
      });

      // 请求提交更新用户性别
      await updateUserProfile({
        gender: this.defaultIndex,
      });

      this.$emit("input", this.defaultIndex);
      this.$emit("close");

      this.$toast.success("保存成功");
    },
  },
};
</script>

<style>
</style>