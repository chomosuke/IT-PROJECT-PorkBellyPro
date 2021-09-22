import Jimp from 'jimp/browser/lib/jimp';
// eslint-disable-next-line no-restricted-globals
self.onmessage = async ({ data: { img, imgWidth, imgHeight } }) => {
  const jimg = await Jimp.read(Buffer.from(await img.arrayBuffer()));
  if (jimg.getWidth() / jimg.getHeight() > imgWidth / imgHeight) {
    jimg.resize(imgWidth, Jimp.AUTO);
  } else {
    jimg.resize(Jimp.AUTO, imgHeight);
  }
  // @ts-expect-error need help
  // eslint-disable-next-line no-restricted-globals
  self.postMessage({ url: await jimg.getBase64Async(Jimp.MIME_JPEG) });
};
