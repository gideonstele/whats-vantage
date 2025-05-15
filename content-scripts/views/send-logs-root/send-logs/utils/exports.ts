import dayjs from 'dayjs';
import { omit } from 'lodash-es';

import { SendLogItem } from 'types/domain/send-logs';

import { exportExcel } from 'extend-excel';

const exportMessageLogHeader: Record<
  keyof Pick<SendLogItem, 'createdAt' | 'success' | 'reason' | 'message' | 'attachmentCount' | 'contact'>,
  string
> = {
  createdAt: '发送时间',
  success: '是否成功',
  reason: '失败原因',
  message: '消息',
  attachmentCount: '附件数量',
  contact: '联系人',
};

export function exportMessageLogs(messageLogs: SendLogItem[]) {
  const data = messageLogs.map((messageLog) => {
    return {
      contact: messageLog.contact.name,
      success: messageLog.success ? '成功' : '失败',
      createdAt: dayjs(messageLog.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      ...omit(messageLog, ['id', 'createdAt', 'success', 'contact']),
    };
  });

  exportExcel(exportMessageLogHeader, data, {
    fileName: `WhatsApp_Message_Logs_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}`,
    XLSXOption: {
      cellStyles: true,
    },
  });
}
