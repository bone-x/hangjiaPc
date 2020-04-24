<template>
  <a
    ref="FigureKeyframesDom"
    class="c_figure_keyframes"
    @click="onClickImg"
    @mouseenter="onEnter"
    @mousemove="onMousemove"
    @mouseleave="onLeave"
  >
    <img v-show="!showKeyframes" :src="cover" class="figure_pic">
    <img v-if="!cover" :src="NullImgFile" class="figure_pic">
    <div v-show="showKeyframes" class="pic_keyframes_wrap">
      <div class="progress">
        <div :style="{ width: moveProgress + '%' }" class="progress-val"></div>
      </div>
      <ul class="pic_keyframes">
        <li v-for="(value, index) in keyframes" :key="index" class="pic_keyframe">
          <img v-show="showIndex == index" :src="value" alt>
        </li>
      </ul>
    </div>
  </a>
</template>

<script>
import NullImgFile from '@/assets/null.png';

let offsetLeft = 0;
export default {
  name: "CFigureKeyframes",
  props: {
    href: {
      type: String,
      default: ""
    },
    cover: {
      type: String,
      default: ""
    },
    keyframes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      NullImgFile,
      width: 0,
      showIndex: 0,
      showKeyframes: false,
      moveProgress: 0
    };
  },
  methods: {
    onClickImg() {
      if (this.href) window.location.href = this.href;
    },
    onEnter() {
      if (this.keyframes.length <= 0) return false;
      this.showKeyframes = true;
      const ref = this.$refs.FigureKeyframesDom.getBoundingClientRect();
      this.width = ref.width;
      offsetLeft = ref.left;
    },
    onMousemove(e) {
      if (this.keyframes.length <= 0) return false;
      const { clientX } = e;
      let moveWidth = clientX - offsetLeft + 15;
      if (moveWidth < 0) moveWidth = 1;
      if (moveWidth > this.width) moveWidth = this.width;

      let moveProgress = (moveWidth / this.width) * 100;
      if (moveProgress < 0) moveProgress = 0;
      if (moveProgress > 100) moveProgress = 100;
      this.moveProgress = moveProgress;

      const stageWidth = this.width / this.keyframes.length;
      let i = Math.floor(moveWidth / stageWidth);
      if (i < 0) i = 0;
      else if (i > this.keyframes.length - 1) i = this.keyframes.length - 1;
      this.showIndex = i;
    },
    onLeave() {
      this.showKeyframes = false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.c_figure_keyframes {
  display: inline-block;
  position: relative;
  height: 162px;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  .figure_pic {
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
  }
  .pic_keyframes_wrap {
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    .pic_keyframes {
      display: inline-block;
      margin: 0;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      .pic_keyframe {
        position: absolute;
        left: 0;
        top: 0;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        img {
          display: inline-block;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
      }
    }
    .progress {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 12;
      width: 100%;
      height: 12px;
      padding: 0 10px;
      background-color: rgba(0, 0, 0, 0.5);
      .progress-val {
        margin-top: 4px;
        width: 0;
        height: 4px;
        background-color: #fff;
      }
    }
  }
}
</style>
