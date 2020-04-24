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

// 网站信息模块
const studentManageRouter = {
  path: '/student-manage',
  component: Layout,
  redirect: 'noredirect',
  name: 'StudentManage',
  alwaysShow: true,
  meta: {
    title: 'studentManage',
    icon: 'student-manage',
    noCache: false,
    breadcrumb: true,
  },
  children: [{
    // 学员列表
    path: 'list',
    component: () => import('@/views/student/list.vue'),
    name: 'StudentList',
    meta: {
      roles: ['stu:list:select'],
      title: 'studentList',
      noCache: false,
      breadcrumb: true,
    },
  },
  {
    // 学员列表 - 通讯录详情
    path: 'list/details/:id',
    component: () => import('@/views/student/list-details.vue'),
    name: 'StudentListDetails',
    hidden: true,
    meta: {
      roles: ['stu:contacts:select'],
      title: 'studentDetails',
      noCache: false,
      breadcrumb: true,
    },
  },
  {
    // 学员笔记
    path: 'notes',
    component: () => import('@/views/student/notes.vue'),
    name: 'NotesList',
    meta: {
      roles: ['stu:note:select'],
      title: 'notesList',
      noCache: false,
      breadcrumb: true,
    },
  },
  {
    // 笔记详情
    path: 'notes/details/:id',
    component: () => import('@/views/student/notes-details.vue'),
    name: 'NotesDetails',
    hidden: true,
    meta: {
      roles: ['stu:note:select'],
      title: 'notesDetails',
      noCache: false,
      breadcrumb: true,
    },
  },
  {
    // 消息模板 - 列表
    path: 'message-templates',
    component: () => import('@/views/student/message-templates.vue'),
    name: 'StudentMessageTemplates',
    meta: {
      roles: ['stu:mt:select'],
      title: 'messageTemplateManage',
      noCache: false,
      breadcrumb: true,
    },
  },
  {
    // 消息模板 - 新建
    path: 'message-templates/add',
    component: () => import('@/views/student/message-templates-add.vue'),
    name: 'StudentMessageTemplatesAdd',
    hidden: true,
    meta: {
      roles: ['stu:mt:save'],
      title: 'addMessageTemplate',
      noCache: false,
      breadcrumb: true,
    },
  },

  {
    // 消息模板 - 编辑
    path: 'message-templates/edit/:id',
    component: () => import('@/views/student/message-templates-edit.vue'),
    name: 'StudentMessageTemplatesEdit',
    hidden: true,
    meta: {
      roles: ['stu:mt:update'],
      title: 'editMessageTemplate',
      noCache: false,
      breadcrumb: true,
    },
  },

  {
    // 消息管理 - 手动推送
    path: 'messages',
    component: () => import('@/views/student/messages.vue'),
    name: 'StudentMessages',
    meta: {
      roles: ['stu:mn:select'],
      title: 'messageContent',
      noCache: false,
      breadcrumb: true,
    },
  },

  {
    // 消息 - 新建
    path: 'messages/add',
    component: () => import('@/views/student/messages-add.vue'),
    name: 'StudentMessagesAdd',
    hidden: true,
    meta: {
      roles: ['stu:mn:send'],
      title: 'messageSend',
      noCache: false,
      breadcrumb: true,
    },
  },
  {
    // 具体消息 - 编辑
    path: 'messages/edit/:id',
    component: () => import('@/views/student/messages-edit.vue'),
    name: 'StudentMessagesEdit',
    hidden: true,
    meta: {
      roles: ['stu:mn:update'],
      title: 'editMessage',
      noCache: false,
      breadcrumb: true,
    },
  },
  {
    // 消息管理 - 自动推送
    path: 'messages/autopush',
    component: () => import('@/views/student/message-auto-notice.vue'),
    name: 'massageAutoPush',
    meta: {
      roles: ['stu:mn:select'],
      title: 'massageAutoPush',
      noCache: false,
      breadcrumb: true,
    },
  },
  ],
};

export default studentManageRouter;
