import Layout from '@/views/layout/Layout';

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in sub-menu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
    affix: true                  if true, the tag will affix in the tags-view
  }
* */

// 系统模块
const systemManageRouter = {
  path: '/system-manage',
  component: Layout,
  redirect: 'noredirect',
  name: 'SystemManage',
  alwaysShow: true,
  meta: {
    title: 'systemManage',
    icon: 'system-manage',
    noCache: false,
    breadcrumb: true,
  },
  children: [
    {
      // 账户管理
      path: 'user',
      component: () => import('@/views/system/user.vue'),
      name: 'SystemUser',
      meta: {
        roles: ['sys:account:select'],
        title: 'accountManage',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 账户管理 - 添加用户
      path: 'user/add',
      component: () => import('@/views/system/user-add.vue'),
      name: 'SystemUserAdd',
      hidden: true,
      meta: {
        roles: ['sys:account:save'],
        title: 'accountAdd',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 账户管理 - 编辑用户
      path: 'user/edit/:id',
      component: () => import('@/views/system/user-edit.vue'),
      name: 'SystemUserEdit',
      hidden: true,
      meta: {
        roles: ['sys:account:update'],
        title: 'accountEdit',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 角色管理
      path: 'rules',
      component: () => import('@/views/system/rules.vue'),
      name: 'SystemRules',
      meta: {
        roles: ['sys:role:select'],
        title: 'userRulesManage',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 角色管理 - 添加角色
      path: 'rules/add',
      component: () => import('@/views/system/rules-add.vue'),
      name: 'SystemRulesAdd',
      hidden: true,
      meta: {
        roles: ['sys:role:save'],
        title: 'userRulesManageAdd',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 角色管理 - 编辑角色
      path: 'rules/edit/:id',
      component: () => import('@/views/system/rules-edit.vue'),
      name: 'SystemRulesEdit',
      hidden: true,
      meta: {
        roles: ['sys:role:update'],
        title: 'userRulesManageEdit',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // IP黑名单
      path: 'blacklist',
      component: () => import('@/views/system/blacklist.vue'),
      name: 'SystemBlacklist',
      meta: {
        roles: ['sys:ip:select'],
        title: 'IPBlacklist',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // IP黑名单 - 添加IP黑名单
      path: 'blacklist/add',
      component: () => import('@/views/system/blacklist-add.vue'),
      name: 'IPBlacklistAdd',
      hidden: true,
      meta: {
        roles: ['sys:ip:save'],
        title: 'IPBlacklistAdd',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 系统日志
      path: 'logs',
      component: () => import('@/views/system/logs.vue'),
      name: 'SystemLogs',
      meta: {
        roles: ['sys:log:select'],
        title: 'systemLogs',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 数字字典
      path: 'digital-dictionary',
      component: () => import('@/views/system/dictionary.vue'),
      name: 'DigitalDictionary',
      meta: {
        roles: ['sys:dict:info'],
        title: 'digitalDictionary',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 数字字典 - 编辑字典值
      path: 'digital-dictionary/value/:code',
      component: () => import('@/views/system/dictionary-value.vue'),
      name: 'DictionaryValueEdit',
      hidden: true,
      meta: {
        roles: ['sys:dict:update'],
        title: 'editDictionaryValue',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 配置
      path: 'system-config',
      component: () => import('@/views/system/config.vue'),
      name: 'SystemConfig',
      meta: {
        roles: ['sys:config:info'],
        title: 'systemConfig',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 配置 - 新建
      path: 'system-config/add',
      component: () => import('@/views/system/config-add.vue'),
      name: 'SystemConfigAdd',
      hidden: true,
      meta: {
        roles: ['sys:config:save'],
        title: 'addConfig',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 配置 - 编辑
      path: 'system-config/edit/:id',
      component: () => import('@/views/system/config-edit.vue'),
      name: 'SystemConfigEdit',
      hidden: true,
      meta: {
        roles: ['sys:config:update'],
        title: 'editConfig',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 配置 - 设置值
      path: 'system-config/value/:id',
      component: () => import('@/views/system/config-value.vue'),
      name: 'SystemConfigValue',
      hidden: true,
      meta: {
        roles: ['sys:config:info'],
        title: 'editConfigValue',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 菜单管理
      path: 'menu',
      component: () => import('@/views/system/menu.vue'),
      name: 'SystemMenu',
      meta: {
        roles: ['sys:menu:select'],
        title: 'systemMenu',
        noCache: false,
        breadcrumb: true,
      },
    },
  ],
};

export default systemManageRouter;
