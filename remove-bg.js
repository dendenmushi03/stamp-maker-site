import * as bodyPix from '@tensorflow-models/body-pix';
import '@tensorflow/tfjs-backend-webgl';

const uploadInput = document.getElementById('imageUpload');
const canvas = document.getElementById('outputCanvas');
const ctx = canvas.getContext('2d');

uploadInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const image = new Image();
  image.onload = async () => {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    const net = await bodyPix.load();
    const segmentation = await net.segmentPerson(image, {
      internalResolution: 'medium',
    });

    const mask = bodyPix.toMask(segmentation);
    ctx.putImageData(mask, 0, 0);

    // 人物部分のみ表示
    ctx.globalCompositeOperation = 'source-in';
    ctx.drawImage(image, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
  };
  image.src = URL.createObjectURL(file);
});
