// Open or create a database with the specified name
const dbName = "offline_pdf";
// Setup event handlers for database creation
const dbPromise = idb.openDB(dbName);

async function get(key) {
    return (await dbPromise).get('file', key);
}
async function set(key, val) {
    return (await dbPromise).put('file', val, key);
}
async function del(key) {
    return (await dbPromise).delete('file', key);
}
async function clear() {
    return (await dbPromise).clear('file');
}
async function keys() {
    return (await dbPromise).getAllKeys('file');
}

console.log(keys());

var promiseAllKeys = keys();
promiseAllKeys
    .then((allKeys) => {
        console.log(allKeys.length);
        for (let i = 0; i < allKeys.length; i++) {
            get(allKeys[i])
                    .then((value) => {
                        const canvasElement = document.createElement("canvas");
                    document.body.appendChild(canvasElement);

                    const fileUrl = URL.createObjectURL(value);
                    pdfjsLib.getDocument(fileUrl).then(doc=> {
                        console.log("This file has " + doc._pdfInfo.numPages + " pages");

                        doc.getPage(1).then(page => {
                            var context = canvasElement.getContext("2d");
                            var viewport = page.getViewport(0.5);
                            canvasElement.width = 800;
                            canvasElement.height = 600;
                            page.render({
                                canvasContext: context,
                                viewport: viewport,
                            })
                        })
                    })

                });
        };
    })
    .catch((error) => {
        console.error("Error resolving promise:", error);
    });