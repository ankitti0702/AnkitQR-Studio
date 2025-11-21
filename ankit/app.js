// 🌙 Theme Toggle
const modeSwitch = document.getElementById("modeSwitch");
modeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("dark", modeSwitch.checked);
});

// 📄 Section Navigation
function showSection(name) {
  document.querySelectorAll("main section").forEach(sec => sec.classList.add("hidden"));
  document.getElementById(name + "Section").classList.remove("hidden");
}

// ⚡ QR Generator (Updated for new QRCode@1.5.1)
function generateQR() {
  const text = document.getElementById("qrData").value.trim();
  if (!text) return alert("Enter text or URL");

  const qrColor = document.getElementById("qrColor").value;
  const qrBgColor = document.getElementById("qrBgColor").value;
  const qrSize = parseInt(document.getElementById("qrSize").value);

  const qrContainer = document.getElementById("qrcode");
  qrContainer.innerHTML = "";

  // Create canvas dynamically
  const canvas = document.createElement("canvas");
  qrContainer.appendChild(canvas);

  // Generate QR using new library
  QRCode.toCanvas(
    canvas,
    text,
    {
      width: qrSize,
      margin: 1,
      color: {
        dark: qrColor,
        light: qrBgColor,
      },
    },
    function (error) {
      if (error) {
        console.error(error);
        alert("Error generating QR Code!");
      } else {
        document.getElementById("qrActions").style.display = "block";
      }
    }
  );
}

// 💾 Download QR (works with new canvas QR)
function downloadQR() {
  const canvas = document.querySelector("#qrcode canvas");
  if (!canvas) return alert("Please generate a QR first!");

  const link = document.createElement("a");
  link.download = "smartqr.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// 📜 History (LocalStorage)
function saveHistory() {
  const text = document.getElementById("qrData").value;
  if (!text) return alert("Generate first");
  let history = JSON.parse(localStorage.getItem("qrHistory")) || [];
  history.push(text);
  localStorage.setItem("qrHistory", JSON.stringify(history));
  alert("QR saved to history!");
}

function loadHistory() {
  const list = document.getElementById("historyList");
  list.innerHTML = "";
  const history = JSON.parse(localStorage.getItem("qrHistory")) || [];
  history.forEach((item, i) => {
    const div = document.createElement("div");
    div.textContent = `${i + 1}. ${item}`;
    list.appendChild(div);
  });
}
function clearHistory() {
  localStorage.removeItem("qrHistory");
  document.getElementById("historyList").innerHTML = "";
  alert("History cleared!");
}
window.onload = loadHistory;

// 📊 Analytics
const ctx = document.getElementById("qrChart");
if (ctx) {
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Generated", "Saved", "Scanned"],
      datasets: [
        {
          label: "Usage Stats",
          data: [12, 7, 5],
        },
      ],
    },
  });
}

// 📷 QR Scanner (using camera)
let videoStream = null;
async function startScanner() {
  const video = document.getElementById("scannerVideo");
  const canvas = document.getElementById("scannerCanvas");
  const context = canvas.getContext("2d");
  videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
  video.srcObject = videoStream;

  const scanLoop = () => {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imgData.data, imgData.width, imgData.height);
      if (code) {
        document.getElementById("scanResult").textContent = "QR Detected: " + code.data;
      }
    }
    if (videoStream) requestAnimationFrame(scanLoop);
  };
  requestAnimationFrame(scanLoop);
}

function stopScanner() {
  if (videoStream) {
    videoStream.getTracks().forEach(track => track.stop());
    videoStream = null;
    document.getElementById("scanResult").textContent = "Scanner stopped.";
  }
}

// 🔐 Demo Login / Signup
function signup() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (!user || !pass) return alert("Fill all fields");
  localStorage.setItem("user", JSON.stringify({ user, pass }));
  document.getElementById("authMsg").textContent = "Signup successful!";
}
function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  const stored = JSON.parse(localStorage.getItem("user"));
  if (stored && stored.user === user && stored.pass === pass)
    document.getElementById("authMsg").textContent = "Login successful!";
  else document.getElementById("authMsg").textContent = "Invalid credentials!";
}
