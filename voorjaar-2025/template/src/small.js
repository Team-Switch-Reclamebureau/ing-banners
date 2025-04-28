// wait until DOM is ready
document.addEventListener('DOMContentLoaded', function (event) {
	document.fonts.ready.then(() => animate());

	function animate() {
		const tl = gsap.timeline();

		const banner = document.querySelector('#banner');
		width = Number.isInteger(Number(banner.dataset.width))
			? banner.dataset.width
			: 300;
		height = Number.isInteger(Number(banner.dataset.height))
			? banner.dataset.height
			: 250;

		const imageSlide = document.querySelector('.image');
		const image = imageSlide.querySelector('img');
		const contentSlide = document.querySelector('.content');
		const logo = document.querySelector('.logo');
		const text = document.querySelector('.text');
		const button = document.querySelector('.button');

		const duration = 0.6;
		const ease = 'cubic-bezier(0.87, 0, 0.28, 1)';

		// delay the animation for 0.5 seconds
		tl.to(banner, {
			duration,
			opacity: 1,
			ease,
		});
		// slide the image to the side
		tl.to(imageSlide, {
			duration,
			opacity: 1,
			x: width * -0.4,
			ease,
		});
		// slide the img to the right
		tl.to(
			image,
			{
				duration,
				x: width * 0.2,
				ease,
			},
			`<`
		);

		// slide the content partly into view
		tl.to(
			contentSlide,
			{
				duration,
				x: width * 0.6,
				width: width * 0.4,
				ease,
			},
			`<`
		);
		// move the logo to the center
		// tl.to(
		// 	logo,
		// 	{
		// 		duration,
		// 		y: height * 0.5 - logo.offsetHeight * 1.5,
		// 		ease,
		// 	},
		// 	`<`
		// );

		// fade in the logo
		tl.to(logo, {
			duration,
			opacity: 1,
			ease,
		});

		// slide out the image
		tl.to(imageSlide, {
			duration,
			x: -width,
			ease,
		});
		tl.to(
			image,
			{
				duration,
				x: width * 0.5,
				ease,
			},
			`<`
		);
		// slide in the content
		tl.to(
			contentSlide,
			{
				duration,
				x: 0,
				width: width,
				ease,
			},
			`<`
		);
		// move the logo to its normal position
		// tl.to(logo, {
		// 	duration,
		// 	y: 0,
		// 	ease,
		// });

		// fade in the text, the text contains two span elements so they can stagger
		tl.fromTo(
			text.querySelectorAll('span'),
			{
				// opacity: 0,
				y: height * 0.05,
			},
			{
				duration,
				y: 0,
				opacity: 1,
				ease,
				stagger: duration * 0.25,
			}
		);
		// fade in the button
		tl.to(button, {
			duration,
			opacity: 1,
			ease,
		});

		// pulse the button
		tl.to(
			button,
			{
				duration,
				scale: 1.05,
				ease,
				yoyo: true,
				repeat: 3,
			},
			`<`
		);
	}
});
