import { simplifyUserId } from '../helpers/contacts';
import { validateAccount } from '../helpers/validate-exists';
import { onMessageToWppInjected } from '../injected-messager';

export const initCreateChat = () => {
  onMessageToWppInjected('injected:create-chat', async ({ data: contactId }) => {
    const id = simplifyUserId(contactId);
    const existsResult = await validateAccount(id);

    if (!existsResult.exists) {
      return {
        success: false,
        message: '创建聊天失败，此号码的WhatsApp账号不存在',
      };
    }

    try {
      const result = await window.WPP.chat.openChatBottom(id);

      return result
        ? {
            success: result,
            data: id,
            message: '创建聊天成功',
          }
        : {
            success: false,
            message: '创建聊天失败',
          };
    } catch (e) {
      console.error('[sw:wpp:injected:create-chat] get error', e);
      return {
        success: false,
        message: `创建对话时产生一个错误: ${e}`,
      };
    }
  });
};
