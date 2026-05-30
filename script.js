window.onload = () => {
    renderTable();
};

// 1. ANA SÖZLÜK SAYFASI (A-Z)
function renderTable() {
    const app = document.getElementById('app');
    const sortedData = [...dictionary].sort((a, b) => a.w.localeCompare(b.w, 'tr'));
    drawUI("Alfabetik Sözlük (A-Z)", sortedData);
    $("#app").hide().fadeIn(400); 
}

// 2. KATEGORİLER SAYFASI
function showCategories() {
    const app = document.getElementById('app');
    const cats = [...new Set(dictionary.map(item => item.c))].sort();
    let html = `<h2>Konu Başlıklarına Göre Kelimeler</h2>`;

    cats.forEach(cat => {
        html += `<h3 style="background:var(--primary); color:white; padding:10px; margin-top:20px; border-radius:5px;">${cat}</h3>`;
        html += `<table><tbody>`;
        const filtered = dictionary.filter(item => item.c === cat);
        filtered.forEach(item => {
            html += `<tr onclick="speak('${item.w}. Anlamı: ${item.d}')">
                        <td style="width:30%"><strong>${item.w}</strong></td>
                        <td>${item.d}</td>
                    </tr>`;
        });
        html += `</tbody></table>`;
    });
    app.innerHTML = html;
    $("#app").hide().fadeIn(400);
}

// 3. ARAMA MOTORU
function searchDictionary() {
    const input = document.getElementById('searchInput').value.toLowerCase('tr');
    const filtered = dictionary.filter(item => 
        item.w.toLowerCase('tr').includes(input) || item.c.toLowerCase('tr').includes(input)
    );
    drawUI(input ? `Arama Sonuçları: "${input}"` : "Alfabetik Sözlük (A-Z)", filtered);
}

// Ortak Tablo Çizim Fonksiyonu
function drawUI(title, dataList) {
    const app = document.getElementById('app');
    if (dataList.length === 0) {
        app.innerHTML = `<h2>${title}</h2><p style="color:red; text-align:center;">Sonuç bulunamadı.</p>`;
        return;
    }
    let html = `<h2>${title}</h2><table><thead><tr><th>Kelime</th><th>Anlamı</th><th>Kategori</th></tr></thead><tbody>`;
    dataList.forEach(i => {
        html += `<tr onclick="speak('${i.w}. Anlamı: ${i.d}')">
                    <td><strong>${i.w}</strong></td>
                    <td>${i.d}</td>
                    <td><span class="category-badge">${i.c}</span></td>
                 </tr>`;
    });
    html += `</tbody></table>`;
    app.innerHTML = html;
}

