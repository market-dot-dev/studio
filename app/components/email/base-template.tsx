export const BaseEmailTemplate = ({
  previewText,
  children,
}: {
  previewText: string;
  children: React.ReactNode;
}) => {
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html dir="ltr" lang="en">
      <head>
        <link
          rel="preload"
          as="image"
          href="https://market.dev/market-dot-dev-logo.png"
        />
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        <meta name="x-apple-disable-message-reformatting" />
      </head>
      <div
        style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0"
      >
        ${previewText}
        <div>
          ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏
        </div>
      </div>
      <body
        style='padding-top:64px;background-color:#f6f9fc;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif'
      >
        <table
          align="center"
          width="100%"
          border="0"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
          style="max-width:37.5em;background-color:#ffffff;margin:0 auto;padding:48px 0 48px;margin-bottom:64px;border-radius:10px;"
        >
          <tbody>
            <tr style="width:100%">
              <td>
                <table
                  align="center"
                  width="100%"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="padding:0 48px"
                >
                  <tbody>
                    <tr>
                      <td>
                        <img
                          alt="market.dev"
                          height="27"
                          src="https://market.dev/market-dot-dev-logo.png"
                          style="display:block;outline:none;border:none;text-decoration:none"
                          width="140"
                        />
                        <hr
                          style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0"
                        />
                        ${children}
                        <hr
                          style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0"
                        />
                        <p
                          style="font-size:12px;line-height:16px;margin:16px 0;color:#8898aa"
                        >
                          Powered by market.dev
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  `;
}; 