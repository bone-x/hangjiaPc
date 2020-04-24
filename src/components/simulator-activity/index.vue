<template>
  <div id="simulator-container" class>
    <div
      class="screen-viewport"
      style="width: 375px; height: 667px; min-width: 375px; min-height: 667px; transform: matrix(1, 0, 0, 1, 0, 0);"
    >
      <div class="zoom-area" style="transform: scale(0.983108);">
        <div
          id="simulator"
          class="mb-screen ios iphone iphone_6 portrait"
          style="width: 375px; height: 667px;"
        >
          <div
            id="app"
            style="display: block; touch-action: auto; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);"
          >
            <div
              class="pcanvas active"
              style="background-color: rgb(255, 255, 255); z-index: 3; transform: none;"
            >
              <div class="screen-header" style="height: 65px;">
                <div
                  class="widget ios_status_bar"
                  style="width: 375px; height: 20px; left: 0px; top: 0px; z-index: 3; color: rgb(0, 0, 0); background-color: rgb(255, 255, 255); font-weight: normal; font-style: normal; opacity: 1;"
                >
                  <div class="iOS-StatusBar" style="color: rgb(0, 0, 0);">
                    <div class="StatusBarSignal">
                      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="12">
                        <path
                          d="M1.25 6.5h1a1 1 0 0 1 1 1V10a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V7.5a1 1 0 0 1 1-1zM5.75 5h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm4.5-2h1a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm4.5-2h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"
                          fill-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <div class="StatusBarWifi">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12">
                        <path
                          d="M8.007 2.787a8.64 8.64 0 0 1 5.953 2.379c.12.118.314.116.433-.004l1.156-1.166a.322.322 0 0 0-.003-.456 10.897 10.897 0 0 0-15.08 0 .322.322 0 0 0-.003.456L1.62 5.162c.119.12.312.122.433.004a8.641 8.641 0 0 1 5.954-2.379zm0 3.796c1.217 0 2.391.452 3.294 1.27a.31.31 0 0 0 .433-.006l1.155-1.167a.322.322 0 0 0-.005-.459 7.16 7.16 0 0 0-9.752 0 .322.322 0 0 0-.005.46l1.155 1.166a.31.31 0 0 0 .433.006 4.907 4.907 0 0 1 3.292-1.27zm2.219 2.784a.314.314 0 0 0-.01-.457 3.422 3.422 0 0 0-4.42 0 .314.314 0 0 0-.009.457l1.998 2.016a.312.312 0 0 0 .443 0l1.998-2.016z"
                          fill-rule="nonzero"
                        ></path>
                      </svg>
                    </div>
                    <div class="StatusBarTime">12:00</div>
                    <div class="StatusBarBattery">
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="12">
                        <path
                          d="M2.667 1.333C1.747 1.333 1 2.08 1 3v6c0 .92.746 1.667 1.667 1.667h16.666C20.253 10.667 21 9.92 21 9V3c0-.92-.746-1.667-1.667-1.667H2.667zm0-1h16.666A2.667 2.667 0 0 1 22 3v6a2.667 2.667 0 0 1-2.667 2.667H2.667A2.667 2.667 0 0 1 0 9V3A2.667 2.667 0 0 1 2.667.333z"
                          opacity=".35"
                        ></path>
                        <path d="M23 4v4a2.17 2.17 0 0 0 0-4" opacity=".4"></path>
                        <rect x="2" y="2.333" width="18" height="7.333" rx="1.333"></rect>
                      </svg>
                    </div>
                  </div>
                  <div class="region gesture"></div>
                </div>
                <div
                  class="widget nav_bar"
                  style="width: 375px; height: 55px; left: 0px; top: 20px; z-index: 4; color: rgb(0, 0, 0); background-color: rgb(255, 255, 255); border-color: rgb(255, 255, 255); box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px; font-size: 18px; font-weight: normal; font-style: normal; opacity: 1;"
                >
                  <span class="text">{{ title }}</span>
                  <div class="region gesture"></div>
                </div>
              </div>
              <div class="screen-content">
                <div class="widgets" style="height: 602px; left: 0px; top: 0px;">
                  <div class="scontainer" style="height: 667px; margin-top: -65px;">
                    <div
                      data-cid="w_default_C8113F4F761555728179024"
                      data-link_cid
                      class="widget ios_status_bar"
                      style="width: 375px; height: 20px; left: 0px; top: 0px; z-index: 3; color: rgb(0, 0, 0); background-color: rgb(255, 255, 255); font-weight: normal; font-style: normal; opacity: 1;"
                    >
                      <div class="iOS-StatusBar" style="color: rgb(0, 0, 0);">
                        <div class="StatusBarSignal">
                          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="12">
                            <path
                              d="M1.25 6.5h1a1 1 0 0 1 1 1V10a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V7.5a1 1 0 0 1 1-1zM5.75 5h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm4.5-2h1a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm4.5-2h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"
                              fill-rule="evenodd"
                            ></path>
                          </svg>
                        </div>
                        <div class="StatusBarWifi">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12">
                            <path
                              d="M8.007 2.787a8.64 8.64 0 0 1 5.953 2.379c.12.118.314.116.433-.004l1.156-1.166a.322.322 0 0 0-.003-.456 10.897 10.897 0 0 0-15.08 0 .322.322 0 0 0-.003.456L1.62 5.162c.119.12.312.122.433.004a8.641 8.641 0 0 1 5.954-2.379zm0 3.796c1.217 0 2.391.452 3.294 1.27a.31.31 0 0 0 .433-.006l1.155-1.167a.322.322 0 0 0-.005-.459 7.16 7.16 0 0 0-9.752 0 .322.322 0 0 0-.005.46l1.155 1.166a.31.31 0 0 0 .433.006 4.907 4.907 0 0 1 3.292-1.27zm2.219 2.784a.314.314 0 0 0-.01-.457 3.422 3.422 0 0 0-4.42 0 .314.314 0 0 0-.009.457l1.998 2.016a.312.312 0 0 0 .443 0l1.998-2.016z"
                              fill-rule="nonzero"
                            ></path>
                          </svg>
                        </div>
                        <div class="StatusBarTime">12:00</div>
                        <div class="StatusBarBattery">
                          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="12">
                            <path
                              d="M2.667 1.333C1.747 1.333 1 2.08 1 3v6c0 .92.746 1.667 1.667 1.667h16.666C20.253 10.667 21 9.92 21 9V3c0-.92-.746-1.667-1.667-1.667H2.667zm0-1h16.666A2.667 2.667 0 0 1 22 3v6a2.667 2.667 0 0 1-2.667 2.667H2.667A2.667 2.667 0 0 1 0 9V3A2.667 2.667 0 0 1 2.667.333z"
                              opacity=".35"
                            ></path>
                            <path d="M23 4v4a2.17 2.17 0 0 0 0-4" opacity=".4"></path>
                            <rect x="2" y="2.333" width="18" height="7.333" rx="1.333"></rect>
                          </svg>
                        </div>
                      </div>
                      <div class="region gesture"></div>
                    </div>
                    <div
                      data-cid="w_default_0A962207871555728179024"
                      data-link_cid
                      class="widget nav_bar"
                      style="width: 375px; height: 55px; left: 0px; top: 20px; z-index: 4; color: rgb(0, 0, 0); background-color: rgb(255, 255, 255); border-color: rgb(255, 255, 255); box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px; font-size: 18px; font-weight: normal; font-style: normal; opacity: 1;"
                    >
                      <span class="text">{{ title }}</span>
                      <div class="region gesture"></div>
                    </div>
                    <div
                      data-cid="wC68CCB77B71557137368521"
                      data-link_cid
                      class="widget image_view"
                      style="width: 375px; height: 592px; left: 0px; top: 75px; z-index: 5; background-color: rgb(255, 255, 255); border-color: rgb(255, 255, 255); box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px; border-width: 0px; border-style: solid; font-weight: normal; font-style: normal; opacity: 1;"
                    >
                      <div class="image-wrapper undefined">
                        <span style="display: none; background-color: rgb(255, 255, 255);">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="svg-icon icon"
                            viewBox="0 0 24 22"
                            aria-hidden="true"
                            style="width: 24px; height: 22px;"
                          >
                            <path
                              d="M2.273.1h17.454c1.205 0 2.182.977 2.182 2.182v15.436a2.182 2.182 0 0 1-2.182 2.182H2.273A2.182 2.182 0 0 1 .09 17.718V2.282C.09 1.077 1.068.1 2.273.1zm0 3.29v13.22c0 .602.488 1.09 1.09 1.09h15.273a1.09 1.09 0 0 0 1.091-1.09V3.39a1.09 1.09 0 0 0-1.09-1.09H3.363a1.09 1.09 0 0 0-1.091 1.09zm1.09 12.172V14.4l2.905-2.928a1.09 1.09 0 0 1 1.664.137l1.108 1.565a1.09 1.09 0 0 0 1.766.02l3.023-4.064a1.09 1.09 0 0 1 1.82.105l2.987 5.165v1.113c0 .601-.486 1.089-1.086 1.091l-13.091.05a1.09 1.09 0 0 1-1.095-1.092zM7.183 7.8a1.643 1.643 0 0 1-1.637-1.65c0-.911.733-1.65 1.637-1.65s1.636.739 1.636 1.65c0 .911-.732 1.65-1.636 1.65z"
                              fill="#8D9EA7"
                              fill-rule="evenodd"
                            ></path>
                          </svg>
                        </span>
                        <div class="wrapper">
                          <img
                            :src="wrapperBgImg"
                            draggable="false"
                            style="display: block; height: auto;"
                          >
                          <div class="wrapper-mask"></div>
                          <div class="wrapper-window">
                            <div class="wrapper-window-main">
                              <img :src="popupImg" class="wrapper-window-img">
                            </div>
                            <img
                              :src="iconClose"
                              style="display: block; width: 40px; height: 40px;"
                            >
                          </div>
                        </div>
                      </div>
                      <div class="region gesture"></div>
                    </div>
                  </div>
                </div>
                <div
                  class="iScrollVerticalScrollbar iScrollLoneScrollbar"
                  style="position: absolute; z-index: 9999; width: 7px; bottom: 2px; top: 2px; right: 1px; overflow: hidden; transition-duration: 500ms; opacity: 0;"
                >
                  <div
                    class="iScrollIndicator"
                    style="box-sizing: border-box; position: absolute; background: rgba(0, 0, 0, 0.5); border: 1px solid rgba(255, 255, 255, 0.9); border-radius: 3px; width: 100%; transition-duration: 0ms; display: none; height: 594px; left: 0px; top: 0px;"
                  ></div>
                </div>
              </div>
              <div class="screen-footer" style="height: 0px;"></div>
            </div>
          </div>
          <div class="splash" style="background-color: rgb(255, 255, 255); display: none;">
            <div class="loading">
              <div class="spinner"></div>
            </div>
          </div>
        </div>
        <div class="_38-tXAYs8SyeFiNeAicHOH"></div>
        <div id="sticky-container">
          <div id="stickies" style="margin-top: 0px;"></div>
        </div>
      </div>
      <div class="no-zoom-area-wrapper" style="width: 98.3108%; height: 98.3108%;">
        <div class="no-zoom-area">
          <div id="ui-layers" class="ui-layers is-shadow"></div>
          <div id="ui-comment-marker-panel"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import wrapperBgImg from "./bg.png";
