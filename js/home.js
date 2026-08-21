'use strict';

function home_in_animations()
{
	let done = false;
	let elements = document.querySelectorAll('#home_section .in_animation');
	let section = document.querySelector('#home_section');

	async function in_animation_check()
	{
		if (!done && is_in_viewport(section))
		{
			for (let i of elements)
			{
				i.style.opacity = '1';
				i.style.transform = 'translateY(0)';
				await sleep(300);
			}

			done = true;
		}
	}

	window.addEventListener('scroll', (e) =>
	{
		in_animation_check();
	});

	window.addEventListener('resize', (e) =>
	{
		in_animation_check();
	});

	in_animation_check();
}

function home_events()
{
	let particles_paused = false;

	particlesJS.load('particles', 'resources/jsons/particles.json');

	window.addEventListener('scroll', (e) =>
	{
		if (pJSDom[0] && document.querySelector('#particles').getBoundingClientRect().bottom < 0 && !particles_paused)
		{
			pJSDom[0].pJS.particles.move.enable = false;
			particles_paused = true;
		}

		if (pJSDom[0] && document.querySelector('#particles').getBoundingClientRect().bottom >= 0 && particles_paused)
		{
			pJSDom[0].pJS.particles.move.enable = true;
			pJSDom[0].pJS.fn.particlesRefresh();
			particles_paused = false;
		}
	});

	let rect = document.querySelector('#home_section .content').getBoundingClientRect();
	document.querySelector('#home_section').style.minHeight = (rect.height + 90) + 'px';

	name_glitch_events();
}


function name_glitch_events()
{
	const name = document.querySelector('#glitch_name');

	if (!name)
		return;

	const real_name = 'Armand Alexandru Balint';
	const alias = 'Zedpaixd';

	function set_text(text)
	{
		name.textContent = text;
		name.dataset.text = text;
	}

	function trigger()
	{
		name.classList.add('active');

		setTimeout(() =>
		{
			set_text(alias);
		}, 170);

		setTimeout(() =>
		{
			set_text(real_name);
		}, 290);

		setTimeout(() =>
		{
			set_text(alias);
		}, 350);

		setTimeout(() =>
		{
			set_text(real_name);
		}, 830);

		setTimeout(() =>
		{
			name.classList.remove('active');
			set_text(real_name);

			schedule();
		}, 950);
	}

	function schedule()
	{
		const delay = 7000 + Math.random() * 9000;

		setTimeout(trigger, delay);
	}

	setTimeout(trigger, 2500);
}