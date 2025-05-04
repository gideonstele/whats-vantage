import { ChangeEventHandler, useState } from 'react';

import { useMemoizedFn } from 'ahooks';

import { useMessage } from '@hooks/use-message';
import { sendMessageToWppInjected } from '@services/injected-messager';

import { PhoneButton, PhoneNumberInput, TextInputLine } from '../components/common.styled';

import { AccountValidateRecord } from './components/record';
import { useAccountValidateRecord } from './provider';

export const AccountValidateView = () => {
  const messageApi = useMessage();

  const [isPending, setIsPending] = useState<boolean>(false);

  const [accountId, setAccountId] = useState<string>('');
  const { addAccountValidateRecord } = useAccountValidateRecord();

  const handleChange = useMemoizedFn<ChangeEventHandler<HTMLInputElement>>((e) => {
    setAccountId(e.target.value);
  });

  const handleValidate = useMemoizedFn(async () => {
    setIsPending(true);
    const res = await sendMessageToWppInjected('injected:validate-account', accountId);
    if (res.exists) {
      messageApi.success('账号存在');
    } else {
      messageApi.error('账号不存在');
    }
    addAccountValidateRecord({
      id: res.id || accountId,
      phone: res.phoneNumber || accountId,
      isExists: res.exists,
    });
    setIsPending(false);
  });

  return (
    <>
      <TextInputLine>
        <PhoneNumberInput
          type="text"
          placeholder="请输入待校验whatsapp账号"
          value={accountId}
          onChange={handleChange}
        />
        <PhoneButton
          isLoading={isPending}
          onClick={handleValidate}
        >
          校验
        </PhoneButton>
      </TextInputLine>
      <AccountValidateRecord />
    </>
  );
};
