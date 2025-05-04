import { browser } from '#imports';

import { logCommon as log } from '@debug';

import {
  ProcessedAccountInfo,
  ValidateAccountPayload,
  ValidateAccountResponse,
  ValidateAccountsPayload,
} from 'types/domain/send-message';

import { getContactName, simplifyUserId } from './contacts';

if ('runtime' in browser) {
  log.error('whatsapp validation:', 'validation is not supported in background / content script.');
}

// 处理输入参数为统一格式
const processContactInput = (contact: ValidateAccountPayload): ProcessedAccountInfo => {
  if (typeof contact === 'object') {
    const stringifyId = `${contact.phoneNumber}`;
    const formattedId = simplifyUserId(stringifyId);

    return {
      id: formattedId,
      phoneNumber: stringifyId,
      name: contact.name || stringifyId,
      ignoreValidate: !!contact.ignoreValidate,
    };
  }
  return {
    id: simplifyUserId(`${contact}`),
    phoneNumber: `${contact}`,
    name: `${contact}`,
    ignoreValidate: false,
  };
};

const processContactsInput = (contacts: ValidateAccountsPayload): ProcessedAccountInfo[] => {
  return contacts.map(processContactInput);
};

// 验证单个账号是否存在
export const validateAccount = async (contact: ValidateAccountPayload): Promise<ValidateAccountResponse> => {
  const item = processContactInput(contact);

  // 如果忽略验证，则直接返回联系人
  if (item.ignoreValidate) {
    return {
      ...item,
      exists: true,
      message: 'ignore validate',
    };
  }
  /**
   * 1. 调用  window.WPP.contact.get
   */

  const contactByGet = await window.WPP.contact.get(item.id).catch((e) => {
    log.error('whatsapp validation:', 'error when get contact by id', e);
    return undefined;
  });

  if (contactByGet) {
    return {
      id: contactByGet.id._serialized,
      exists: true,
      userhash: contactByGet.get('userhash'),
      phoneNumber: contactByGet.id.user || item.phoneNumber,
      name: getContactName(contactByGet),
      isBusiness: contactByGet.get('isBusiness'),
      message: 'contact found by get',
    };
  }

  /**
   * 2. 调用  window.WPP.contact.queryExists
   */

  const exists = await window.WPP.contact.queryExists(`${item.id}@c.us`).catch((e) => {
    log.error('whatsapp validation:', 'error when query exists by wid', e);
    return null;
  });

  if (exists) {
    return {
      id: exists.wid._serialized,
      exists: true,
      name: item.name,
      phoneNumber: exists.wid.user || item.phoneNumber,
      isBusiness: exists.biz,
      message: 'contact found by queryExists',
    };
  }

  // TODO: 3. 调用远程接口判断是否存在

  return {
    error: true,
    exists: false,
    id: item.id,
    name: item.name,
    phoneNumber: item.phoneNumber,
    message: 'contact not found',
  };
};

export const validateAccounts = async (contacts: ValidateAccountsPayload): Promise<ValidateAccountResponse[]> => {
  const processedContacts = processContactsInput(contacts);
  const results = await Promise.all(processedContacts.map(validateAccount));

  log.info('validateAccounts:', results);

  return results;
};