// 4. ÇOKLU SAYFA YÖNETİMİ (TAM 10 SAYFA)
function showPage(page) {
    const app = document.getElementById('app');
    
    if (page === 'oneri') { // SAYFA 3: Kelime Önerisi Formu (Hata giderildi)
        app.innerHTML = `
            <h2>Kelime Önerisi</h2>
            <p style="text-align:center; margin-bottom:15px; color:#666;">Sözlüğümüzde olmasını istediğiniz kavramları bize iletin.</p>
            <div style="display:flex; flex-direction:column; gap:10px; max-width:400px; margin: 0 auto;">
                <p id="formHata" style="color:red; font-weight:bold; display:none; text-align:center;"></p>
                <input type="text" id="oneriKelime" placeholder="Önerilen Kelime" style="padding:10px; border:1px solid #ccc; border-radius:5px;">
                <input type="text" id="oneriEposta" placeholder="E-posta Adresiniz" style="padding:10px; border:1px solid #ccc; border-radius:5px;">
                <textarea id="oneriAnlam" placeholder="Kelimenin Anlamı / Açıklaması" rows="4" style="padding:10px; border:1px solid #ccc; border-radius:5px;"></textarea>
                <button id="btnOneriGonder" style="background:var(--accent); color:white; padding:10px; border:none; cursor:pointer; font-weight:bold; border-radius:5px;">Öneriyi Gönder</button>
            </div>
        `;

        // Buton tıklama olayı dinleyicisi ve form kontrolü
        $("#btnOneriGonder").on("click", function() {
            const kelime = $("#oneriKelime").val().trim();
            const eposta = $("#oneriEposta").val().trim();
            const anlam = $("#oneriAnlam").val().trim();
            const hataKutusu = $("#formHata");
            const epostaRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

            if (kelime === "" || eposta === "" || anlam === "") {
                hataKutusu.text("⚠️ Lütfen tüm alanları doldurunuz!").slideDown().fadeOut(3000);
            } else if (!epostaRegex.test(eposta)) {
                hataKutusu.text("⚠️ Lütfen geçerli bir e-posta adresi giriniz!").slideDown().fadeOut(3000);
            } else {
                alert(`Harika! "${kelime}" kelime öneriniz başarıyla sisteme ulaştı.`);
                $("#oneriKelime").val("");
                $("#oneriEposta").val("");
                $("#oneriAnlam").val("");
                hataKutusu.hide();
            }
        });

    } else if (page === 'hakkimizda') { // SAYFA 4: Detaylı Hakkımızda Sayfası ve Lightbox Görseli
        app.innerHTML = `
            <h2>Hakkımızda | Bilgi Ansiklopedisi</h2>
            <div class="info-box" style="cursor:default;">
                <p><strong>Bilgi Ansiklopedisi ve Sesli Sözlük Projesi</strong>, modern web teknolojilerini kullanarak kullanıcıların bilgiye erişimini kolaylaştırmak, doğru telaffuz ve zengin içerik sunmak amacıyla kurulmuş yenilikçi bir dijital eğitim platformudur.</p>
                <p style="margin-top:10px;">Platformumuz bünyesinde toplamda <strong>16 farklı temel kategori</strong> barındırmaktadır. Bu kategoriler; tıp, mühendislik, felsefe, sanat ve teknoloji gibi geniş bir akademik yelpazeyi kapsar. Web Speech API entegrasyonumuz sayesinde kullanıcılar aradıkları kelimelerin anlamlarını okurken aynı zamanda satırlara dokunarak sesli telaffuzlarını da dinleyebilmektedirler.</p>
                <p style="margin-top:10px;">Tamamen duyarlı (responsive) kod mimarisi ile kodlanan sitemiz, mobil cihazlardan ve tabletlerden de kusursuz bir kullanıcı deneyimi sunar.</p>
            </div>
            <div style="margin-top: 20px; text-align:center;">
                <p style="font-size:12px; color:#666;">(Görseli büyütmek için üzerine tıklayabilirsiniz)</p>
                <a class="popup-link" href="https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80" title="Bilgi Ansiklopedisi Eğitim Rehberi">
                    <img src="https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=300&q=80" style="border-radius:10px; border:3px solid var(--primary); margin-top:10px; cursor:pointer; width:100%; max-width:250px;" alt="Kütüphane Görseli">
                </a>
            </div>
        `;
        $('.popup-link').magnificPopup({ type: 'image', closeOnContentClick: true });

    } else if (page === 'iletisim') { // SAYFA 5: İletişim
        app.innerHTML = `
            <h2>İletişim Bilgileri</h2>
            <p style="text-align:center; margin-bottom:15px;">Bizimle her zaman iletişime geçebilirsiniz.</p>
            <div class="info-box" style="text-align:center;">
                <p>📧 <strong>E-posta:</strong> info@rootlightstudio.com</p>
                <p style="margin-top:5px;">📍 <strong>Merkez:</strong> Manisa / Türkiye</p>
            </div>
        `;
    
    } else if (page === 'sss') { // SAYFA 6: S.S.S.
        app.innerHTML = `
            <h2>Sıkça Sorulan Sorular</h2>
            <div class="info-box" onclick="speak('Seslendirme nasıl çalışır? Satırlara veya kutulara tıkladığınızda Web Speech API altyapısı kelimeyi seslendirir.')">
                <strong>❓ Seslendirme özelliği nasıl çalışır?</strong>
                <p>Tablolardaki satırlara veya bu bilgi kutularına tıkladığınızda, tarayıcınızın dahili konuşma motoru (Web Speech API) devreye girerek metni seslendirir.</p>
            </div>
            <div class="info-box" onclick="speak('Veriler güncellenebilir mi? Evet, veri tabanı JavaScript nesne yapısında olduğu için kolayca genişletilebilir.')">
                <strong>❓ Veriler dinamik olarak güncellenebilir mi?</strong>
                <p>Evet, sözlük verileri harici bir veri dosyasında nesne dizisi (Array of Objects) olarak tutulduğu için yeni kelimeler anında listeye yansır.</p>
            </div>
        `;

    } else if (page === 'kilavuz') { // SAYFA 7: Kullanım Kılavuzu + Görsel
        app.innerHTML = `
            <h2>Kullanım Kılavuzu</h2>
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <div class="info-box"><strong>Adım 1:</strong> Üstteki menüyü kullanarak kelimeleri alfabetik veya kategori bazlı listeleyebilirsiniz.</div>
                <div class="info-box"><strong>Adım 2:</strong> Arama çubuğuna yazarak hem kelimelerde hem de kategorilerde canlı filtreleme yapabilirsiniz.</div>
                <div class="info-box"><strong>Adım 3:</strong> Listelenen herhangi bir satıra tıklayarak sesli telaffuzunu anında dinleyebilirsiniz.</div>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=300&q=80" style="border-radius:10px; width:100%; max-width:250px;" alt="Çalışma Alanı">
            </div>
        `;

    } else if (page === 'ekip') { // SAYFA 8: Geliştirici Ekip (Sadece Belinay Korukmaz ve Görsel)
        app.innerHTML = `
            <h2>Geliştirici Ekip ve Yönetim</h2>
            <div class="info-box" style="text-align: center; cursor:default;">
                <div style="margin-bottom: 15px;">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" style="border-radius:50%; width:100px; height:100px; object-fit:cover; border:3px solid var(--accent);" alt="Geliştirici">
                </div>
                <h3>Belinay Korukmaz</h3>
                <p style="color:var(--accent); font-weight:bold; margin-top:5px;">Proje Kurucusu ve Baş Geliştirici</p>
                <p style="margin-top:10px; color:#555;">Bu proje, <strong>Rootlight Web Studio</strong> çatısı altında İnternet Programcılığı dersi final gereksinimleri kapsamında tek yetkili olarak tasarlanmış ve kodlanmıştır.</p>
                <span class="category-badge" style="margin-top: 15px; display: inline-block;">Geliştirici Sürümü: v2.0</span>
            </div>
        `;

    } else if (page === 'istatistik') { // SAYFA 9: İstatistikler Tablosu
        const toplamKelime = dictionary.length;
        const toplamKategori = [...new Set(dictionary.map(item => item.c))].length;
        app.innerHTML = `
            <h2>Sözlük İstatistikleri</h2>
            <p>Projenin veri tabanına ait anlık sayısal dağılım raporu aşağıdadır:</p>
            <table>
                <thead>
                    <tr><th>Metrik Başlığı</th><th>Miktar / Değer</th></tr>
                </thead>
                <tbody>
                    <tr><td><strong>Toplam Kelime Sayısı</strong></td><td>${toplamKelime} Adet</td></tr>
                    <tr><td><strong>Aktif Kategori Sayısı</strong></td><td>${toplamKategori} Benzersiz Kategori</td></tr>
                    <tr><td><strong>Dil Desteği</strong></td><td>Türkçe (tr-TR)</td></tr>
                    <tr><td><strong>Geliştirme Stüdyosu</strong></td><td>Rootlight Web Studio</td></tr>
                </tbody>
            </table>
        `;

    } else if (page === 'yasal') { // SAYFA 10: Yasal Bildirim
        app.innerHTML = `
            <h2>Yasal Bildirimler & Lisans</h2>
            <div class="info-box" style="border-left-color: #e74c3c; cursor:default;">
                <strong>Akademik Dürüstlük Beyanı:</strong>
                <p>Bu web uygulaması projesi tamamen eğitim, vize ve final değerlendirme amaçlı geliştirilmiştir. Proje içerisinde yer alan tüm kaynak kodlar ve tasarımsal hiyerarşiler telif haklarına uygun olarak yapılandırılmıştır.</p>
                <p style="margin-top:10px; font-weight:bold;">© 2026 Rootlight Web Studio. Tüm Hakları Saklıdır.</p>
            </div>
        `;
    }

    $("#app").hide().fadeIn(400);
}

// 5. SESLİ OKUMA
function speak(text) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'tr-TR';
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
}