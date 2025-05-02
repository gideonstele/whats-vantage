# Menubar 组件群

Menubar 组件群提供了一套完整的菜单栏组件，用于构建应用程序的菜单界面。组件群包含了菜单栏、菜单、菜单项等多种组件，可以灵活组合使用。

## 组件结构示意图

```
【[文件]  [编辑]  [视图]  [帮助] <-- menu 菜单根节点 】<-- bar, 菜单栏的容器
                 |- ✔ 自动隐藏 <-- item[type="checkbox"], 菜单项，多选
                 |-   显示标题 <-- item[type="checkbox"], 菜单项，多选
                 |-   显示状态 <-- item[type="checkbox"], 菜单项，多选
                 |- --------- <-- item[type="separator"], 分隔符
                 |- 联系人管理 <-- item[type="submenu"], 菜单项，子菜单
                      |-   联系人列表 <-- item[type="leaf"], 菜单项，叶子节点
                      |-   创建聊天 <-- item[type="leaf"], 菜单项，叶子节点
                 |- · 居中  <-- item[type="radiogroup"], 菜单项，单选
                 |-   左对齐
                 |-   右对齐
                 |- 关闭<-- item[type="leaf"], 菜单项
                 |- 退出<-- item[type="leaf"], 菜单项
```

## 组件群成员

### 主要组件

1. **MenubarLayout** - 菜单栏的容器组件，用于包裹菜单根节点
2. **MenubarMenu** - 菜单根节点组件，用于包裹菜单项
3. **MenubarItem** - 菜单项组件，根据 type 属性渲染不同类型的菜单项
4. **MenubarSeparator** - 菜单分隔符组件

### 菜单项类型

| 类型 | 组件 | 描述 |
|------|------|------|
| leaf | MenubarLeafItem | 叶子节点，普通菜单项 |
| submenu | MenubarSubItem | 子菜单，点击后显示新的菜单 |
| checkbox | MenubarCheckboxGroup | 多选菜单项 |
| radio | MenubarRadioGroup | 单选菜单项 |
| separator | MenubarSeparator | 菜单分隔符 |

### 样式组件

组件群使用 `@emotion/styled` 和 `@radix-ui/react-menubar` 构建，提供了一系列样式化组件用于自定义外观：

- PrimitiveMenuBarRoot
- PrimitiveMenuBarTrigger
- PrimitiveMenuBarContent
- PrimitiveMenuBarItem
- 等等...

## 使用示例

### 基本菜单栏

```tsx
import { MenubarLayout, MenubarMenu, MenubarItem, MenubarSeparator } from 'components/menubar';

const BasicMenubar = () => {
  return (
    <MenubarLayout>
      <MenubarMenu header="文件">
        <MenubarItem type="leaf" label="新建" />
        <MenubarItem type="leaf" label="打开" />
        <MenubarSeparator />
        <MenubarItem type="leaf" label="保存" />
        <MenubarItem type="leaf" label="另存为" />
      </MenubarMenu>

      <MenubarMenu header="编辑">
        <MenubarItem type="leaf" label="复制" />
        <MenubarItem type="leaf" label="粘贴" />
        <MenubarItem type="leaf" label="剪切" />
      </MenubarMenu>
    </MenubarLayout>
  );
};
```

### 包含复杂菜单项的示例

```tsx
import { MenubarLayout, MenubarMenu, MenubarItem } from 'components/menubar';

const AdvancedMenubar = () => {
  return (
    <MenubarLayout>
      <MenubarMenu header="视图">
        <MenubarItem 
          type="checkbox" 
          label="自动隐藏" 
          checked={true} 
          onCheckedChange={(checked) => console.log('自动隐藏:', checked)} 
        />
        <MenubarItem 
          type="checkbox" 
          label="显示标题" 
          checked={false} 
          onCheckedChange={(checked) => console.log('显示标题:', checked)} 
        />
        <MenubarItem type="separator" />
        <MenubarItem 
          type="submenu" 
          label="联系人管理"
          subContent={
            <>
              <MenubarItem type="leaf" label="联系人列表" onClick={() => console.log('联系人列表')} />
              <MenubarItem type="leaf" label="创建聊天" onClick={() => console.log('创建聊天')} />
            </>
          }
        />
        <MenubarItem type="separator" />
        <MenubarItem 
          type="radio" 
          value="center"
          items={[
            { value: 'center', label: '居中' },
            { value: 'left', label: '左对齐' },
            { value: 'right', label: '右对齐' }
          ]}
          onValueChange={(value) => console.log('对齐方式:', value)}
        />
      </MenubarMenu>

      <MenubarMenu header="帮助">
        <MenubarItem type="leaf" label="关于" onClick={() => console.log('关于')} />
        <MenubarItem type="leaf" label="退出" onClick={() => console.log('退出')} />
      </MenubarMenu>
    </MenubarLayout>
  );
};
```

## 注意事项

1. 确保导入所有必要的组件和样式
2. 各类型菜单项具有不同的属性和事件处理方法
3. 使用 `MenubarSeparator` 组件来添加分隔线
4. 可以通过样式组件自定义外观 