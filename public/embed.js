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
    var iframe = document.createElement("iframe");
    const widget = currentScript.getAttribute("data-widget");
    const jsonSettings = currentScript.getAttribute("data-settings");
    iframe.src =
      `${server}/embed/${widget}/` +
      (jsonSettings ? `?${settingsToQueryString(jsonSettings)}` : ""); // URL of your iframe content
    iframe.style.width = "100%";
    iframe.style.border = "none";
    iframe.style.overflow = "hidden";
    iframe.scrolling = "no";
    document.body.appendChild(iframe); // Adjust this to insert the iframe where you want

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
        if (event.origin === server) {
          var data = event.data;
          if (data && data.height) {
            resizeIframe(iframe, data.height);
          }
        }
      },
      false,
    );
  }

  // Main
  var iframe = createIframe();
  setupMessageListener(iframe);
})();
