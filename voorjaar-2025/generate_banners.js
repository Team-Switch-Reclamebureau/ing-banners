// read banners.json and generate banners based on the template folder, the output is html
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const sharp = require('sharp');

const templateBaseDir = path.join(__dirname, 'template');
const bannersFile = path.join(__dirname, 'banners.json');
const banners = JSON.parse(fs.readFileSync(bannersFile, 'utf8'));

// remove generated folder if it exists
const generatedDir = path.join(__dirname, 'generated');
if (fs.existsSync(generatedDir)) {
	fs.rmdirSync(generatedDir, { recursive: true });
}

// loop through all variants
banners.variants.forEach((variant) => {
	let imagePath = variant.image;
	// loop through all sizes
	banners.sizes.forEach((size) => {
		// let templateDir = path.join(templateBaseDir, size.template);
		let templateDir = templateBaseDir;
		const { width, height } = size;
		const outputDir = path.join(
			__dirname,
			`generated/${width}x${height}-${slugify(
				variant.headline[0]
			)}-${slugify(variant.headline[1])}`
		);
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}
		const srcDir = path.join(
			__dirname,
			`generated/${width}x${height}-${slugify(
				variant.headline[0]
			)}-${slugify(variant.headline[1])}/src`
		);
		if (!fs.existsSync(srcDir)) {
			fs.mkdirSync(srcDir, { recursive: true });
		}

		// loop through all template files
		fs.readdir(templateDir, (err, files) => {
			if (err) throw err;

			files.forEach((file) => {
				// check if the file is a folder
				if (fs.lstatSync(path.join(templateDir, file)).isDirectory()) {
					// if it is a folder, copy the folder to the output directory
					const folderPath = path.join(templateDir, file);
					const outputFolderPath = path.join(outputDir, file);
					if (!fs.existsSync(outputFolderPath)) {
						fs.mkdirSync(outputFolderPath, { recursive: true });
					}
					fs.readdir(folderPath, (err, files) => {
						if (err) throw err;
						files.forEach((file) => {
							const filePath = path.join(folderPath, file);
							const outputFilePath = path.join(
								outputFolderPath,
								file
							);
							fs.copyFileSync(filePath, outputFilePath);
						});
					});
					return;
				}

				const templatePath = path.join(templateDir, file);
				const templateContent = fs.readFileSync(templatePath, 'utf8');
				const template = handlebars.compile(templateContent);

				// Generate the HTML
				const html = template({
					...size,
					...variant,
					date: new Date().toLocaleDateString('nl-NL', {
						year: 'numeric',
						month: '2-digit',
						day: '2-digit',
					}),
				});

				// Write the HTML to a file
				const outputFilePath = path.join(
					outputDir,
					`${file.replace('.hbs', '.html')}`
				);
				fs.writeFileSync(outputFilePath, html);
			});
		});

		// resize the image in imagePath to the correct size and put it in the output directory as image_scaled.jpg
		const imageScaledPath = path.join(srcDir, 'image_scaled.jpg');
		let scaledImage = imagePath;
		sharp(scaledImage)
			.resize(
				size.imageWidth ? size.imageWidth : width,
				size.imageHeight ? size.imageHeight : height
			)
			.toFile(imageScaledPath, (err) => {
				if (err) {
					console.error('Error resizing image:', err);
				} else {
					console.log(`Resized image saved to ${imageScaledPath}`);
				}
			});
	});
});

function slugify(str) {
	str = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing white space
	str = str.toLowerCase(); // convert string to lowercase
	str = str
		.replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
		.replace(/\s+/g, '-') // replace spaces with hyphens
		.replace(/-+/g, '-'); // remove consecutive hyphens
	return str;
}