import type { Config, contact } from '@wppconnect/wa-js';
import * as WPP from '@wppconnect/wa-js';

import { NoUndefined } from '../utils';

declare global {
  interface Window {
    WPP: typeof WPP;
    WPPConfig: Config;
  }
}

export type ContactModel = Awaited<ReturnType<typeof contact.list>>[number];

export type GroupModel = Awaited<ReturnType<typeof WPP.group.getAllGroups>>[number];

export type GroupMemberModel = Awaited<ReturnType<typeof WPP.group.getParticipants>>[number];

export type BusinessProfileModel = Awaited<ReturnType<typeof WPP.contact.getBusinessProfile>>;

export type AvailableGroupModel = NoUndefined<GroupModel>;

export type Wid = WPP.whatsapp.Wid;

export interface WidObject {
  user: string;
  server: string;
  _serialized: string;
}

export interface GroupInfo {
  id: string;
  name: string;
}

export interface FormattedContact {
  userhash?: string;
  /**
   * use id._serialized as id
   */
  id: string;
  isMyContact?: boolean;
  isBusiness?: boolean;
  isBroadcast?: boolean;
  isConsumer?: boolean;
  isGroup?: boolean;
  isManualAdded?: boolean;
  avatar?: string;
  phoneNumber?: string;
  server?: string;
  name: string;
  wid?: WidObject;
  groups?: GroupInfo[];
}

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

export interface MessageLogItem {
  id: number;
  contact: FormattedContact;
  message: string;
  createdAt: number;
  attachmentCount?: number;
  success?: boolean;
  reason?: string;
}

export interface ImportedGroupItem {
  id: string;
  name?: string;
  inviteLink: string;
  site?: string;
  description?: string;
  dataSource?: string;
}

export interface StatisticsItem {
  successed: number;
  failed: number;
}
