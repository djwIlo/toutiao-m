<template>
  <div class="update-photo">
    <img class="image" :src="image" ref="image" />
    <van-nav-bar
      class="toolbar"
      left-text="取消"
      right-text="确认"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserPhoto } from "@/api/user";
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";

export default {
  name: "UpdatePhoto",
  props: {
    file: {
      // type: Object,
      required: true,
    },
  },
  data() {
    return {
      image: window.URL.createObjectURL(this.file),
      cropper: null, // 裁切器实例
    };
  },
  mounted() {
    // 获取需要裁切的图片 DOM
    const image = this.$refs.image;
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: "move",
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true,
    });
    console.log(cropper);
  },
  methods: {
    getCroppedCanvas() {
      return new Promise((resolve) => {
        this.cropper.getCroppedCanvas().toBlob((blob) => {
          resolve(blob);
        });
      });
    },

    async onConfirm() {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true,
        duration: 0 // 展示事件，0 表示持续展示
      });

      const file = await this.getCroppedCanvas();
      const fd = new FormData();
      fd.append("photo", file);

      //如果要求 Content-Type是 multipart/
      // form-data，则一定要提交 FormData
      // 数据对象，专门用于文件上传的，不能提交{}，没用
      // const fd = new FormData();
      // fd.append("photo", this.file);
      await updateUserPhoto(fd);

      // 更新用户组件头像
      this.$emit("update-photo", window.URL.createObjectURL(file));

      // 关闭弹出层
      this.$emit("close");

      this.$toast.success("保存成功");
    },
  },
};
</script>

<style scoped lang="less">
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  color: #fff;
}

.image {
  /* Ensure the size of the image fit the container perfectly */
  display: block;

  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
</style>