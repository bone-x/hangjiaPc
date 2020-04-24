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

// 课程管理模块
const courseManageRouter = {
  path: '/course-manage',
  component: Layout,
  redirect: 'noredirect',
  name: 'CourseManage',
  alwaysShow: true,
  meta: {
    title: 'courseManage',
    icon: 'course-manage',
    noCache: false,
    breadcrumb: true,
  },
  children: [
    {
      // 课程档案
      path: 'record',
      component: () => import('@/views/course/record.vue'),
      name: 'CourseManageRecord',
      meta: {
        roles: ['course:record:select'],
        title: 'recordBroadcastCourse',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 讲师库列表
      path: 'teacher',
      component: () => import('@/views/course/teacher.vue'),
      name: 'CourseManageTeacher',
      meta: {
        roles: ['course:teacher:select'],
        title: 'teacherLibraryManage',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 课程目录 - 新增节
      path: 'record/add-dir/:id',
      component: () => import('@/views/course/record-dir.vue'),
      name: 'CoursesRecordDir',
      hidden: true,
      meta: {
        roles: ['course:record:input'],
        title: 'newSection',
        noCache: true,
        breadcrumb: true,
      },
    },
    {
      // 课程的目录
      path: 'lectures/:id',
      component: () => import('@/views/course/lecturers.vue'),
      name: 'CourseManageLecturers',
      hidden: true,
      meta: {
        roles: ['course:record:select'],
        title: 'courseCatalogue',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 课程资料
      path: 'comments/:id',
      component: () => import('@/views/course/comments.vue'),
      name: 'CourseManageComments',
      hidden: true,
      meta: {
        roles: ['course:record:select'],
        title: 'courseFiles',
        noCache: false,
        breadcrumb: true,
      },
    },
    {
      // 课程评价 - 编辑节
      path: 'comments/details/:id',
      component: () => import('@/views/course/comments-details.vue'),
      name: 'CourseManageCommentsDetails',
      hidden: true,
      meta: {
        roles: ['course:record:input'],
        title: 'modifySection',
        noCache: true,
        breadcrumb: true,
      },
    },
  ],
};

export default courseManageRouter;
