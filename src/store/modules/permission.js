import { asyncRouterMap, constantRouterMap } from '@/router';

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role));
  }
  return true;
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, roles) {
  const res = [];

  routes.forEach((route) => {
    const tmp = { ...route };
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, roles);
      }
      res.push(tmp);
    }
  });

  return res;
}

const permission = {
  state: {
    routers: [],
    addRouters: [],
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    },
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise((resolve) => {
        const { roles, role } = data;
        let accessedRouters;
        // TODO 上线阶段要移除
        if (role === 'superAdmin') {
          accessedRouters = asyncRouterMap;
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles);
        }
        // const accessedRouters = filterAsyncRouter(asyncRouterMap, roles);
        // 如果没有子节点则默认不显示根节点，除非在路由meta中明确noRequireChildren = true
        const accessedRoutersFilter = accessedRouters.filter((route) => {
          if ((route.children && route.children.length > 0) || (route.meta && route.meta.noRequireChildren)) return true;
          return false;
        });
        commit('SET_ROUTERS', accessedRoutersFilter);
        resolve();
      });
    },
  },
};

export default permission;
