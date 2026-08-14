export default async function handler(req, res) {
  try {
    const file = req.query.file;

    if (!file) {
      return res.status(400).json({
        error: "Missing file parameter"
      });
    }

    // Only allow HTML files.
    if (!file.toLowerCase().endsWith(".html")) {
      return res.status(400).json({
        error: "Only HTML files are allowed"
      });
    }

    // Prevent weird paths from being requested.
    if (
      file.includes("..") ||
      file.includes("/") ||
      file.includes("\\")
    ) {
      return res.status(400).json({
        error: "Invalid filename"
      });
    }

    const archiveURL =
      "https://dn721907.ca.archive.org/0/items/ugsfiles/" +
      encodeURIComponent(file);

    const response = await fetch(archiveURL);

    if (!response.ok) {
      return res.status(response.status).json({
        error:
          "Archive.org returned HTTP " +
          response.status
      });
    }

    let html = await response.text();

    /*
     * Make relative assets work.

     * Example:
     *
     * <script src="game.js">
     *
     * becomes relative to the Archive.org folder
     * instead of your GitHub page.
     */
    const baseURL =
      "https://dn721907.ca.archive.org/0/items/ugsfiles/";

    const baseTag =
      `<base href="${baseURL}">`;

    if (/<head[\s>]/i.test(html)) {
      html = html.replace(
        /<head([^>]*)>/i,
        `<head$1>${baseTag}`
      );
    } else {
      html =
        `<!DOCTYPE html>
        <html>
        <head>
        ${baseTag}
        </head>
        <body>
        ${html}
        </body>
        </html>`;
    }

    res.setHeader(
      "Content-Type",
      "text/html; charset=utf-8"
    );

    res.setHeader(
      "Cache-Control",
      "public, max-age=300"
    );

    res.setHeader(
      "Access-Control-Allow-Origin",
      "*"
    );

    return res.status(200).send(html);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Failed to load game",
      details: error.message
    });
  }
}
