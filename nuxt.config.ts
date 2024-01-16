export default defineNuxtConfig({
  devtools: { enabled: true },
  "app": {
    "head": {
      "htmlAttrs": {
        "data-bs-theme": "dark"
      },
      "script": [
        {
          "src": "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
        },
        {
          src: "https://code.jquery.com/jquery-3.7.0.min.js"
        }
      ],
      "link": [
        {
          "href": "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
          "rel": "stylesheet"
        }
      ]
    }
  }
})
