import request from '@/utils/request';


//  账户管理
// eslint-disable-next-line import/prefer-default-export
export function getAccountList(params) {
  return request({
    url: '/expert/sys/user/listPage',
    method: 'get',
    params,
  });
}

//  账户查询
export function queryAccountList(data) {
  return request({
    url: '/expert/sys/user/listPage',
    method: 'post',
    data,
  });
}

// 根据id获取用户信息(修改操作获取数据)
export function getUserdata(params) {
  return request({
    url: `/expert/sys/user/${params.userId}`,
    method: 'get',
  });
}

// 修改用户的角色下拉列表(所有的)
export function getChangerolelist(params) {
  return request({
    url: '/expert/sys/role/drop/all',
    method: 'get',
    params,
  });
}

//  账户修改
export function changeAccountList(data) {
  return request({
    url: '/expert/sys/user',
    method: 'put',
    data,
  });
}

//  账户新建
export function createdAccountList(data) {
  return request({
    url: '/expert/sys/user',
    method: 'post',
    data,
  });
}

//  账户删除
export function deleteAccountList(params) {
  return request({
    url: `/expert/sys/user/${params.userId}`,
    method: 'delete',
  });
}

// 日志列表
export function getlogList(params) {
  return request({
    url: '/expert/sys/log/listPage',
    method: 'get',
    params,
  });
}

// 日志查询
export function querylogList(data) {
  return request({
    url: '/expert/sys/log/listPage',
    method: 'post',
    data,
  });
}

// 黑名单列表&&查询
export function getBlackList(params) {
  return request({
    url: '/expert/sys/ipBlacklist/listPage',
    method: 'get',
    params,
  });
}

// 黑名单添加
export function addBlackList(data) {
  return request({
    url: '/expert/sys/ipBlacklist/save',
    method: 'post',
    data,
  });
}

// 黑名单删除
export function delBlackList(params) {
  return request({
    url: `/expert/sys/ipBlacklist/deleteByIdList/${params.ipList}`,
    method: 'delete',
  });
}

// 黑名单批量删除
export function delmulblackList(params) {
  return request({
    url: `/expert/sys/ipBlacklist/deleteByIdList/${params.newStr}`,
    method: 'delete',
  });
}

// 黑名单-屏蔽详情列表
export function getclearBlackList(params) {
  return request({
    url: '/expert/sys/sysShielDetail/listPage',
    method: 'get',
    params,
  });
}

// 黑名单-屏蔽详情列表导出
export function getclearListexcel(params) {
  return request({
    url: '/expert/sys/sysShielDetail/exportList',
    method: 'get',
    params,
  });
}

// 角色管理列表
export function getRoleList(params) {
  return request({
    url: '/expert/sys/role/listPage',
    method: 'get',
    params,
  });
}

// 角色管理列表的查询
export function queryRoleList(data) {
  return request({
    url: '/expert/sys/role/listPage',
    method: 'post',
    data,
  });
}

// 角色管理列表的新增
export function createdRoleList(data) {
  return request({
    url: '/expert/sys/role',
    method: 'post',
    data,
  });
}
// 角色管理列表的删除
export function delRoleList(params) {
  return request({
    url: `/expert/sys/role/${params.userId}`,
    method: 'delete',
  });
}
// 角色管理列表的修改
export function changeRoleList(data) {
  return request({
    url: '/expert/sys/role',
    method: 'put',
    data,
  });
}

// 菜单权限
export function getmenuRole(params) {
  return request({
    url: '/expert/sys/menu/tree',
    method: 'get',
    params,
  });
}

// 可用角色
export function getRole(params) {
  return request({
    url: '/expert/sys/role/tree',
    method: 'get',
    params,
  });
}

// 根据id请求修改列表
export function getChangeroledata(params) {
  return request({
    url: `/expert/sys/role/${params.roleId}`,
    method: 'get',
  });
}

// 系统配置列表的查询
export function systemSetting(params) {
  return request({
    url: 'expert/sys/config/listPage',
    method: 'get',
    params,
  });
}

