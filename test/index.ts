import $ from '../src';

$(() => {
	$('.select')
		.css({
			background: 'blue',
			color: 'white',
		})
		.animate(
			{
				background: 'purple',
				color: 'red',
			},
			2000
		);
});
