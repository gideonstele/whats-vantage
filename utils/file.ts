import { fileTypeFromBlob } from 'file-type';

export const getWppFileType = async (
  file: Blob,
): Promise<['image' | 'video' | 'document' | 'audio' | 'sticker' | 'auto-detect', string]> => {
  const fileType = await fileTypeFromBlob(file);

  if (fileType?.mime.startsWith('image/')) {
    return ['image', fileType.ext] as const;
  } else if (fileType?.mime.startsWith('video/') || fileType?.mime === 'image/gif') {
    return ['video', fileType.ext] as const;
  } else if (fileType?.mime.startsWith('application/')) {
    return ['document', fileType.ext] as const;
  } else if (fileType?.mime.startsWith('audio/')) {
    return ['audio', fileType.ext] as const;
  } else if (fileType?.mime.startsWith('text/')) {
    return ['sticker', fileType.ext] as const;
  }

  return ['auto-detect', fileType?.ext || ''] as const;
};

export const getFileMimeType = async (file: Blob) => {
  const fileType = await fileTypeFromBlob(file);
  return fileType?.mime;
};

export const createBase64FromFetchResponse = async (response: Response) => {
  const blob = await response.blob();

  const fileType = await fileTypeFromBlob(blob);

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1];
      resolve(`data:${fileType?.mime};base64,${base64}`);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