import iconClose from "./close.png";

export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    popupImg: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      wrapperBgImg,
      iconClose
    };
  }
};
</script>

<style lang="less" scoped>
#simulator-container {
  transition: right 0.5s ease-in-out;
  z-index: 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  transform: scale(0.5, 0.5);
}

#simulator-container .screen-viewport {
  position: relative;
}

#simulator-container .screen-viewport .zoom-area {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  -webkit-transform-origin: 50% 50%;
  transform-origin: 50% 50%;
}

#simulator-container .screen-viewport .no-zoom-area-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  -webkit-transform-origin: center center;
  transform-origin: center center;
  pointer-events: none;
}

#simulator-container .screen-viewport .no-zoom-area {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 200;
}

#simulator-container .screen-viewport .no-zoom-area #ui-comment-marker-panel {
  pointer-events: auto;
}

#simulator-container .screen-viewport .no-zoom-area .ui-layers {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  pointer-events: none;
}

#simulator-container .screen-viewport .no-zoom-area .ui-layers.is-shadow {
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1);
}

#simulator-container .screen-viewport .no-zoom-area .ui-layers.is-active {
  z-index: 200;
  pointer-events: auto;
}

#simulator-container .screen-viewport.is-geely {
  position: relative;
  top: -90px;
}

#simulator-container .screen-viewport.is-fullscreen:not(.is-geely) {
  -webkit-animation: slideUp 0.35s ease-in-out;
  animation: slideUp 0.35s ease-in-out;
}

