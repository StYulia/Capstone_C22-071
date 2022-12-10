//menu
let tombolMenu =  $(".tombol-menu");
let menu = $("nav .menu ul");

function klikMenu(){
    tombolMenu.click(function(){
        menu.toggle();
    });
    menu.click(function(){
        menu.toggle();
    });
}

//frame box jquery untuk nav menu
$ (document).ready(function () {
    let width = $(window).width();
    if (width < 980) {
        klikMenu();
    }
})

//pengecekan lebar
$(window).resize(function(){
    let width = $(window).width();
    if(width > 980){
        menu.css("display","block");
        //display:block
    }else{
        menu.css("display","none");
    }
    klikMenu();
})

//efek scroll
$ (document).ready(function () {
    let scroll_pos = 0;
    $(document).scroll(function (){
        scroll_pos = $(this).scrollTop();
        if(scroll_pos > 0){
            $("nav").addClass("putih");
            $("nav img.hitam").show();
            $("nav img.putih").hide();
        }else{
            $("nav").removeClass("hitam");
            $("nav img.putih").hide();
            $("nav img.hitam").show();
        }

    }) 
});

"use strict";

const elemImage = document.getElementById("elemImage");
const elemPrediksi = document.getElementById("elemPrediksi");
const elemDetail = document.getElementById("elemDetail");

const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const webcam = new Webcam(webcamElement, 'user', canvasElement);
let canvass = document.getElementById('canvas')
const takephoto = document.getElementById('take-picture');

const overlay = document.querySelector("#overlay");

let WebcamControl = document.getElementById("webcam-control")
const takepoto = document.getElementById('taketake')

const kontenPrediksi = document.getElementById('konten');

function getPicture() {

  webcamElement.classList.remove('d-none');
  canvass.classList.add("d-none");

  currentvalue = WebcamControl.value;
  if(currentvalue == "On"){
    WebcamControl.value="Off";
    webcamElement.style.display="inline";
    webcam.start()
    .then(result =>{
       console.log("webcam started");
    })
    .catch(err => {
        console.log(err);
    });
    takepoto.style.visibility = 'visible';
    WebcamControl.innerHTML = "Tutup kamera";
    WebcamControl.style.backgroundColor = 'red'

  }else{
    WebcamControl.value="On";
    WebcamControl.style.backgroundColor = '#6EAB3B';
    takepoto.style.visibility = 'hidden';
    webcam.stop();
    console.log("webcam stopped");
    WebcamControl.innerHTML = "Buka kamera";
    canvass.classList.add("d-none");
    webcamElement.style.display="none";
  }
}

overlay.addEventListener('scroll', () => {
  const scrolled = overlay.scrollY;
})

function snapPhoto() {

  elemImage.classList.add("d-none");

  let picture = webcam.snap();

  let image = new Image();
  image.src = picture;

  image.onload = function () {
    predictImage(image);
    overlay.style.display = "block";
  }
  afterTakePhoto()

}


function closeBtn() {
  overlay.style.display = "none";
  canvass.classList.add("d-none");

  WebcamControl.value="On";
  WebcamControl.style.backgroundColor = '#6EAB3B';
  takepoto.style.visibility = 'hidden';
  WebcamControl.innerHTML = "Buka kamera";
}

function afterTakePhoto() {
  webcam.stop();
  canvass.classList.remove("d-none");
  webcamElement.classList.add('d-none');
  webcamElement.style.display="none";
}



const renderImage = (input) => {
  // Menampilkan gambar yang diinputkan
  canvass.classList.add("d-none");
  webcamElement.classList.add('d-none');
  elemImage.classList.remove('d-none');

  WebcamControl.value="Off";
  getPicture()

  elemImage.src = window.URL.createObjectURL(input.files[0]);

  elemImage.onload = function () {
    predictImage(elemImage);
    overlay.style.display = "block";
  }

}


/** MODEL HANDLER **/
let model = null;

// Jika terjadi error menggunakan transfer learning ke deployment website
// pergi ke model.json lalu cari Functional dan Ganti dengan Model
(async () => {
  // Proses memuat model
  console.log("[Start] Memuat Model");
  model = await tf.loadLayersModel("tfjs-model/model.json");
  console.log("[Finish] Model Telah Dimuat");
})();

