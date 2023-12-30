(function() {

    const scripts = document.getElementsByTagName('script');
    const currentScript = scripts[scripts.length - 1];
    const protocol = currentScript.getAttribute('src').split("://")?.[0] ?? 'https';
    
    const server = protocol + "://" + currentScript.getAttribute('data-domain');
    
    // Function to create and insert the iframe
    function createIframe() {
        var iframe = document.createElement('iframe');
        const widget = currentScript.getAttribute('data-widget');
        iframe.src = `${server}/embed/${widget}`; // URL of your iframe content
        iframe.style.width = '100%';
        iframe.style.border = 'none';
        iframe.style.overflow = 'hidden';
        iframe.scrolling = 'no';
        document.body.appendChild(iframe); // Adjust this to insert the iframe where you want

        return iframe;
    }

    // Function to resize the iframe
    function resizeIframe(iframe, height) {
        iframe.style.height = height + 'px';
    }

    // Event listener for iframe messages
    function setupMessageListener(iframe) {
        
        window.addEventListener('message', function(event) {
            
            // Validate the origin of the message
            if (event.origin === server) {
                var data = event.data;
                if (data && data.height) {
                    resizeIframe(iframe, data.height);
                }
            }
        }, false);
    }

    // Main
    var iframe = createIframe();
    setupMessageListener(iframe);
})();