#simulator-container .screen-viewport.is-fullscreen.is-geely {
  -webkit-animation: slideUpGeely 0.35s ease-in-out;
  animation: slideUpGeely 0.35s ease-in-out;
}

#simulator-container.wait-drag {
  cursor: -webkit-grab;
  cursor: grab;
}

#simulator-container.wait-drag:active {
  cursor: -webkit-grabbing;
  cursor: grabbing;
}

/* 拖拽画布时, 禁止画布接收鼠标事件 */

#simulator-container.wait-drag .screen-viewport,
#simulator-container.wait-drag #ui-layers {
  pointer-events: none;
}

#simulator-container.is-immersive .animated {
  -webkit-animation-name: noop !important;
  animation-name: noop !important;
}

/* 禁止批注组件鼠标事件 */

#simulator-container.is-immersive #simulator,
#simulator-container.is-immersive #sticky-container {
  pointer-events: none;
}

#simulator-container.is-layer-active #sticky-container {
  display: none;
}

/* 页面展开时, 隐藏header和footer */

#simulator-container.is-screen-expanded .screen-header,
#simulator-container.is-screen-expanded .screen-footer {
  display: none;
}

#simulator-container.is-screen-expanded .screen-content {
  height: 100%;
}

#simulator-container.is-screen-expanded .screen-content > .widgets {
  height: 100% !important;
}

