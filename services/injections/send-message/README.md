# SendMessageService

WhatsApp消息发送服务，提供批量发送文本和附件消息的能力。

## 功能特性

- 支持批量发送文本消息和附件
- 支持定时发送功能
- 支持Mustache模板渲染，可插入动态内容
- 消息发送间隔随机化，避免被检测为机器人
- 完整的发送状态跟踪和统计
- 提供发送限制验证（如每日最大发送量）

## 主要流程

```
start → setCurrentItem → processCurrentItem → sendSingleText/sendSingleAttachment → finishSend → setCurrentToSuccess/setCurrentToError → notifyUpdate → setCurrentItem
```

## 使用方法

### 初始化

```typescript
// 获取SendMessageService实例
const sendMessageService = SendMessageService.getInstance(messageSender);
```

### 发送消息

```typescript
// 发送消息
const response = await sendMessageService.start(
  "Hello {{currentUser.username}}! The time is {{common.currentTime}}.", // 消息内容（支持Mustache模板）
  [file1, file2], // 附件文件（Blob数组）
  contacts, // 联系人列表
  settings, // 发送设置
  "15:30" // 可选的定时发送时间（HH:mm格式）
);

// 处理响应
if (response.type === 'error') {
  console.error("发送失败:", response.message);
} else if (response.type === 'scheduled') {
  console.log("消息已安排定时发送");
} else {
  console.log("消息发送中");
}
```

### 停止发送

```typescript
// 停止消息发送
sendMessageService.stop();
```

## 核心方法说明

| 方法 | 描述 |
| ---- | ---- |
| `start(content, files, contacts, settings, delayTime?)` | 启动消息发送任务，支持定时发送 |
| `stop()` | 停止消息发送任务 |
| `setCurrentItem()` | 设置当前处理项，从队列中取出下一个待发送项 |
| `validateSendMessage()` | 验证消息发送是否符合限制条件 |
| `processCurrentItem()` | 处理当前发送项，控制发送延迟 |
| `sendSingleText()` | 发送单条文本消息 |
| `sendSingleAttachment()` | 发送单个附件 |

## 消息模板变量

发送的文本消息支持以下变量：

```
{{currentUser.username}} - 联系人名称
{{currentUser.phoneNumber}} - 联系人电话号码
{{currentUser.callname}} - 联系人称呼名称
{{common.currentTime}} - 当前时间（HH:mm格式）
{{common.currentDate}} - 当前日期（YYYY-MM-DD格式）
```

## 返回类型

### SendMessageResponse

```typescript
type SendMessageResponse = 
  | { type: 'processing' } // 消息发送中
  | { type: 'scheduled' } // 已安排定时发送
  | { type: 'error', message: string } // 发送失败，包含错误信息
```

## 事件通知

服务会向content scripts发送以下事件：

- `content-scripts:send-message:update-all` - 发送状态更新
- `content-scripts:send-message:complete` - 任务完成
- `content-scripts:send-message:scheduled` - 任务已被安排定时发送
- `content-scripts:send-message:add-statistics` - 添加统计信息 