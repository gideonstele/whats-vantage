import { createExternalState } from '@hooks/create-external-store';
import { StorageAttachmentPerTimeLimit } from '@services/storage/settings';

export const [attachmentPerTimeLimit, useAttachmentPerTimeLimit] = createExternalState(
  StorageAttachmentPerTimeLimit.fallback,
  async () => {
    return await StorageAttachmentPerTimeLimit.getValue();
  },
);

export const initDailyUsedListener = async () => {
  StorageAttachmentPerTimeLimit.watch((value) => {
    attachmentPerTimeLimit.update(value);
  });
};
