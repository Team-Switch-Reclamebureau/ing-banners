// wait until DOM is ready
document.addEventListener('DOMContentLoaded', function (event) {
	// console.log('DOM loaded');

	//wait until images, links, fonts, stylesheets, and js is loaded
	// window.addEventListener('load', () => animate(), false);

	// wait until all fonts are loaded
	document.fonts.ready.then(() => animate());

	// wait until all other scripts are loaded

	function animate() {
		// new timeline
		const tl = gsap.timeline();

		// slide 1
		var slide1Duration = 4;
		// slide1Duration = 1; //DEV
		tl.to('.slide-1 .text', {
			duration: slide1Duration / 2,
			opacity: 1,
			y: 0,
			ease: 'ease-out',
		});
		tl.to(
			'.slide-1 .disclaimer',
			{
				duration: 1,
				opacity: 1,
				ease: 'ease-out',
			},
			'<'
		);
		tl.to(
			'.slide-1 .image img',
			{
				duration: slide1Duration,
				y: 300,
				ease: 'ease',
			},
			'<'
		);

		// transition between slide 1 and slide 2
		var swipePart1 = 0.75;
		var pause = 0.25;
		var swipePart2 = 0.75;
		// swipePart1, pause, swipePart2 = 0; //DEV
		tl.to('.slide-1', {
			duration: swipePart1,
			height: '50%',
			ease: 'ease-out',
		});
		tl.to(
			'.slide-1 .text',
			{
				duration: swipePart1,
				scale: '0.75',
				x: -16,
				ease: 'ease-out',
			},
			'<'
		);
		tl.to(
			'.slide-1 .disclaimer',
			{
				duration: swipePart1,
				opacity: '0',
				ease: 'ease-out',
			},
			'<'
		);
		tl.to(
			'.slide-2',
			{
				duration: swipePart1,
				top: '50%',
				height: '50%',
				ease: 'ease-out',
			},
			'<'
		);

		// halfway point

		tl.to('.slide-1', {
			duration: swipePart2,
			delay: pause,
			bottom: '100%',
			height: '0',
			ease: 'ease-out',
		});
		tl.to(
			'.slide-1 .text',
			{
				duration: swipePart2,
				opacity: '0',
				ease: 'ease-out',
			},
			'<'
		);
		tl.to(
			'.slide-2',
			{
				duration: swipePart2,
				top: '0',
				height: '100%',
				ease: 'ease-out',
			},
			'<'
		);

		// // slide 2
		var slide2Duration = 3;
		tl.to('.slide-1', {
			duration: 0,
			width: '0',
			ease: 'ease-out',
		});
		tl.from('.slide-2 .text > span.orange', {
			duration: 0.5,
			opacity: 0,
			y: 16,
			ease: 'ease-out',
		});
		tl.from(
			'.slide-2 .text .bg',
			{
				duration: 0.75,
				transform: 'scale(0, 100%)',
				ease: 'ease-out',
			},
			'<'
		);
		tl.staggerFrom(
			'.slide-2 .text span > k',
			0.125,
			{
				opacity: 0,
				y: 8,
				ease: 'ease',
			},
			0.125,
			'<'
		);
		tl.from(
			'.slide-2 .text span.purple',
			{
				duration: 0.5,
				opacity: 0,
				y: 8,
				ease: 'ease-out',
			},
			'-=0.5'
		);
		tl.to(
			'.slide-2 .image img',
			{
				duration: slide2Duration,
				scale: 1.025,
				ease: 'linear',
			},
			'<'
		);

		// slide extra

		tl.to('.slide-2', {
			duration: 0,
			width: '0',
			ease: 'ease-out',
		});
		tl.to(
			'.slide-2 .text',
			{
				duration: 0,
				opacity: '0',
				ease: 'ease-out',
			},
			'<'
		);
		tl.to(
			'.slide-2 .image img',
			{
				duration: 0,
				opacity: '0',
				ease: 'ease-out',
			},
			'<'
		);
		tl.to(
			'.slide-extra',
			{
				duration: 1,
				opacity: '1',
				ease: 'ease-out',
			},
			'<'
		);
		tl.to(
			'.logo .logo-orange',
			{
				duration: 0,
				opacity: '0',
			},
			'<'
		);
		tl.to(
			'.logo .logo-white',
			{
				duration: 0,
				opacity: '1',
			},
			'<'
		);

		var slide2Duration = 3;
		tl.from('.slide-extra .text > span.orange', {
			duration: 0.5,
			opacity: 0,
			y: 16,
			ease: 'ease-out',
		});
		tl.from(
			'.slide-extra .text .bg',
			{
				duration: 0.75,
				transform: 'scale(0, 100%)',
				ease: 'ease-out',
			},
			'<'
		);
		tl.staggerFrom(
			'.slide-extra .text span > k',
			0.125,
			{
				opacity: 0,
				y: 8,
				ease: 'ease',
			},
			0.125,
			'<'
		);
		tl.from(
			'.slide-extra .text span.purple',
			{
				duration: 0.5,
				opacity: 0,
				y: 8,
				ease: 'ease-out',
			},
			'-=0.5'
		);
		tl.to(
			'.slide-extra .image img',
			{
				duration: slide2Duration,
				scale: 1.025,
				ease: 'linear',
			},
			'<'
		);

		tl.to({}, 2, {}); // pause for 2 seconds
	}
});