const label = [ // Harus urut abjad
  "Organik",
  "Anorganik"
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
  // 7) Mengolah hasil prediksi untuk ditampilkan
  // bentuk hasil yang diinginkan
  // [
  //   {
  //     class: "Anorganik",
  //     confidence: 0.95
  //   },
  //   {
  //     class: "Organik",
  //     confidence: 0.72
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
  let prediksiPertama = dataPrediksi[0].class;
  elemPrediksi.innerHTML = 'Sampah ini berjenis ' + prediksiPertama;
  // Menampilkan detail (opsional)
  if (prediksiPertama == 'Organik') {
    kontenPrediksi.innerHTML =`
    <p>
    Hasil prediksi menunjukkan sampah ini termasuk dalam jenis sampah Organik. Sampah organik merupakan sampah hasil sisa dari organisme berasal dari makhluk hidup, baik manusia, tumbuhan, maupun hewan. 
    <br><br>
    Sampah Organik sendiri terbagi menjadi dua jenis yaitu sampah Organik kering dan basah. Sampah organik kering adalah sampah Organik yang kandungan airnya sedikit seperti ranting pohon, kayu, daun-daunan kering, dan sebagainya. 
    <br><br>
    Sedangkan sampah organik basah adalah sampah yang sebagian besar mengandung air yang biasanya menjadi alasan kalau sampah ini menimbulkan bau tidak sedap contohnya buah yang busuk, sisa sayur-sayuran, kotoran hewan, kulit pisang, dan sejenisnya.
    <br><br>
    Dari data Kementrian Lingkungan Hidup dan Kehutanan (KLHK) sampah organi menjadi salah satu jenis sampah paling banyak dihasilkan di Indonesia. Bahkan jumlahnya mencapai 28,3% dari jumlah timbulan sampah 21,63 juta ton di awal tahun 2022. 
    <br><br>
    Pemanfaatan sampah organik ini biasanya sering dimanfaatkan menjadi pupuk kompos atau pupuk organik dan tambahan pakan hewan, loh. Jadi bijak dalam mengelola sampahmu dan dapatkan manfaat dari membuang sampah yang sesuai ya!


  
    </p>`;
  } else {
    kontenPrediksi.innerHTML =`
    <p>
    Hasil prediksi menunjukkan sampah tersebut termasuk dalam jenis sampah Anorganik. Sampah Anorganik merupakan jenis sampah yang berasal dari organisme tidak hidup dan tidak dapat terurai secara langsung oleh bakteri dan membutuhkan unsur kimia dalam proses penguraian. 
    <br><br>
    Jenis sampah Anorganik terdiri dari dua bentuk yaitu, sampah Anorganik lunak dan Anorganik keras. Anorganik lunakan merupakan jenis sampah non alami yang mudah dibentuk seperti sampah plastik, bungkus kemasan, bahan tekstil, dan sebagainya. Sedangkan sampah Anorganik keras limbah yang sulit untuk diolah Kembali antara lain seperti sampah kaleng, kaca, bahan metal, atau material pecah belah.
    <br><br>
    Melansir dari data Kementrian Lingkungan Hidup dan Kehutan (KHLK), sampah Anorganik berjumlah 35,62%, hasil gabungan dari sampah plastik 15,73%, logam, 6,68%, kain 6,57%, dan kaca sebanyak 6,46% dan dari jumlah sampah-sampah itu, masih ada 33,49% sampah yang belum dikelola dengan baik dengan sistem pengelolaan sampah di Indonesia yang masih kurang efektif. 
    <br><br>
    Selain menyebabkan dampak yang buruk untuk lingkungan mahkluk hidup, Pemanfaatan sampah Anorganik bisa dimanfaatkan untuk menjadi kerajinan tangan atau daur ulang lainnya. Hasil daur ulang dari sampah Anorganik ini juga memiliki nilai jual loh, jadi jangan lupa bijak membuang sampah dan manfaatkan sampah Anorganik kalian menjadi daur ulang yang bermanfaat ya!
    </p>`;
  }
}
let nodeList = document.querySelector(".buttons");

$('.buttons').click(function(){

  $(this).addClass('button-active').siblings().removeClass('button-active');

  let filter = $(this).attr('data-filter');
  if(filter == 'all'){
      $('.menu .image').show(400);
  }else{
      $('.menu .image').not('.'+filter).hide(200);
      $('.menu .image').filter('.'+filter).show(400);
  }

});