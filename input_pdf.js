document.querySelector("#btn_submit").addEventListener('click',function(){
    file_id = document.querySelector("#file_id").value;
    file = document.querySelector("#item_file").value;
    
	// Open or create a database with the specified name
	const dbName = "offline_pdf";
	// Setup event handlers for database creation
	const dbPromise = idb.openDB(dbName, 1, {
		upgrade(db) {
			// db.createObjectStore("images", { keyPath: "id", autoIncrement: true });
			db.createObjectStore("file");
			console.log("Database and object store created successfully!");
		}
	});
	
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
	
	// Read the image file and save it in the database
	var blob = new Blob([document.querySelector("#item_file").files[0]], {type: "application/pdf"});
	console.log("blob", blob);

	set(file_id, blob);
	
	// Retrieve the blob using the imageId
	const promise_blob = get(file_id)
	let blob_value;
	promise_blob
		.then((value) => {
			blob_value = value;
			console.log('value', value); // Output: Promise resolved with a value
			// // Create a URL for the blob
			console.log('blob_value inside', blob_value);

			const fileUrl = URL.createObjectURL(blob);
			console.log('fileUrl', fileUrl);

			// Display the pdf using an <canvas> tag
			const canvasElement = document.createElement("canvas");
			// canvasElement.src = fileUrl;

			document.body.appendChild(canvasElement);

			pdfjsLib.getDocument(fileUrl).then(doc=> {
				console.log("This file has " + doc._pdfInfo.numPages + " pages");

				doc.getPage(1).then(page => {
					var myCanvas = document.getElementById('my_canvas');
					var context = myCanvas.getContext("2d");
					var viewport = page.getViewport(0.5);
					myCanvas.width = viewport.width;
					myCanvas.height = viewport.height;

					page.render({
						canvasContext: context,
						viewport: viewport,
					})
				})
			})
		})
		.catch((error) => {
			console.error("Error resolving promise:", error);
		});
});


