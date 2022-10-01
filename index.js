const http = require("http");
const path = require("path");
const fs = require("fs");

const server = http.createServer((req, res) => {

    const myUrl = new URL('http://localhost:5000' + req.url)

    switch (myUrl.pathname) {
        case '/api/books':
            // See available properties
            // console.log(req)
            let data = require('./storage/books.json')
            switch (req.method) {
                case "GET":
                    res.writeHead(200, 'application/json')
                    res.end(JSON.stringify(data));
                    break;
                case 'POST':
                    let addedData = {}
                    myUrl.searchParams.forEach((value, key) => {
                        addedData[key] = value
                    })
                    data = [...data, addedData]
                    fs.writeFileSync("storage/books.json", JSON.stringify(data))
                    res.writeHead(200, 'application/json')
                    res.end("Added Successfully")
                    break;
                default:
                    res.end("Request Method not Supported")
                    break;
            }
        break;
        default:
            // Build file path
            let filePath = path.join(
                __dirname,
                "public",
                myUrl.pathname === "/" ? "index.html" : myUrl.pathname
            );

            // Extension of file
            let extname = path.extname(filePath);

            // Initial content type
            let contentType = "text/html";

            // Check ext and set content type
            switch (extname) {
                case ".js":
                contentType = "text/javascript";
                break;
                case ".css":
                contentType = "text/css";
                break;
                case ".json":
                contentType = "application/json";
                break;
                case ".pdf":
                contentType = "application/pdf";
                break;
            }

            // Check if contentType is text/html but no .html file extension
            if (contentType == "text/html" && extname == "") filePath += ".html";

            // log the filePath
            console.log(filePath);

            // Read File
            fs.readFile(filePath, (err, content) => {
                if (err) {
                if (err.code == "ENOENT") {
                    // Page not found
                    fs.readFile(
                    path.join(__dirname, "public", "404.html"),
                    (err, content) => {
                        res.writeHead(404, { "Content-Type": "text/html" });
                        res.end(content, "utf8");
                    }
                    );
                } else {
                    //  Some server error
                    res.writeHead(500);
                    res.end(`Server Error: ${err.code}`);
                }
                } else {
                // Success
                res.writeHead(200, { "Content-Type": contentType });
                res.end(content, "utf8");
                }
            });
        break;
    }
})


// Launching server
const PORT = process.env.PORT || 5000;


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));