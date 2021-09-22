<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="onComfirm"
      @cancel="$emit('close')"
    />
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user";
import dayjs from 'dayjs'

export default {
  name: "UPdateBirthday",
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value),
    };
  },
  methods: {
    async onComfirm() {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true,
      });

      // const date = `${this.currentDate.getFullYear()}-${this.currentDate.getMonth() + 1}-${this.currentDate.getDate()}`
      const date = dayjs(this.currentDate).format('YYYY-MM-DD')

      // 请求提交更新用户生日
      await updateUserProfile({
        birthday: date,
      });

      this.$emit("input", date);
      this.$emit("close");

      this.$toast.success("保存成功");
    },
  },
};
</script>

<style>
</style>