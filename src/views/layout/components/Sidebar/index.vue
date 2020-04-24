<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :default-active="$route.path"
      :collapse="isCollapse"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      mode="vertical"
    >
      <div class="logo">行家管理后台</div>
      <sidebar-item
        v-for="route in sidebar_routers"
        :key="route.path"
        :item="route"
        :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex';
import SidebarItem from './SidebarItem';
import variables from '@/styles/variables.scss';

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'sidebar_routers',
      'sidebar',
    ]),
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
};
</script>
<style lang="less">
.logo {
  width: 100%;
  height: 82px;
  line-height: 82px;
  font-size: 22px;
  color: #fff;
  text-align: center;
  background-color: rgb(48, 65, 86);
}
</style>
