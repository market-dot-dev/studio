(function () {
  const scripts = document.getElementsByTagName("script");
  const currentScript = scripts[scripts.length - 1];

  const server = "//" + currentScript.getAttribute("data-domain");

  // convert a settings object to a query string

  function settingsToQueryString(jsonSettings) {
    const settings = JSON.parse(jsonSettings);
    return Object.keys(settings)
      .map((key) => `${key}=${settings[key]}`)
      .join("&");
  }

  // Function to create and insert the iframe
  function createIframe() {
    // Create shimmer container
    const shimmerContainer = document.createElement("div");
    shimmerContainer.style.cssText = `
      display: flex;
      justify-content: space-between;
      gap: 20px;
      width: 100%;
      padding: 20px;
    `;

    // Create three shimmers
    for (let i = 0; i < 3; i++) {
      const shimmer = document.createElement("div");
      shimmer.style.cssText = `
        flex: 1;
        height: 500px;
        background: #f6f7f8;
        border-radius: 12px;
        background-image: linear-gradient(
          to right,
          #f6f7f8 0%,
          #edeef1 20%,
          #f6f7f8 40%,
          #f6f7f8 100%
        );
        background-repeat: no-repeat;
        background-size: 800px 500px;
        animation: shimmer 1.5s linear infinite;
      `;
      shimmerContainer.appendChild(shimmer);
    }

    // Add shimmer animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes shimmer {
        0% {
          background-position: -468px 0;
        }
        100% {
          background-position: 468px 0;
        }
      }
    `;
    document.head.appendChild(style);

    var iframe = document.createElement("iframe");
    const widget = currentScript.getAttribute("data-widget");
    const jsonSettings = currentScript.getAttribute("data-settings");

    // Insert shimmer container before creating iframe
    currentScript.parentNode.insertBefore(shimmerContainer, currentScript);

    iframe.src =
      `${server}/embed/${widget}/` +
      (jsonSettings ? `?${settingsToQueryString(jsonSettings)}` : "");
    iframe.style.width = "100%";
    iframe.style.border = "none";
    iframe.style.overflow = "hidden";
    iframe.scrolling = "no";
    iframe.style.display = "none";

    iframe.onload = function () {
      iframe.style.display = "block";
      shimmerContainer.remove();
    };

    // Insert the iframe
    currentScript.parentNode.insertBefore(iframe, currentScript);
    currentScript.parentNode.removeChild(currentScript);

    return iframe;
  }

  // Function to resize the iframe
  function resizeIframe(iframe, height) {
    iframe.style.height = height + "px";
  }

  // Event listener for iframe messages
  function setupMessageListener(iframe) {
    window.addEventListener(
      "message",
      function (event) {
        // Validate the origin of the message
        if (event.origin.endsWith(server)) {
          var data = event.data;
          if (data && data.height) {
            resizeIframe(iframe, data.height + 10);
          }
        }
      },
      false
    );
  }

  // Main
  var iframe = createIframe();
  setupMessageListener(iframe);
})();
