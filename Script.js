document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const tombolTema = document.getElementById("btn-tema");

    const formPengalaman = document.getElementById("form-pengalaman");
    const inputJudul = document.getElementById("judul-pengalaman");
    const inputPeriode = document.getElementById("periode");
    const inputDeskripsi = document.getElementById("deskripsi");
    const daftarPengalaman = document.getElementById("daftar-pengalaman");
    const pesanPengalaman = document.getElementById("pesan-pengalaman");

    const tombolKontak = document.getElementById("btn-kontak");
    const infoKontak = document.getElementById("info-kontak");

    const formKomentar = document.getElementById("form-komentar");
    const inputNamaKomentar = document.getElementById("nama-komentar");
    const inputIsiKomentar = document.getElementById("isi-komentar");
    const daftarKomentar = document.getElementById("daftar-komentar");
    const pesanKomentar = document.getElementById("pesan-komentar");

    const tombolReset = document.getElementById("btn-reset");
    const tahun = document.getElementById("tahun");

    function bacaData(kunci) {
        try {
            const data = localStorage.getItem(kunci);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            return [];
        }
    }

    function simpanData(kunci, data) {
        try {
            localStorage.setItem(kunci, JSON.stringify(data));
            return true;
        } catch (error) {
            alert("Data gagal disimpan.");
            return false;
        }
    }

    function perbaruiTema() {
        if (body.classList.contains("dark")) {
            tombolTema.textContent = "Mode Terang";
        } else {
            tombolTema.textContent = "Mode Gelap";
        }
    }

    if (localStorage.getItem("tema") === "gelap") {
        body.classList.add("dark");
    }

    perbaruiTema();

    tombolTema.addEventListener("click", function () {
        body.classList.toggle("dark");

        const tema = body.classList.contains("dark")
            ? "gelap"
            : "terang";

        localStorage.setItem("tema", tema);
        perbaruiTema();
    });

    function perbaruiKontak() {
        const terlihat = localStorage.getItem("kontakTampil") === "ya";

        infoKontak.hidden = !terlihat;
        tombolKontak.textContent = terlihat
            ? "Sembunyikan Kontak"
            : "Tampilkan Kontak";
    }

    perbaruiKontak();

    tombolKontak.addEventListener("click", function () {
        const terlihat = !infoKontak.hidden;

        localStorage.setItem(
            "kontakTampil",
            terlihat ? "tidak" : "ya"
        );

        perbaruiKontak();
    });

    let pengalaman = bacaData("pengalamanProfil");

    function tampilkanPengalaman() {
        daftarPengalaman.replaceChildren();

        if (pengalaman.length === 0) {
            const pesan = document.createElement("p");
            pesan.textContent = "Belum ada pengalaman yang ditambahkan.";
            daftarPengalaman.appendChild(pesan);
            return;
        }

        pengalaman.forEach(function (item) {
            const kartu = document.createElement("article");
            kartu.className = "experience-item";

            const judul = document.createElement("h3");
            judul.textContent = item.judul;

            const periode = document.createElement("p");
            periode.className = "experience-period";
            periode.textContent = item.periode;

            const deskripsi = document.createElement("p");
            deskripsi.textContent = item.deskripsi;

            const tombolLike = document.createElement("button");
            tombolLike.type = "button";
            tombolLike.className = "btn-like";
            tombolLike.textContent = "Like " + (item.like || 0);

            tombolLike.addEventListener("click", function () {
                const dataLama = pengalaman;

                pengalaman = pengalaman.map(function (data) {
                    if (data.id === item.id) {
                        return {
                            ...data,
                            like: (data.like || 0) + 1
                        };
                    }

                    return data;
                });

                if (simpanData("pengalamanProfil", pengalaman)) {
                    tampilkanPengalaman();
                } else {
                    pengalaman = dataLama;
                }
            });

            // Tombol Hapus
            const tombolHapus = document.createElement("button");
            tombolHapus.type = "button";
            tombolHapus.className = "btn-hapus";
            tombolHapus.textContent = "Hapus";

            tombolHapus.addEventListener("click", function () {
                if (confirm("Hapus pengalaman ini?")) {
                    const dataLama = pengalaman;

                    pengalaman = pengalaman.filter(function (data) {
                        return data.id !== item.id;
                    });

                    if (simpanData("pengalamanProfil", pengalaman)) {
                        tampilkanPengalaman();
                        pesanPengalaman.textContent =
                            "Pengalaman berhasil dihapus.";
                    } else {
                        pengalaman = dataLama;
                    }
                }
            });

            kartu.append(
                judul,
                periode,
                deskripsi,
                tombolLike,
                tombolHapus
            );

            daftarPengalaman.appendChild(kartu);
        });
    }

    tampilkanPengalaman();

    formPengalaman.addEventListener("submit", function (event) {
        event.preventDefault();

        const judul = inputJudul.value.trim();
        const periode = inputPeriode.value.trim();
        const deskripsi = inputDeskripsi.value.trim();

        if (!judul || !periode || !deskripsi) {
            pesanPengalaman.textContent = "Semua kolom harus diisi.";
            return;
        }

        const itemBaru = {
            id: Date.now().toString(),
            judul: judul,
            periode: periode,
            deskripsi: deskripsi,
            like: 0
        };

        pengalaman.push(itemBaru);

        if (simpanData("pengalamanProfil", pengalaman)) {
            tampilkanPengalaman();
            formPengalaman.reset();
            pesanPengalaman.textContent =
                "Pengalaman berhasil ditambahkan.";
        } else {
            pengalaman.pop();
        }
    });

    let komentar = bacaData("komentarProfil");

    function tampilkanKomentar() {
        daftarKomentar.replaceChildren();

        if (komentar.length === 0) {
            const pesan = document.createElement("p");
            pesan.textContent = "Belum ada komentar.";
            daftarKomentar.appendChild(pesan);
            return;
        }

        komentar.forEach(function (item) {
            const kartu = document.createElement("article");
            kartu.className = "comment-item";

            const nama = document.createElement("h3");
            nama.textContent = item.nama;

            const tanggal = document.createElement("span");
            tanggal.className = "comment-date";
            tanggal.textContent = item.tanggal;

            const isi = document.createElement("p");
            isi.textContent = item.isi;

            const tombolHapus = document.createElement("button");
            tombolHapus.type = "button";
            tombolHapus.className = "btn-hapus";
            tombolHapus.textContent = "Hapus";

            tombolHapus.addEventListener("click", function () {
                if (confirm("Hapus komentar ini?")) {
                    const dataLama = komentar;

                    komentar = komentar.filter(function (data) {
                        return data.id !== item.id;
                    });

                    if (simpanData("komentarProfil", komentar)) {
                        tampilkanKomentar();
                        pesanKomentar.textContent =
                            "Komentar berhasil dihapus.";
                    } else {
                        komentar = dataLama;
                    }
                }
            });

            kartu.append(nama, tanggal, isi, tombolHapus);
            daftarKomentar.appendChild(kartu);
        });
    }

    tampilkanKomentar();

    formKomentar.addEventListener("submit", function (event) {
        event.preventDefault();

        const nama = inputNamaKomentar.value.trim();
        const isi = inputIsiKomentar.value.trim();

        if (!nama || !isi) {
            pesanKomentar.textContent =
                "Nama dan komentar harus diisi.";
            return;
        }

        const komentarBaru = {
            id: Date.now().toString(),
            nama: nama,
            isi: isi,
            tanggal: new Date().toLocaleString("id-ID")
        };

        komentar.unshift(komentarBaru);

        if (simpanData("komentarProfil", komentar)) {
            tampilkanKomentar();
            formKomentar.reset();
            pesanKomentar.textContent = "Komentar berhasil dikirim.";
        } else {
            komentar.shift();
        }
    });

    tombolReset.addEventListener("click", function () {
        if (confirm("Yakin ingin menghapus semua pengalaman dan komentar?")) {
            const pengalamanLama = pengalaman;
            const komentarLama = komentar;

            pengalaman = [];
            komentar = [];

            const berhasilPengalaman = simpanData(
                "pengalamanProfil",
                pengalaman
            );

            const berhasilKomentar = simpanData(
                "komentarProfil",
                komentar
            );

            if (berhasilPengalaman && berhasilKomentar) {
                localStorage.setItem("kontakTampil", "tidak");

                tampilkanPengalaman();
                tampilkanKomentar();
                perbaruiKontak();

                pesanPengalaman.textContent =
                    "Data pengalaman telah dihapus.";
                pesanKomentar.textContent =
                    "Data komentar telah dihapus.";
            } else {
                pengalaman = pengalamanLama;
                komentar = komentarLama;

                tampilkanPengalaman();
                tampilkanKomentar();
            }
        }
    });

    tahun.textContent = new Date().getFullYear();
});