#simulator-container.is-screen-expanded
  .screen-content
  > .widgets
  > .scontainer {
  margin-top: 0 !important;
}

@-webkit-keyframes slideUp {
  from {
    top: 38px;
  }

  to {
    top: 0;
  }
}

@keyframes slideUp {
  from {
    top: 38px;
  }

  to {
    top: 0;
  }
}

@-webkit-keyframes slideUpGeely {
  from {
    top: -52px;
  }

  to {
    top: -90;
  }
}

@keyframes slideUpGeely {
  from {
    top: -52px;
  }

  to {
    top: -90;
  }
}

#simulator {
  -webkit-transform-origin: top left;
  transform-origin: top left;
  background-size: 100% 100%;
  position: relative;
  z-index: 4;
}
#simulator .group,
#simulator .ppanel {
  /* 未设置链接的母版/组合不接收鼠标事件, 以防遮挡底部有链接的组件 */
  pointer-events: none;
}
#simulator .group.clickable,
#simulator .ppanel.clickable {
  pointer-events: auto;
}
#simulator .group .widget,
#simulator .ppanel .widget {
  /* 内部元素均需要设回pe, 以保证全局手势正常 */
  pointer-events: auto;
}
#simulator .group.invisible,
#simulator .ppanel.invisible {
  pointer-events: none;
}
#simulator .group.invisible *,
#simulator .ppanel.invisible * {
  pointer-events: none !important;
}
#simulator .ppanel {
  /* 保证panel内部fixed定位的元素不会错位, https://stackoverflow.com/questions/15194313/transform3d-not-working-with-position-fixed-children */
  -webkit-transform: translateX(0);
  transform: translateX(0);
  overflow: hidden;
}
#simulator .ppanel .panel-scroll-box {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
#simulator .pg {
  display: none;
}
#simulator .lr {
  background: transparent;
  opacity: 1;
  border: none;
}
#simulator .clickable > .region {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 195, 16, 0.2);
  z-index: 100;
  display: none;
  background-repeat: no-repeat;
  background-position: 50%;
  border: 1px solid #ff7100;
}
#simulator .pg {
  left: 50%;
  margin-left: -20px;
  z-index: 110;
  justify-content: center;
  align-items: center;
}
#simulator .pg.stap {
  top: 10px;
}
#simulator .pg.sleft {
  top: 60px;
}
#simulator .pg.sright {
  top: 120px;
}
#simulator .pg.sup {
  top: 180px;
}
#simulator .pg.sdown {
  top: 240px;
}
#simulator .pg.sshake {
  top: 300px;
}
#simulator .pg.sdtap {
  top: 300px;
}
#simulator #app {
  display: none;
  background: #f0f0f2;
  width: 100%;
  height: 100%;
  position: absolute;
  background-size: 100% auto;
  z-index: 1;
  -webkit-transform: translate(0, 0);
  transform: translate(0, 0);
}

