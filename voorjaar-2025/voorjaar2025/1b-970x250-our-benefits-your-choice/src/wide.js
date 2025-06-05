// wait until DOM is ready
document.addEventListener('DOMContentLoaded', function (event) {
	document.fonts.ready.then(() => animate());

	function animate() {
		const tl = gsap.timeline();

		const banner = document.querySelector('#banner');
		width = Number.isInteger(Number(banner.dataset.width))
			? banner.dataset.width
			: 970;
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
		const ease = 'power2.ease-out';

		// delay the animation
		tl.to(banner, {
			duration,
			opacity: 1,
			ease,
		});
		// slide the image to the left
		tl.to(imageSlide, {
			duration,
			opacity: 1,
			// width: width * 0.4,
			ease,
		});
		// slide the img to the top
		tl.to(
			image,
			{
				duration,
				width: width * 0.4,
				ease,
			},
			`<`
		);

		// slide the content partly into view
		tl.to(
			contentSlide,
			{
				duration,
				left: width * 0.4,
				width: width * 0.6,
				ease,
			},
			`<`
		);

		// move the logo to its normal position
		tl.from(
			logo,
			{
				duration: duration * 1.25,
				y: height * 0.375,
				ease,
			},
			`<`
		);

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
				ease: 'power1.inOut',
				yoyo: true,
				repeat: 3,
			},
			`<`
		);
	}
});
