import QRCode from "qrcode-svg";

export function qrCodeInit() {
  const targetContainers = document.querySelectorAll(".qrcode-svg");
  targetContainers.forEach(function(el, index) {
      const qrcode = new QRCode({
          content: el.dataset.content,
          width: el.dataset.width,
          height: el.dataset.height,
          background: "undefined",
          padding: 0,
          container: "svg-viewbox", // Responsive use
          join: true, // Crisp rendering and 4-5x reduced file size
          predefined: false,
      });
      el.innerHTML = qrcode.svg();
  });
};

