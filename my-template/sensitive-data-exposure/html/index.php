<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>[your company] - Sensitive data exposure</title>
    <style>
      html {
        scroll-behavior: smooth;
      }

      body {
        margin: 0;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        background-color: #121212;
        color: #e0e0e0;
        line-height: 1.7;
        scroll
      }
      header {
        background: linear-gradient(135deg, #1c1c1c, #2a2a2a);
        padding: 3rem 2rem;
        text-align: center;
      }
      header h1 {
        margin: 0;
        font-size: 3rem;
        color: #6234f8ff;
        letter-spacing: 2px;
      }
      header p {
        margin-top: 1rem;
        color: #bdbdbd;
        font-size: 1.2rem;
      }
      nav {
        margin-top: 2rem;
      }
      nav a {
        color: #e0e0e0;
        margin: 0 1.2rem;
        text-decoration: none;
        font-weight: bold;
        transition: color 0.3s ease;
      }
      nav a:hover {
        color: #6234f8ff;
      }
      section {
        max-width: 900px;
        margin: 3rem auto;
        padding: 2rem;
        background: #1e1e1e;
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
      }
      section h2 {
        color: #6234f8ff;
        margin-bottom: 1rem;
      }
      .services ul {
        list-style: none;
        padding: 0;
      }
      .services li {
        margin: 0.7rem 0;
        padding-left: 1.5rem;
        position: relative;
      }
      .services li::before {
        content: "✔";
        position: absolute;
        left: 0;
        color: #6234f8ff;
      }
      .why-choose {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }
      .why-choose div {
        background: #2a2a2a;
        padding: 1.5rem;
        border-radius: 8px;
      }
      footer {
        text-align: center;
        padding: 2rem;
        background: #1c1c1c;
        margin-top: 3rem;
        font-size: 0.9rem;
        color: #9e9e9e;
      }
    </style>
  </head>
  <body>
    <header>
      <h1>[Your company] Lab</h1>
      <p>Tradition Meets Elegance – Premium Nasi Kuning Experience</p>
      <nav>
        <a href="#about">About</a>
        <a href="#services">Services</a>
        <a href="#why">Why Us</a>
        <a href="#contact">Contact</a>
        <a href="login.php">Login</a>
      </nav>
    </header>

    <section id="about">
      <h2>About Us</h2>
      <p>
        <strong>[your company] Inc.</strong> adalah perusahaan kuliner profesional
        yang berfokus pada penyediaan nasi kuning berkualitas tinggi dengan cita
        rasa autentik nusantara. Berdiri sejak 2020, kami menggabungkan tradisi
        masakan Indonesia dengan sentuhan modern dalam penyajian, menjadikan
        nasi kuning tidak hanya sekadar makanan, tetapi juga pengalaman
        berkelas.
      </p>
      <p>
        Kami percaya bahwa makanan adalah bagian dari identitas budaya. Oleh
        karena itu, setiap sajian kami dibuat dengan bahan pilihan, rempah
        alami, dan standar higienis yang tinggi.[your company] Inc. hadir untuk
        memenuhi kebutuhan acara spesial, perayaan keluarga, maupun layanan
        katering profesional.
      </p>
    </section>

    <section id="services" class="services">
      <h2>Our Services</h2>
      <p>
        Kami menyediakan berbagai macam varian nasi kuning untuk kebutuhan Anda:
      </p>
      <ul>
        <li>Nasi Kuning Tradisional – dengan lauk pauk khas nusantara.</li>
        <li>
          Nasi Kuning Premium – disajikan dengan daging sapi pilihan dan ayam
          panggang.
        </li>
        <li>
          Nasi Kuning Celebration Box – paket khusus untuk acara ulang tahun &
          syukuran.
        </li>
        <li>
          Catering Nasi Kuning – layanan prasmanan untuk acara formal dan
          non-formal.
        </li>
      </ul>
    </section>

    <section id="why" class="why-choose">
      <div>
        <h2>Why Choose Us</h2>
        <p>
          ✔ Resep autentik yang diwariskan turun-temurun. <br />
          ✔ Penggunaan bahan segar dan berkualitas tinggi. <br />
          ✔ Tim profesional dengan pengalaman kuliner. <br />
          ✔ Pelayanan tepat waktu dan ramah. <br />
        </p>
      </div>
      <div>
        <h2>Our Vision</h2>
        <p>
          Menjadi brand kuliner nasi kuning nomor satu di Indonesia yang dikenal
          tidak hanya karena rasa, tetapi juga kualitas dan pelayanan prima.
        </p>
      </div>
    </section>

    <section id="contact">
      <h2>Contact</h2>
      <p>
        Email:
        <a href="mailto:info@nasikuninginc.com">info@nasikuninginc.com</a>
      </p>
      <p>Phone: +62 812 3456 7890</p>
      <p>Address: Jl. Nusantara batu No. 45, Jakarta, Indonesia</p>
    </section>

    <footer>&copy; 2025 [your company] Inc. All rights reserved.</footer>
  </body>
</html>
