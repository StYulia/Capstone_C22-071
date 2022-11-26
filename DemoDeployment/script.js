"use strict";

const elemImage = document.getElementById("elemImage");
const elemPrediksi = document.getElementById("elemPrediksi");
const elemDetail = document.getElementById("elemDetail");

const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const webcam = new Webcam(webcamElement, 'user', canvasElement);


function getPicture() {
  webcam.start()
  .then(result =>{
     console.log("webcam started");
  })
  .catch(err => {
      console.log(err);
  });
}

function snapPhoto() {
  let picture = webcam.snap();
  document.querySelector('#download-photo').href = picture;

  let image = new Image();
  image.src = picture;

  image.onload = function () {
    predictImage(image);
  }

}


const renderImage = (input) => {
  // Menampilkan gambar yang diinputkan
  elemImage.src = window.URL.createObjectURL(input.files[0]);

  elemImage.onload = function () {
    predictImage(elemImage);
  }

}


/** MODEL HANDLER **/
let model = null;

(async () => {
  // Proses memuat model
  console.log("[Start] Memuat Model");
  model = await tf.loadLayersModel("tfjs-model/model.json");
  console.log("[Finish] Model Telah Dimuat");
})();

const label = [ // Harus urut abjad
  "Organic",
  "Non-Organic"
]

const predictImage = async (gambar) => {
  // 1) Cek dulu apakah model sudah dimuat atau belum
  if (model == null) {
    alert("Harap Tunggu, Model Belum Selesai Dimuat");
    return;
  }
  // Cek juga sebelum prediksi, gambar sudah diinputkan
  if (!gambar.getAttribute('src')) {
    alert("Harap inputkan gambar terlebih dulu yaa");
    return;
  }
  // 2) Mengambil data gambar pada tag image yang telah dirender
  let tensor = tf.browser.fromPixels(gambar);
  // 3) Menyesuaikan ukuran tensor dengan ukuran input pada model
  tensor = tensor.resizeNearestNeighbor([224, 224]);
  // 4) Lakukan normalisasi ukuran pixel dari (0, 255) -> (0, 1)
  tensor = tensor.div(tf.scalar(255));
  // 5) Sesuaikan dimensi tensor dengan dimensi input pada model
  // Contoh: dari [x] menjadi [[x]], x = tensor
  tensor = tensor.expandDims();
  // 6) Melakukan proses prediksi
  let dataPrediksi = await model.predict(tensor).data();
  // [0.999, 0.5, 0.2]
  // 7) Mengolah hasil prediksi untuk ditampilkan
  // bentuk hasil yang diinginkan
  // [
  //   {
  //     class: "Paper (Kertas)",
  //     confidence: 0.95
  //   },
  //   {
  //     class: "Rock (Batu)",
  //     confidence: 0.72
  //   },
  //   {
  //     class: "Scissor (Gunting)",
  //     confidence: 0.4
  //   }
  // ]
  dataPrediksi = Array.from(dataPrediksi).map((value, idx) => {
    return {
      class: label[idx],
      confidence: value
    }
  });
  
  // Mengurutkan hasil prediksi tinggi->rendah dari nilai confidence
  dataPrediksi.sort((x, y) => y.confidence - x.confidence);
  console.log(dataPrediksi);

  // 8) Menampilkan hasil prediksi
  // Menampilkan top-1 (nilai confidence tertinggi)
  elemPrediksi.innerHTML = dataPrediksi[0].class;
  // Menampilkan detail (opsional)
  let htmlData = "";
  dataPrediksi.forEach((data) => {
    htmlData += `<li>${data.class} &rarr; ${data.confidence}</li>`;
  });
  elemDetail.innerHTML = htmlData;
}