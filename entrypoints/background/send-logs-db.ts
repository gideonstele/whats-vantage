import { onMessageToBackground } from '@services/background-messager';
import { SendLogService } from '@services/db';

export const initSendLogsDbService = () => {
  const sendLogService = SendLogService.mount();

  onMessageToBackground('db:send-logs:list', async ({ data: payload }) => {
    if (!payload) {
      return await sendLogService.listSendLogs();
    }

    const { offset, limit, orderBy, searchs } = payload;

    return await sendLogService.listSendLogs(offset, limit, orderBy, searchs);
  });

  onMessageToBackground('db:send-logs:item', async ({ data: payload }) => {
    return await sendLogService.getLog(payload);
  });

  onMessageToBackground('db:send-logs:add', async ({ data: payload }) => {
    return await sendLogService.addSendLog(payload);
  });

  onMessageToBackground('db:send-logs:update', async ({ data: payload }) => {
    return await sendLogService.updateSendLog(payload.id, payload.item);
  });

  onMessageToBackground('db:send-logs:delete', async ({ data: payload }) => {
    return await sendLogService.deleteLog(payload);
  });

  onMessageToBackground('db:send-logs:bulk-delete', async ({ data: payload }) => {
    return await sendLogService.bulkDeleteLogs(payload);
  });

  onMessageToBackground('db:send-logs:clear', async () => {
    return await sendLogService.clearLogs();
  });
};
