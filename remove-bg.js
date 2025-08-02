let net;

// モデル読み込み
async function loadModel() {
  net = await bodyPix.load();
  console.log("BodyPixモデル読み込み完了");
}

// 背景除去関数
async function removeBackground(imageElement) {
  if (!net) await loadModel();

  const segmentation = await net.segmentPerson(imageElement);

  const canvas = document.createElement("canvas");
  canvas.width = imageElement.width;
  canvas.height = imageElement.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(imageElement, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const j = i / 4;
    if (!segmentation.data[j]) {
      data[i + 3] = 0; // 背景を透明に
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
}

window.onload = () => {
  const input = document.getElementById("inputImage");
  const button = document.getElementById("processButton");
  const loading = document.getElementById("loadingMessage");
  const resultImage = document.getElementById("resultImage");
  const toStampBtn = document.getElementById("toStampBtn");

  let img = new Image();

  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  button.addEventListener("click", async () => {
    if (!img.src) return;

    loading.style.display = "block";

    img.onload = async () => {
      const outputUrl = await removeBackground(img);
      resultImage.src = outputUrl;
      resultImage.style.display = "block";
      toStampBtn.style.display = "inline-block";
      loading.style.display = "none";
    };
  });

  // スタンプ作成ページへの遷移処理（必要に応じてリンク先変更）
  toStampBtn.addEventListener("click", () => {
    localStorage.setItem("removedBgImage", resultImage.src);
    window.location.href = "index.html"; // スタンプ作成ページ
  });
};
