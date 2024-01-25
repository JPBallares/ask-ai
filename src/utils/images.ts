import { Readable } from 'stream';

export function dataUrlToStream(dataUrl: string) {
  const matches = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  if (matches?.length !== 3) {
    throw new Error('Invalid input string');
  }
  const data = Buffer.from(matches[2], 'base64');
  const readStream = new Readable();
  readStream.push(data);
  readStream.push(null); // indicates end-of-file basically - the end of the stream
  return readStream;
}

export const dataType64toFile = (b64Data: string, filename: string) => {
  const mime = 'image/png';
  const bstr = atob(b64Data);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  const newFile = new File([u8arr], filename, {
    type: mime,
  });
  return newFile;
};

export const getBase64 = (data: string) => {
  return data.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
};
