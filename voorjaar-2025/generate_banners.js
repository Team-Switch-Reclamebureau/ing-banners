// read banners.json and generate banners based on the template folder, the output is html
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const sharp = require('sharp');
const puppeteer = require('puppeteer-core');
const zip = require('adm-zip');

const templateBaseDir = path.join(__dirname, 'template');
const bannersFile = path.join(__dirname, 'banners.json');
const banners = JSON.parse(fs.readFileSync(bannersFile, 'utf8'));

let bannerLinks = [];

// remove generated folder if it exists
const generatedDir = path.join(__dirname, 'generated');
if (fs.existsSync(generatedDir)) {
	fs.rmSync(generatedDir, { recursive: true });
}

// loop through all variants
banners.variants.forEach((variant) => {
	let imagePath = variant.image;
	bannerLinks[variant.id] = [];
	// loop through all sizes
	banners.sizes.forEach((size) => {
		// let templateDir = path.join(templateBaseDir, size.template);
		let templateDir = templateBaseDir;
		const { width, height } = size;
		const headlineFull = variant.headline.join(' ');
		const outputDir = path.join(
			__dirname,
			`generated/${variant.id}-${width}x${height}-${slugify(
				headlineFull
			)}`
		);
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}
		const srcDir = path.join(
			__dirname,
			`generated/${variant.id}-${width}x${height}-${slugify(
				headlineFull
			)}/src`
		);
		if (!fs.existsSync(srcDir)) {
			fs.mkdirSync(srcDir, { recursive: true });
		}

		// add uri to bannerLinks
		bannerLinks[variant.id].push({
			uri: `${variant.id}-${width}x${height}-${slugify(
				headlineFull
			)}/index.html`,
			width: width,
			height: height,
			headline: headlineFull,
		});

		let generateFiles = true;
		if (generateFiles) {
			// loop through all template files and add the necessary files to the output directory
			const fileWhitelist = [
				'blob.svg',
				'id.svg',
				'INGdisplay-Bold.woff2',
				'INGMe-Bold.woff2',
				'script.js',
				'style.css',
			];
			fileWhitelist.push(`${size.template}.css`, `${size.template}.js`);

			// copy the template files to the output directory
			fs.readdir(templateDir, (err, files) => {
				if (err) throw err;

				files.forEach((file) => {
					// check if the file is a folder
					if (
						fs.lstatSync(path.join(templateDir, file)).isDirectory()
					) {
						// if it is a folder, copy the folder to the output directory
						const folderPath = path.join(templateDir, file);
						const outputFolderPath = path.join(outputDir, file);
						if (!fs.existsSync(outputFolderPath)) {
							fs.mkdirSync(outputFolderPath, { recursive: true });
						}
						fs.readdir(folderPath, (err, files) => {
							if (err) throw err;
							files.forEach((file) => {
								if (fileWhitelist.includes(file)) {
									// copy the file to the output directory
									const filePath = path.join(
										folderPath,
										file
									);
									const outputFilePath = path.join(
										outputFolderPath,
										file
									);
									fs.copyFileSync(filePath, outputFilePath);
								}
							});
						});
						return;
					}

					const templatePath = path.join(templateDir, file);
					const templateContent = fs.readFileSync(
						templatePath,
						'utf8'
					);
					const template = handlebars.compile(templateContent);

					handlebars.registerHelper('eq', function (a, b) {
						return a === b;
					});

					handlebars.registerHelper('and', function (...args) {
						// Remove the last argument (Handlebars options object)
						args.pop();
						return args.every(Boolean);
					});

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
		}

		// resize the image in imagePath to the correct size and put it in the output directory as image_scaled.jpg
		let generateImages = true;
		if (generateImages) {
			const imageScaledPath = path.join(srcDir, 'image_scaled.jpg');
			let scaledImage = imagePath;
			let position = false;
			if ('imageAlign' in variant) {
				switch (variant.imageAlign) {
					case 'entropy':
						position = sharp.strategy.entropy;
						break;

					case 'attention':
						position = sharp.strategy.attention;
						break;

					default:
						position = variant.imageAlign;
						break;
				}
			}

			sharp(scaledImage)
				.resize(
					size.imageWidth ? size.imageWidth : width,
					size.imageHeight ? size.imageHeight : height,
					{
						quality: 80,
						position,
					}
				)
				.toFile(imageScaledPath, (err) => {
					if (err) {
						console.error('Error resizing image:', err);
					} else {
						// console.log(
						// 	`Resized image saved to ${imageScaledPath}`
						// );
					}
				});
		}

		// run the resulting index.html file, let the animation run, then save the resulting image as image.jpg
		let generareFallbackImages = true;
		if (generareFallbackImages) {
			const indexPath = path.join(outputDir, 'index.html');
			const outputImagePath = path.join(outputDir, 'fallback.jpg');
			(async () => {
				const browser = await puppeteer.launch({
					headless: true,
					args: ['--no-sandbox', '--disable-setuid-sandbox'],
					executablePath:
						'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // Path to Chrome on macOS
				});
				const page = await browser.newPage();

				// Set the viewport to the desired width and height
				await page.setViewport({
					width: width,
					height: height,
				});

				await page.goto(`file://${indexPath}`, {
					waitUntil: 'networkidle0',
				});

				// Wait for the animation to complete
				await new Promise((resolve) => setTimeout(resolve, 5000));

				// Capture a screenshot and save it to the outputImagePath
				await page.screenshot({
					path: outputImagePath,
					fullPage: false, // Capture only the viewport
				});

				console.log(`Screenshot saved to ${outputImagePath}`);

				await browser.close();
			})().catch((error) => {
				console.error('Error capturing screenshot:', error);
			});
		}

		let generateZipFiles = true;
		if (generateZipFiles) {
			const archiveDir = path.join(
				generatedDir,
				`${variant.id}-${width}x${height}-${slugify(headlineFull)}.zip`
			);
			const archive = new zip();
			archive.addLocalFolder(srcDir);
			archive.writeZip(archiveDir);
			console.log(`Generated zip file at ${archiveDir}`);
		}
	});
});

// generate an index.html file that has iframes for each of the generated html files, like an overview
const overviewHtml = `<html>
<head>
	<title>Overview</title>
	<link rel="stylesheet" href="../../css/style.min.css">
</head>
<body>
	<h1>Voorjaar 2025</h1>
	${Object.keys(bannerLinks)
		.map((id) => {
			let headline = bannerLinks[id][0].headline;
			return `<h2>${id} - ${headline}</h2>
			<section>
			<div class="row">
				${bannerLinks[id]
					.map((banner) => {
						return `
						<div class="item">
							<iframe src="${banner.uri}" width="${banner.width}" height="${
							banner.height
						}" frameborder="0"></iframe>
							<div class="footer">
								<p>${banner.width} x ${banner.height}</p>
								<a href="${banner.uri}" target="_blank">
									bekijk los
								</a>
								<a href="${banner.uri.replace('index.html', 'fallback.jpg')}" target="_blank">
									fallback image
								</a>
								<a hidden href="${banner.uri.replace('/index.html', '.zip')}" target="_blank">
									download .zip
								</a>
							</div>
						</div>`;
					})
					.join('')}
			</div>
			</section>`;
		})
		.join('')}
</body>
</html>`;

const overviewPath = path.join(generatedDir, 'index.html');
console.log(
	`Generated overview file at ${overviewPath} with ${banners.variants.length} variants`
);
fs.writeFileSync(overviewPath, overviewHtml);

function slugify(str) {
	str = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing white space
	str = str.toLowerCase(); // convert string to lowercase
	str = str
		.replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
		.replace(/\s+/g, '-') // replace spaces with hyphens
		.replace(/-+/g, '-'); // remove consecutive hyphens
	return str;
}
