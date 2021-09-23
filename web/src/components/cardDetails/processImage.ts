import { AUTO, MIME_JPEG, read } from 'jimp/browser/lib/jimp';

onmessage = async ({ data: { img, imgWidth, imgHeight } }) => {
  // Buffer polyfill comes from jimp/browser/lib/jimp
  const jimg = await read(Buffer.from(await img.arrayBuffer()));
  if (jimg.getWidth() / jimg.getHeight() > imgWidth / imgHeight) {
    jimg.resize(imgWidth, AUTO);
  } else {
    jimg.resize(AUTO, imgHeight);
  }

  postMessage({ url: await jimg.getBase64Async(MIME_JPEG) });
};
