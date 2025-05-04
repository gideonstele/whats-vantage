/**
 * 菜单栏组件，各部分示意图
 * 【[文件]  [编辑]  [视图]  [帮助] <-- menu 菜单根节点 】<-- bar, 菜单栏的容器
 *                   |- ✔ 自动隐藏 <-- item[type="checkbox"], 菜单项，多选
 *                   |-   显示标题 <-- item[type="checkbox"], 菜单项，多选
 *                   |-   显示状态 <-- item[type="checkbox"], 菜单项，多选
 *                   |- ---------  <-- item[type="separator"], 分隔符
 *                   |- 联系人管理 <-- item[type="submenu"], 菜单项，子菜单
 *                        |-   联系人列表 <-- item[type="leaf"], 菜单项，叶子节点
 *                        |-   创建聊天 <-- item[type="leaf"], 菜单项，叶子节点
 *                   |- · 居中  <-- item[type="radiogroup"], 菜单项，单选
 *                   |-   左对齐
 *                   |-   右对齐
 *                   |- 关闭<-- item[type="leaf"], 菜单项
 *                   |- 退出<-- item[type="leaf"], 菜单项
 */

// export * from './click-context';
export * from './components/bar';
export * from './components/item';
export * from './components/menu';
export { PrimitiveMenuBarSeparator as MenubarSeparator } from './components/styled';
export * from './components/theme';
