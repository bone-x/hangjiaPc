const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  roles: state => state.user.roles,
  role: state => state.user.role,
  setting: state => state.user.setting,
  permission_routers: state => state.permission.routers,
  sidebar_routers: state => {
    // 排除菜单栏无可显示的子节点时也渲染的情况
    const routes = [];
    state.permission.routers.forEach(item => {
      if (item.hidden) {
        routes.push(item);
      } else {
        let isPush = true;
        if (item.children && item.children.length > 0) {
          isPush = item.children.some(i => !i.hidden);
        }

        if (isPush) routes.push(item);
      }
    });
    return routes;
  },
  addRouters: state => state.permission.addRouters,
  errorLogs: state => state.errorLog.logs,

};
export default getters;