// 系统配置添加
export function addSystemConfig(data) {
  return request({
    url: 'expert/sys/config',
    method: 'post',
    data,
  });
}

// 系统配置删除
export function deleteSystemConfig(params) {
  return request({
    url: `expert/sys/config/${params}`,
    method: 'delete',
  });
}

// 系统配置 - 编辑详情
export function editSystemConfig(params) {
  return request({
    url: `expert/sys/config/${params}`,
    method: 'get',
  });
}

// 系统配置 - 更新/编辑配置目录
export function updateSystemConfig(data) {
  return request({
    url: 'expert/sys/config',
    method: 'put',
    data,
  });
}

// 配置值下拉列表
export function systemValue(params) {
  return request({
    url: `expert/sys/config/info/${params}`,
    method: 'get',
  });
}

// 添加配置值
export function addSystemConfigValue(data) {
  return request({
    url: 'expert/sys/config/info',
    method: 'post',
    data,
  });
}

// 更新配置值
export function updateSystemConfigValue(data) {
  return request({
    url: 'expert/sys/config/info',
    method: 'put',
    data,
  });
}

// 删除配置值
export function deleteConfigValue(params) {
  return request({
    url: `expert/sys/config/info/${params}`,
    method: 'delete',
  });
}

// 获取数据类型
export function systemConfigType(params) {
  return request({
    url: 'expert/sys/dict/find/DATA_TYPE',
    method: 'get',
    params,
  });
}

// 数字字典列表查询
export function dictionaryList(params) {
  return request({
    url: 'expert/sys/dict/dir/listPage',
    method: 'get',
    params,
  });
}

// 添加字典
export function addDigitalDictionary(data) {
  return request({
    url: 'expert/sys/dict/dir',
    method: 'post',
    data,
  });
}

// 更新字典（编辑后提交）
export function updateDictionary(data) {
  return request({
    url: 'expert/sys/dict/dir',
    method: 'put',
    data,
  });
}

// 删除字典
export function deleteDictionary(params) {
  return request({
    url: `expert/sys/dict/dir/${params}`,
    method: 'delete',
  });
}

// 点击编辑字典（用与查看详情或数据回显）
export function editDigitalDictionary(params) {
  return request({
    url: `expert/sys/dict/dir/${params}`,
    method: 'get',
  });
}

// 点击字典列表编辑获取列表
export function editDictionaryList(params) {
  return request({
    url: 'expert/sys/dict/listPage',
    method: 'get',
    params,
  });
}

// 添加字典值
export function addDictionarySubmit(data) {
  return request({
    url: 'expert/sys/dict',
    method: 'post',
    data,
  });
}

// 提交修改具体字典值
export function fixDictionaryValue(data) {
  return request({
    url: 'expert/sys/dict',
    method: 'put',
    data,
  });
}

// 删除具体字典值
export function deleteDictionaryDetail(params) {
  return request({
    url: `expert/sys/dict/${params}`,
    method: 'delete',
  });
}

// 点击编辑字典值获取单条数据
export function editDictionaryValue(params) {
  return request({
    url: `expert/sys/dict/${params}`,
    method: 'get',
  });
}

// 菜单列表查询
export function getMenuList(params) {
  return request({
    url: '/expert/sys/menu/tree',
    method: 'get',
    params,
  });
}

// 菜单列表删除
export function delMenu(params) {
  return request({
    url: `expert/sys/menu/${params}`,
    method: 'delete',
  });
}


// 菜单新增
export function updateMenu(data) {
  return request({
    url: '/expert/sys/menu/',
    method: 'post',
    data,
  });
}


// 根据id查询菜单
export function queryById(params) {
  return request({
    url: `expert/sys/menu/${params}`,
    method: 'get',
  });
}

// 菜单新增
export function editMenu(data) {
  return request({
    url: '/expert/sys/menu/',
    method: 'put',
    data,
  });
}
