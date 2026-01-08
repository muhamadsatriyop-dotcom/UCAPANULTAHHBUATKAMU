// --- LOGIKA PESAN BERGANTI ---
const harapanList = [
    "Semoga makin sukses ya! 🚀",
    "Makin cantik/ganteng (minimal di mata sendiri) 😎",
    "Cepat dapet jodoh (kalau belum) 💍",
    "Rezeki lancar biar bisa traktir aku! 🍕",
    "Pokoknya bahagia terus ya!"
];

let index = 0;
const pesanHarapan = document.getElementById('pesanHarapan');

function gantiPesan() {
    if (pesanHarapan) {
        pesanHarapan.innerHTML = `<strong>Harapan:</strong> ${harapanList[index]}`;
        index = (index + 1) % harapanList.length;
        setTimeout(gantiPesan, 3000); // Ganti tiap 3 detik
    }
}
// Jalankan fungsi ganti pesan
gantiPesan();


// --- LOGIKA TOMBOL & VIDEO KEJUTAN ---
function cekMuda() {
    const konfirmasi = confirm("Yakin masih muda? Tulang punggung aman?");
    
    if (konfirmasi) {
        alert("Bagus! Pertahankan delusi ini! Ini hadiah buat kamu:");
        
        // Tampilkan video tersembunyi
        const hv = document.getElementById('hiddenVideo');
        const vid = document.getElementById('supriseVid');
        
        hv.style.display = 'block';
        hv.scrollIntoView({ behavior: 'smooth' });
        
        // Opsional: Otomatis play video kejutan saat muncul
        if(vid) {
            vid.play().catch(e => console.log("Autoplay dicegah browser, user harus klik play manual."));
        }

        createConfetti();
        createLoveRain(); // Tambahkan hujan love!
    } else {
        alert("Jujur banget sih... Ya sudah, istirahat sana, jangan lupa minum air putih!");
    }
}


// --- LOGIKA CONFETTI (Efek Kertas Hias) ---
function createConfetti() {
    for(let i=0; i<50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Posisi acak horizontal
        confetti.style.left = Math.random() * 100 + 'vw';
        
        // Warna acak
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        
        // Durasi jatuh acak antara 2 sampai 5 detik
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        
        document.body.appendChild(confetti);
        
        // Hapus elemen setelah animasi selesai agar browser tidak berat
        setTimeout(() => confetti.remove(), 5000);
    }
}


// --- LOGIKA HUJAN LOVE (Animasi Hati Jatuh) ---
function createLoveRain() {
    const loveSymbols = ['❤️', '💕', '💖', '💗', '💓', '💘', '💝', '💞'];
    
    for(let i = 0; i < 30; i++) {
        const love = document.createElement('div');
        love.classList.add('love-rain');
        
        // Pilih simbol love random
        love.textContent = loveSymbols[Math.floor(Math.random() * loveSymbols.length)];
        
        // Posisi horizontal acak
        love.style.left = Math.random() * 100 + 'vw';
        
        // Ukuran acak
        const size = Math.random() * 20 + 20; // 20px - 40px
        love.style.fontSize = size + 'px';
        
        // Durasi jatuh acak (3-6 detik)
        love.style.animationDuration = (Math.random() * 3 + 3) + 's';
        
        // Delay acak agar tidak jatuh semua bersamaan
        love.style.animationDelay = Math.random() * 2 + 's';
        
        // Opacity acak
        love.style.opacity = Math.random() * 0.5 + 0.5; // 0.5 - 1
        
        document.body.appendChild(love);
        
        // Hapus elemen setelah animasi selesai
        setTimeout(() => love.remove(), 8000);
    }
}


// --- HUJAN LOVE OTOMATIS SAAT PAGE LOAD (Opsional) ---
window.addEventListener('load', function() {
    // Tunggu 1 detik setelah page load, lalu mulai hujan love
    setTimeout(() => {
        createLoveRain();
    }, 1000);
    
    // Ulangi hujan love setiap 15 detik
    setInterval(() => {
        createLoveRain();
    }, 15000);
});


// --- Sinkronisasi audio eksternal untuk `vidiobareng.mp4` ---
(function() {
    const vid = document.getElementById('vidiobarengVideo');
    const aud = document.getElementById('vidiobarengAudio');
    const audioNote = document.getElementById('audioNote');
    
    if (!vid) return;

    function videoHasAudio(video) {
        try {
            if ('mozHasAudio' in video && video.mozHasAudio()) return true;
            if ('webkitAudioDecodedByteCount' in video && video.webkitAudioDecodedByteCount > 0) return true;
            if (video.audioTracks && video.audioTracks.length > 0) return true;
        } catch (e) {}
        return true;
    }

    function fileExistsAudioElement(a) {
        if (!a) return false;
        return !!a.getAttribute('src');
    }

    function setupExternalAudio() {
        if (videoHasAudio(vid)) {
            if (aud) aud.remove();
            if (audioNote) audioNote.textContent = 'Video ini sudah memiliki audio internal.';
            return;
        }
        if (!aud || !fileExistsAudioElement(aud)) {
            if (audioNote) audioNote.textContent = 'Tidak ada file audio eksternal (vidiobareng_audio.mp3) ditemukan.';
            return;
        }

        aud.addEventListener('error', function() {
            if (audioNote) audioNote.textContent = 'Gagal memuat audio eksternal. Periksa nama/file: vidiobareng_audio.mp3';
        });

        vid.addEventListener('play', function() {
            try { aud.currentTime = vid.currentTime; } catch (e) {}
            aud.play().catch(()=>{});
        });
        vid.addEventListener('pause', function(){ try{ aud.pause(); }catch(e){} });
        vid.addEventListener('seeking', function(){ try{ aud.currentTime = vid.currentTime; }catch(e){} });
        vid.addEventListener('timeupdate', function() {
            try {
                const delta = Math.abs(vid.currentTime - aud.currentTime);
                if (delta > 0.3) aud.currentTime = vid.currentTime;
            } catch (e) {}
        });
        vid.addEventListener('ended', function(){ try{ aud.pause(); aud.currentTime = 0; }catch(e){} });

        if (audioNote) audioNote.textContent = 'Memakai audio eksternal: vidiobareng_audio.mp3 — pastikan file ada di folder yang sama.';
    }

    setTimeout(setupExternalAudio, 200);
})();