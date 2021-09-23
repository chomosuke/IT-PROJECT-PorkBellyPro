import { AUTO, MIME_JPEG, read } from 'jimp/browser/lib/jimp';

export interface Message {
  img: File;
  imgHeight: number;
  imgWidth: number;
}

export interface Result {
  url: string;
}

const onMessage: (ev: MessageEvent<Message>) => void = async (
  { data: { img, imgWidth, imgHeight } },
) => {
  // Buffer polyfill comes from jimp/browser/lib/jimp
  const jimg = await read(Buffer.from(await img.arrayBuffer()));
  if (jimg.getWidth() / jimg.getHeight() > imgWidth / imgHeight) {
    jimg.resize(imgWidth, AUTO);
  } else {
    jimg.resize(AUTO, imgHeight);
  }

  const result: Result = {
    url: await jimg.getBase64Async(MIME_JPEG),
  };

  postMessage(result);
};

onmessage = onMessage;