#app {
  overflow: hidden;
}

/* PATCH: create stacking context to prevent fixed widgets overflow screen */
#simulator #app .pstate {
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: 100%;
  z-index: 1;
}
#simulator #app .pcanvas {
  display: flex;
  flex-direction: column;
}
/* 页面的header/footer区域 */
#simulator #app .pcanvas .screen-header,
#simulator #app .pcanvas .screen-footer {
  position: relative;
  overflow: hidden;
}
#simulator #app .pcanvas .screen-footer .footer-widgets {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
#simulator #app .pcanvas .screen-content {
  position: relative;
  flex: 1;
  overflow: hidden;
}
#simulator #app .pcanvas .screen-content .iScrollVerticalScrollbar {
  /* 保证滚动条不被固定位置元素盖住 */
  z-index: 2147483647 !important;
}
#simulator #app .pcanvas,
#simulator #app .pstate {
  transition: all 10ms ease-in-out;
  transition: unset !important;
  z-index: 1;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-color: transparent;
  background-repeat: repeat;
  background-position: top left;
  background-size: 100% auto;
  overflow: hidden;
}
#simulator #app .pcanvas .widgets,
#simulator #app .pstate .widgets {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
#simulator #app .pcanvas .widgets .scontainer,
#simulator #app .pstate .widgets .scontainer {
  position: absolute;
  overflow: hidden;
  width: 100%;
}

.mac .mb-screen.ios {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial,
    "Pingfang SC", "Microsoft Yahei", "WenQuanYi Micro Hei", sans-serif;
}
.mac .mb-screen.android {
  font-family: Roboto, Arial, "Noto Sans CJK SC", "Noto Sans CJK TC",
    "Pingfang SC", "Microsoft Yahei", "WenQuanYi Micro Hei", sans-serif;
}
.mac .mb-screen.others {
  font-family: Roboto, -apple-system, BlinkMacSystemFont, "Helvetica Neue",
    Arial, "Pingfang SC", "Microsoft Yahei", "WenQuanYi Micro Hei", sans-serif;
}
.windows .mb-screen.ios,
.other-os .mb-screen.ios {
  font-family: BlinkMacSystemFont, "Helvetica Neue", Arial, "Microsoft Yahei",
    "WenQuanYi Micro Hei", "Pingfang SC", sans-serif;
}
.windows .mb-screen.android,
.other-os .mb-screen.android {
  font-family: Roboto, Arial, "Noto Sans CJK SC", "Noto Sans CJK TC",
    "Microsoft Yahei", "WenQuanYi Micro Hei", "Pingfang SC", sans-serif;
}
.windows .mb-screen.others,
.other-os .mb-screen.others {
  font-family: Roboto, BlinkMacSystemFont, "Helvetica Neue", Arial,
    "Microsoft Yahei", "WenQuanYi Micro Hei", "Pingfang SC", sans-serif;
}
.mb-screen.others .widget {
  cursor: default;
}
.mb-screen.others input,
.mb-screen.others textarea {
  cursor: text;
}
.mb-screen.others .clickable,
.mb-screen.others .iOS-Switch,
.mb-screen.others .Android-Switch,
.mb-screen.others .iOS-Check,
.mb-screen.others .Android-Check,
.mb-screen.others .Android-Radio {
  cursor: pointer;
}

