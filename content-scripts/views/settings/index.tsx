/* eslint-disable react-hooks/exhaustive-deps */
import { i18n } from '#i18n';

import { useEffect, useState } from 'react';

import { useAsyncEffect, useMemoizedFn } from 'ahooks';
import { Button, Flex, Form, InputNumber, Slider, Tooltip, Typography } from 'antd';
import { InfoIcon } from 'lucide-react';

import { useMessage } from '@hooks/use-message';
import { sendMessageToBackground } from '@services/background-messager';
import { onMessageFromBackgroundToContentScripts } from '@services/content-scripts-messager';
import { WppOptions } from 'types/options';

import { overwriteInputClassName, StyledSettingsWrapper } from './components/wrapper.styled';

export const SettingsView = () => {
  const [form] = Form.useForm<Required<WppOptions>>();

  const messageApi = useMessage();
  const [isSaving, setIsSaving] = useState(false);

  useAsyncEffect(async () => {
    const settings = await sendMessageToBackground('settings:all:get', undefined);
    if (settings) {
      console.log('settings', settings);
      form.setFieldsValue(settings);
    }
  }, [form]);

  useEffect(() => {
    return onMessageFromBackgroundToContentScripts(
      'from-background:settings:daily-max-send-count:change',
      ({ data }) => {
        form.setFieldValue('dailySendMaxCount', data);
      },
    );
  }, [form]);

  useEffect(() => {
    return onMessageFromBackgroundToContentScripts(
      'from-background:settings:daily-max-join-group-count:change',
      ({ data }) => {
        form.setFieldValue('dailyJoinGroupMaxCount', data);
      },
    );
  }, [form]);

  useEffect(() => {
    return onMessageFromBackgroundToContentScripts(
      'from-background:settings:attachment-max-size:change',
      ({ data }) => {
        form.setFieldValue('attachmentMaxSize', data);
      },
    );
  }, [form]);

  useEffect(() => {
    return onMessageFromBackgroundToContentScripts(
      'from-background:settings:attachment-per-time-limit:change',
      ({ data }) => {
        form.setFieldValue('attachmentPerTimeLimit', data);
      },
    );
  }, [form]);

  useEffect(() => {
    return onMessageFromBackgroundToContentScripts(
      'from-background:settings:send-message-interval:change',
      ({ data }) => {
        form.setFieldValue('sendMessageInterval', data);
      },
    );
  }, [form]);

  const onFinish = useMemoizedFn(async (values: WppOptions) => {
    setIsSaving(true);
    await sendMessageToBackground('settings:all:save', values);
    setIsSaving(false);
    messageApi.success(i18n.t('REACTIONS.SAVE_SUCCESS'));
  });

  return (
    <StyledSettingsWrapper>
      <Form<WppOptions>
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label={i18n.t('MODULES.SETTINGS.DAILY_SEND_MAX_COUNT')}
          name="dailySendMaxCount"
        >
          <InputNumber
            min={1}
            max={200}
            step={1}
            precision={0}
            suffix="条/天"
            className={overwriteInputClassName}
          />
        </Form.Item>
        <Form.Item
          label={i18n.t('MODULES.SETTINGS.DAILY_JOIN_GROUP_MAX_COUNT')}
          name="dailyJoinGroupMaxCount"
        >
          <InputNumber
            min={1}
            max={100}
            step={1}
            precision={0}
            suffix={i18n.t('MODULES.SETTINGS.DAILY_SEND_MAX_COUNT_SUFFIX')}
            className={overwriteInputClassName}
          />
        </Form.Item>
        <Form.Item label={i18n.t('MODULES.SETTINGS.SEND_MESSAGE_INTERVAL')}>
          <Flex gap={8}>
            <Form.Item
              name="sendMessageInterval"
              noStyle
            >
              <Slider
                style={{ width: '100%', maxWidth: '240px' }}
                range
                min={10}
                max={60}
                step={1}
              />
            </Form.Item>
            <Tooltip title={i18n.t('MODULES.SETTINGS.SEND_MESSGAE_INTERVAL_TOOLTIPS')}>
              <Button
                variant="link"
                color="primary"
                icon={<InfoIcon />}
              >
                为什么需要随机的时间间隔？
              </Button>
            </Tooltip>
          </Flex>
          <Typography.Paragraph type="secondary">
            {i18n.t('MODULES.SETTINGS.SEND_MESSGAE_INTERVAL_TOOLTIPS')}
          </Typography.Paragraph>
        </Form.Item>
        <Form.Item
          label={i18n.t('MODULES.SETTINGS.ATTACHMENT_MAX_SIZE')}
          name="attachmentMaxSize"
        >
          <InputNumber
            min={1}
            max={10240}
            step={1}
            precision={0}
            suffix="KB"
            className={overwriteInputClassName}
          />
        </Form.Item>
        <Form.Item
          label={i18n.t('MODULES.SETTINGS.ATTACHMENT_PER_TIME_LIMIT')}
          name="attachmentPerTimeLimit"
        >
          <InputNumber
            min={1}
            max={10}
            step={1}
            className={overwriteInputClassName}
          />
        </Form.Item>
        <Form.Item>
          <Flex justify="flex-end">
            <Button
              type="primary"
              htmlType="submit"
              loading={isSaving}
            >
              {i18n.t('ACTIONS.SAVE')}
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </StyledSettingsWrapper>
  );
};
