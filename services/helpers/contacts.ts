import { isNil } from 'lodash-es';

import {
  AvailableGroupModel,
  BusinessProfileModel,
  ContactModel,
  FormattedContact,
  GroupMemberModel,
  GroupModel,
} from 'types/domain/contacts';
import { FormattedGroup } from 'types/domain/groups';

export function filterAvailableUserContacts(contacts: ContactModel[]) {
  return contacts.filter((contact) => {
    try {
      const isAvailable = [
        !isNil(contact.id.user),
        !contact.get('isMe'),
        !contact.get('isBlocked'),
        !contact.get('isGroup'),
        contact.id.server !== 'lid',
        contact.get('isMyContact'),
      ].every(Boolean);

      // const isAvailableCondition2 = [contact.get('isMyContact')].some(Boolean);

      return isAvailable;
    } catch (e) {
      console.error('[sw:wpp:utils:contacts] filterAvailableUserContacts error', e);
      return false;
    }
  });
}

export function simplifyUserId(id: string, forcePrefixPlus = false) {
  let pureNumber = id.replaceAll(/[^0-9]/g, '');

  if (pureNumber.startsWith('0')) {
    pureNumber = `86${pureNumber.slice(1)}`;
  }

  return forcePrefixPlus ? (pureNumber.startsWith('+') ? pureNumber : `+${pureNumber}`) : pureNumber;
}

export const generateContactWidByPhoneNumber = (phoneNumber: string) => {
  const stringifyId = `${phoneNumber}`;
  const formattedId = simplifyUserId(stringifyId);

  return {
    wid: {
      _serialized: `${formattedId}@c.us`,
      user: formattedId,
      server: 'c.us',
    },
    phoneNumber: stringifyId,
    name: stringifyId,
  };
};

export const filterAvailableGroups = (groups: GroupModel[]) => {
  return groups.filter(
    (group) => group && group.get('isGroup') && group.get('shouldAppearInList'),
  ) as AvailableGroupModel[];
};

const getPhoneNumberFromId = (id: ContactModel['id']) => {
  return id.user.replace('@c.us', '');
};

function getAvatarUrlByName(name?: string) {
  const url = new URL('https://ui-avatars.com/api/');
  url.searchParams.set('name', name || 'ND');
  url.searchParams.set('size', '64');
  url.searchParams.set('background', 'random');
  url.searchParams.set('rnd', Math.random().toString().substring(2, 15));
  return url.toString();
}

export const isAvailablePhoneNumber = (phoneNumber?: string) => {
  if (!phoneNumber) return false;
  const pureNumber = phoneNumber.replace(/\s/g, '');
  return /^[0-9\+]+$/.test(pureNumber);
};

export const getContactName = (contact: ContactModel) => {
  const name =
    contact.get('notifyName') ||
    contact.verifiedName ||
    contact.name ||
    contact.get('pushname') ||
    contact.get('searchName') ||
    contact.get('formattedName') ||
    contact.get('formattedUser') ||
    contact.get('verifiedName') ||
    getPhoneNumberFromId(contact.id);

  return name;
};

export const getContactNameFromBusinessProfile = (businessProfile: BusinessProfileModel) => {
  const name = businessProfile.get('proxyName');
  return name;
};

export function formatContact(contact: ContactModel, profilePictureUrl?: string | null): FormattedContact {
  const name = getContactName(contact);
  const headerName = contact.get('header') || contact.name || getPhoneNumberFromId(contact.id);
  const formattedPhone = contact.get('formattedPhone');

  return {
    id: contact.id.user,
    userhash: contact.get('userhash'),
    server: contact.id.server,
    isMyContact: contact.get('isMyContact'),
    isBusiness: contact.get('isBusiness'),
    isManualAdded: false,
    avatar: profilePictureUrl ?? getAvatarUrlByName(headerName),
    phoneNumber: isAvailablePhoneNumber(formattedPhone) ? formattedPhone : getPhoneNumberFromId(contact.id),
    name: name,
    wid: contact.id,
  };
}

export const formatWithProfilePictureUrl = async (contacts: ContactModel[]): Promise<FormattedContact[]> => {
  const wpp = window.WPP;

  const formattedContacts: FormattedContact[] = [];

  for (const contact of contacts) {
    const id = contact.id._serialized;

    try {
      // console.debug('[sw:wpp:utils:contacts] formatWithProfilePictureUrl::getProfilePictureUrl', id);
      const url = await wpp.contact.getProfilePictureUrl(id);
      formattedContacts.push(formatContact(contact, url));
    } catch (_e) {
      formattedContacts.push(formatContact(contact));
      // console.error('[sw:wpp:utils:contacts] formatWithProfilePictureUrl::getProfilePictureUrl error', e);
    }
  }

  return formattedContacts;
};

export const formatGroup = (group: AvailableGroupModel): FormattedGroup => {
  return {
    id: group.id._serialized,
    name: group.formattedTitle || '',
    memberCount: group.getParticipantCount(),
    wid: group.id,
  };
};

export function formatGroupMember(member: GroupMemberModel): FormattedContact {
  const name = getContactName(member.contact);
  const headerName = member.contact?.get('header') || member.proxyName;

  return {
    id: member.id._serialized,
    userhash: member.contact?.get('userhash'),
    name: name,
    avatar: getAvatarUrlByName(headerName),
    phoneNumber: getPhoneNumberFromId(member.id),
    wid: member.id,
  };
}