._38-tXAYs8SyeFiNeAicHOH {
  position: absolute;
  pointer-events: none;
  background-size: cover;
  z-index: 4;
  top: -114px;
  left: -30px;
  width: 435px;
  height: 888px;
  background-image: url(./iphone_7.png);
}
._38-tXAYs8SyeFiNeAicHOH.default {
  top: -12px;
  left: -12px;
  right: -12px;
  bottom: -12px;
  border: 1px dashed #d9d9d9;
  background-color: rgba(255, 255, 255, 0.5);
  z-index: -1;
}
._38-tXAYs8SyeFiNeAicHOH.default::after {
  content: "";
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  border: 1px solid #d9d9d9;
}

#sticky-container {
  overflow: visible;
  position: absolute;
  top: 0;
  left: 0;
  height: 0;
  z-index: 200;
}

#sticky-container > div {
  overflow: visible;
  position: relative;
  top: 0;
  left: 0;
  height: 0;
}

#sticky-container .sticky {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}

#sticky-container .sticky .arrow {
  pointer-events: none;
}

/* 批注hover时, 链接线高亮 */

#sticky-container .sticky:hover .sideline,
#sticky-container .sticky:hover .arrow {
  opacity: 0.7;
}

.splash {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  overflow: hidden;
  margin-bottom: 500px;
  top: 0;
  z-index: 2;
}
.splash img {
  position: absolute;
  width: 100%;
  height: 100%;
}
.splash .loading {
  position: absolute;
  top: 50%;
  width: 100%;
  height: 30px;
  text-align: center;
}
.landscape .splash img {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
  -webkit-transform-origin: bottom left;
  transform-origin: bottom left;
}

.iOS-StatusBar {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0.5em;
  width: 100%;
  height: 100%;
}
.iOS-StatusBar .StatusBarSignal {
  margin-right: 0.25em;
}
.iOS-StatusBar .StatusBarWifi {
  margin-left: 0.25em;
  margin-right: auto;
}
.iOS-StatusBar .StatusBarBattery {
  margin-left: auto;
}
.iOS-StatusBar .StatusBarTime {
  position: absolute;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
}

.nav_bar {
  font-size: 18px;
  height: 45px;
  width: 100%;
  top: 0;
  left: 0;
  background: #f8f8f8;
  color: #101010;
  z-index: 4;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid transparent;
}
.navigation_bar span,
.nav_bar span {
  white-space: nowrap;
}

.image_view {
  position: absolute;
  z-index: 3;
  overflow: hidden;
  color: #bec2c9;
  border-style: solid;
}
.image_view.highlight span,
.image_view.highlight .wrapper {
  opacity: 0.5;
}

.image-wrapper {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  transition: inherit;
}
.image-wrapper span {
  background: #e8e8e8;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: inherit;
}
.image-wrapper span i {
  font-size: 26px;
}
.image-wrapper span .icon {
  color: #8d9ea7;
}
.image-wrapper .wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: inherit;
  transition: inherit;
}
.image-wrapper .wrapper img {
  width: 100%;
  border-radius: inherit;
  transition: inherit;
  pointer-events: none;
}
.wrapper-mask {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
}
.wrapper-window {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 12;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  &-main {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80%;
    height: 60%;
    &-img {
      display: inline-block;
      max-height: 100%;
      margin-bottom: 20px;
    }
  }
}
</style>
