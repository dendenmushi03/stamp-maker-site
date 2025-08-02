const input = document.getElementById("inputImage");
const button = document.getElementById("processButton");
const resultImg = document.getElementById("resultImage");
const loadingMessage = document.getElementById("loadingMessage");
const toStampBtn = document.getElementById("toStampBtn");

let resultImageUrl = "";

button.addEventListener("click", async () => {
  if (!input.files[0]) {
    alert("画像を選択してください");
    return;
  }

  const file = input.files[0];
  const reader = new FileReader();

  reader.onloadend = async () => {
    const base64Image = reader.result;

    loadingMessage.style.display = "block";
    resultImg.style.display = "none";
    toStampBtn.style.display = "none";

    try {
      const response = await fetch("/api/remove-background", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ imageUrl: base64Image })
      });

      const data = await response.json();

      if (data.imageUrl) {
        resultImageUrl = data.imageUrl;
        resultImg.src = resultImageUrl;
        resultImg.style.display = "block";
        toStampBtn.style.display = "inline-block";
      } else {
        alert("画像処理に失敗しました");
      }
    } catch (err) {
      alert("エラーが発生しました");
      console.error(err);
    } finally {
      loadingMessage.style.display = "none";
    }
  };

  reader.readAsDataURL(file);
});

toStampBtn.addEventListener("click", () => {
  localStorage.setItem("bgRemovedImage", resultImageUrl);
  window.location.href = "index.html";
});
