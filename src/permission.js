import router from './router';
import store from './store';
import {
  Message,
} from 'element-ui';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import {
  getToken,
} from '@/utils/auth'; // getToken from cookie

NProgress.configure({
  showSpinner: false,
}); // NProgress Configuration

// permission judge function
function hasPermission(roles, permissionRoles) {
  if (store.getters.role === 'superAdmin') return true;
  if (!permissionRoles) return true;
  return roles.some(role => permissionRoles.indexOf(role) >= 0);
}

// 查找动态路由，导航到第一个
function findFirstOpenRouterName(addRouters = []) {
  const addRoutersLen = addRouters.length;
  let name = '';

  for (let i = 0; i < addRoutersLen; i += 1) {
    const route = addRouters[i];
    if (route.children && route.children.length > 0) {
      const childrenRoutes = route.children.filter(r => !r.hidden);
      if (childrenRoutes.length > 0) {
        name = childrenRoutes[0].name;
        if (!childrenRoutes[0].meta) childrenRoutes[0].meta = {};
        childrenRoutes[0].meta.affix = true;
        break;
      }
    }
  }
  return name;
}

// 固定第一个路由
function affixFirstRoute(addRouters = []) {
  const addRoutersLen = addRouters.length;
  for (let i = 0; i < addRoutersLen; i += 1) {
    const route = addRouters[i];
    if (route.children && route.children.length > 0) {
      const childrenRoutes = route.children.filter(r => !r.hidden);
      if (childrenRoutes.length > 0) {
        if (!childrenRoutes[0].meta) childrenRoutes[0].meta = {};
        childrenRoutes[0].meta.affix = true;
        break;
      }
    }
  }
  return addRouters;
}

const whiteList = ['/login', '/auth-redirect']; // no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start(); // start progress bar
  if (getToken()) { // determine if there has token
    /* has token */
    if (to.path === '/login') {
      next({
        path: '/',
      });
      NProgress.done(); // if current page is dashboard will not trigger afterEach hook, so manually handle it
    } else if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
      store.dispatch('GetUserInfo').then((info) => { // 拉取user_info
        store.dispatch('GetUserPerm').then((res) => {
          const roles = res.result; // note: roles must be a array! such as: ['editor','develop']
          // if (process.env.NODE_ENV !== 'production') {
          //   checkPermList(roles, info.result.roleList[0].roleName);
          // }
          store.dispatch('GenerateRoutes', {
            roles,
            role: store.getters.role,
          }).then(() => { // 根据roles权限生成可访问的路由表
            const routes = affixFirstRoute(store.getters.addRouters);
            router.addRoutes(routes); // 动态添加可访问路由表
            if (to.path === '/') {
              // 在没有home主页的情况下，跳转到动态路由的第一个路径
              const firstOpenRouterName = findFirstOpenRouterName(routes);
              next({
                name: firstOpenRouterName,
                replace: true,
              });
            } else {
              next({
                ...to,
                replace: true,
              }); // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            }
          });
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err);
            next({
              path: '/',
            });
          });
        });
      }).catch((err) => {
        store.dispatch('FedLogOut').then(() => {
          Message.error(err);
          next({
            path: '/',
          });
        });
      });
    } else {
      // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
      if (hasPermission(store.getters.roles, to.meta.roles)) {
        if (to.path === '/') {
          // 在没有home主页的情况下，跳转到动态路由的第一个路径
          const firstOpenRouterName = findFirstOpenRouterName(store.getters.addRouters);
          next({
            name: firstOpenRouterName,
            replace: true,
          });
        } else {
          next();
        }
      } else {
        next({
          path: '/401',
          replace: true,
          query: {
            noGoBack: true,
          },
        });
      }
      // 可删 ↑
    }
  } else {
    /* has no token */
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next();
    } else {
      next(`/login?redirect=${to.path}`); // 否则全部重定向到登录页
      NProgress.done(); // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
});

router.afterEach(() => {
  window.scrollTo(0, 0);
  NProgress.done(); // finish progress bar
});
