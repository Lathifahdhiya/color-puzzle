function generateRGB() {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    return [red, green, blue];
}

// Returns a single rgb color interpolation between given rgb color
// based on the factor given; via https://codepen.io/njmcode/pen/axoyD?editors=0010
function interpolateColor(color1, color2, factor) {
    var result = color1.slice();
    for (var i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return result;
};
// My function to interpolate between two colors completely, returning an array
function interpolateColors(color1, color2, steps) {
    var stepFactor = 1 / (steps - 1);
    var interpolatedColorArray = [];

    for(var i = 0; i < steps; i++) {
        interpolatedColorArray.push(interpolateColor(color1, color2, stepFactor * i));
    }

    console.log('interpolatedColorArray :>> ', interpolatedColorArray);
    return interpolatedColorArray;
}


function generateTraySoal(soal) {
    let traySoal = "<table><tr>";
    let index = 1;
    for (const rgb of soal) {
        traySoal += `<td>
                        <div id="soal${index}" class="kotak-warna" ondrop="drop(event)" ondragover="allowDrop(event)">
                            <div id="color${index}" kotakSebelumnya="soal${index}" warna="${rgb[0]},${rgb[1]},${rgb[2]}" class="warna" style="background-color: rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]});" draggable="true" ondragstart="drag(event)"></div>
                        </div>
                    </td>`;
        index++;
    }
    traySoal += "</tr></table>";
    return traySoal;
}

function generateTrayJawaban(jawaban) {
    let trayJawaban = "<table><tr>";
    let index = 1;
    for (const rgb of jawaban) {
        trayJawaban += `<td>
                            <div id="jawaban${index}" class="kotak-warna" ondrop="drop(event)" ondragover="allowDrop(event)">
                            </div>
                        </td>`;
        index++;
    }
    trayJawaban += "</tr></table>";
    return trayJawaban;
}

const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

var jawaban_board;
var soal_board;
var jumlah_warna;
function setTwoColorBoard() {
    const color1 = generateRGB();
    const color2 = generateRGB();
    const step = 8;

    // Generate array of gradient colors from color1 to color2
    const gradientRGB = interpolateColors(color1, color2, step);

    const jawaban = gradientRGB;
    jawaban_board = jawaban;
    const soal = jawaban.slice();
    for(let i = soal.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * i);
        const color1 = soal[i];
        const color2 = soal[j];
        soal[i] = color2;
        soal[j] = color1;
    }
    soal_board = soal;
    jumlah_warna = 8;

    const trayJawaban = generateTrayJawaban(jawaban);
    const traySoal = generateTraySoal(soal);

    document.getElementById("tray-jawaban").innerHTML = trayJawaban;
    document.getElementById("tray-soal").innerHTML = traySoal;
}

function regenerateTwoColorBoard() {
    destroyBoard();
    setTwoColorBoard();
}

function resetBoard() {
    const jawaban = jawaban_board;
    const soal = soal_board;
    const trayJawaban = generateTrayJawaban(jawaban);
    const traySoal = generateTraySoal(soal);
    document.getElementById("tray-jawaban").innerHTML = trayJawaban;
    document.getElementById("tray-soal").innerHTML = traySoal;
}

function destroyBoard() {
    jawaban_board = undefined;
    soal_board = undefined;
    document.getElementById("tray-jawaban").innerHTML = "";
    document.getElementById("tray-soal").innerHTML = "";
}

var count = 200;
var defaults = {
  origin: { y: 0.7 }
};

function fireConfetti(particleRatio, opts) {
  confetti(Object.assign({}, defaults, opts, {
    particleCount: Math.floor(count * particleRatio)
  }));
}

function menuMenang() {
    destroyBoard();
    document.getElementById("menu-game").style.display = "none";
    document.getElementById("menu-menang").style.display = "block";
    
    fireConfetti(0.25, {
        spread: 26,
        startVelocity: 55,
    });
    fireConfetti(0.2, {
        spread: 60,
    });
    fireConfetti(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
    });
    fireConfetti(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
    });
    fireConfetti(0.1, {
        spread: 120,
        startVelocity: 45,
    });
}

// Untuk cek apakah jawaban sudah benar atau tidak
function checkBoard() {
    const jawaban = jawaban_board;
    const jawaban_reverse = jawaban.slice().reverse();
    const jawaban_user = [];
    for (let index = 1; index <= jumlah_warna; index++) {
        const container_jawaban = document.getElementById("jawaban"+index);
        if(container_jawaban.firstElementChild){
            const warna = container_jawaban.firstElementChild.getAttribute("warna").split(",");
            jawaban_user.push(warna);
        }
    }
    if(jawaban_user.length == jumlah_warna){
        let menang = false;
        let jawaban_benar = true;
        let jawaban_reverse_benar = true;
        // cek jawaban dengan urutan awal dulu, jika salah maka
        // cek jawaban dengan urutan reverse.
        for (let index = 0; index < jumlah_warna; index++) {
            const warna_benar = jawaban[index];
            const cek_jawaban = jawaban_user[index];
            if(warna_benar[0] != cek_jawaban[0] && warna_benar[1] != cek_jawaban[1] && warna_benar[2] != cek_jawaban[2]){
                jawaban_benar = false;
                break;
            }
        }
        
        if(jawaban_benar){
            menang = true;
        }else{
            for (let index = 0; index < jumlah_warna; index++) {
                const warna_benar = jawaban_reverse[index];
                const cek_jawaban = jawaban_user[index];
                if(warna_benar[0] != cek_jawaban[0] && warna_benar[1] != cek_jawaban[1] && warna_benar[2] != cek_jawaban[2]){
                    jawaban_reverse_benar = false;
                    break;
                }
            }
            if(jawaban_reverse_benar){
                menang = true;
            }
        }
        if(menang){
            menuMenang();
        } 
    }
}


function toMainMenu() {
    document.getElementById("menu-utama").style.display = "block";
    document.getElementById("menu-menang").style.display = "none";
    document.getElementById("menu-game").style.display = "none";
}

function toGameMenu(params) {
    document.getElementById("menu-utama").style.display = "none";
    document.getElementById("menu-menang").style.display = "none";
    document.getElementById("menu-game").style.display = "block";
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    if(ev.target.className == "kotak-warna" && ev.target.childElementCount == 0){
        const id_kotak = ev.target.id;
        document.getElementById(data).setAttribute("kotakSebelumnya", id_kotak);
        ev.target.appendChild(document.getElementById(data));
    }else{
        let target_element = ev.target;
        if(target_element.className == "warna"){
            target_element = target_element.parentNode;
        }
        const color_sekarang = target_element.firstElementChild;
        const color_baru = document.getElementById(data);
        const id_kotak_sebelumnya = color_baru.getAttribute("kotakSebelumnya");
        const id_kotak_baru = target_element.id;

        color_sekarang.setAttribute("kotakSebelumnya", id_kotak_sebelumnya);
        color_baru.setAttribute("kotakSebelumnya", id_kotak_baru);

        target_element.removeChild(target_element.childNodes[0]);
        target_element.appendChild(color_baru);
        document.getElementById(id_kotak_sebelumnya).appendChild(color_sekarang);
    }
    checkBoard();
}
