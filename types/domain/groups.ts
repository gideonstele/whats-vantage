import { WidObject } from './contacts';

export interface FormattedGroup {
  /**
   * use id._serialized as id
   */
  id: string;
  name: string;
  memberCount?: number;
  avatar?: string;
  wid?: WidObject;
}

export interface PushGroupsMessage {
  success: boolean;
  data?: FormattedGroup[];
  message?: string;
}
