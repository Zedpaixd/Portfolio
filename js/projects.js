'use strict';

function projects_events()
{
	let done = [];
	let elements = [];

	async function in_animation_check()
	{
		for (let i = 0; i < elements.length; i++)
		{
			if (!done[i] && is_in_viewport(elements[i]))
			{
				if (elements[i].classList.contains('other_project'))
					await sleep(75);

				elements[i].style.opacity = '1';
				elements[i].style.transform = 'translateY(0)';
				done[i] = true;

				await sleep(200);
			}
		}
	}

	function add_project(project, inverted)
	{
		let tags = '';

		for (let tag of project.tags)
		{
			if (tag.url && tag.url != '#')
				tags += `<a href="${tag.url}" target="_blank">${tag.name}</a>`;
			else
				tags += `<span>${tag.name}</span>`;
		}

		const has_link = project.links[0] && project.links[0] != 'none' && project.links[0] != '#';

		const title = has_link
			? `<a class="project_title" href="${project.links[0]}" target="_blank">${project.title}</a>`
			: `<span class="project_title">${project.title}</span>`;

		const media = `
			<img src="${project.image}" alt="${project.title} image" width="1440px" height="810px"/>
			${project.video == 'none' || is_safari() ? '' : `
				<div class="lds-ring"><div></div><div></div><div></div><div></div></div>
				<video loop muted preload="metadata">
					<source src="${project.video}" type="video/mp4"/>
				</video>
			`}
		`;

		if (window.innerWidth > 780)
		{
			document.querySelector('#projects_section .projects_content').innerHTML += `
				<div class="in_animation project ${inverted ? 'inverted' : ''}">
					<div class="project_text">
						<div class="type">
							<span>${project.date}</span>
							<span>•</span>
							<span>${project.type}</span>
						</div>

						${title}

						<div class="text">
							<p>${project.description}</p>
						</div>

						<div class="tags">
							${tags}
						</div>
					</div>

					<div class="project_view">
						${has_link
							? `<a ${is_safari() ? 'class="safari_fix"' : ''} href="${project.links[0]}" target="_blank">${media}</a>`
							: `<div class="project_media ${is_safari() ? 'safari_fix' : ''}">${media}</div>`
						}
					</div>
				</div>
			`;
		}
		else
		{
			document.querySelector('#projects_section .projects_content').innerHTML += `
				<div class="in_animation project ${is_safari() ? 'safari_fix' : ''}" style="background-image: url('${project.image}');">
					<div class="project_text">
						<div class="type">
							<span>${project.type}</span>
							<span>•</span>
							<span>${project.date}</span>
						</div>

						${title}

						<div class="text">
							<p>${project.description}</p>
						</div>

						<div class="tags">
							${tags}
						</div>
					</div>
				</div>
			`;
		}
	}

	function add_archive_project(project)
	{
		let tags = '';

		for (let tag of project.tags.slice(0, 3))
			tags += `<span>${tag.name}</span>`;

		const has_link = project.links[0] && project.links[0] != 'none' && project.links[0] != '#';

		const title = has_link
			? `<a class="archive_project_title" href="${project.links[0]}" target="_blank">${project.title}</a>`
			: `<span class="archive_project_title">${project.title}</span>`;

		document.querySelector('#projects_section .other_projects_content').innerHTML += `
			<div class="in_animation other_project">
				<div class="archive_year">
					${project.date}
				</div>

				<div class="archive_main">
					${title}
					<p class="archive_description">${project.description}</p>
				</div>

				<div class="archive_tags">
					${tags}
				</div>
			</div>
		`;
	}

	function generate(data)
	{
		document.querySelector('#projects_section .projects_content').innerHTML = '';
		document.querySelector('#projects_section .other_projects_content').innerHTML = '';

		let inverted = false;

		for (let i = 0; i < data.projects.length; i++)
		{
			const project = data.projects[i];

			if (i < 3)
			{
				add_project(project, inverted);
				inverted = !inverted;
			}
			else
			{
				add_archive_project(project);
			}
		}

		done = [];
		elements = document.querySelectorAll('#projects_section .in_animation');

		for (let _ of elements)
			done.push(false);

		in_animation_check();
		videos_scroll_event();
	}

	function generate_projects()
	{
		read_json('resources/jsons/projects.json', generate);
	}

	window.addEventListener('scroll', () =>
	{
		in_animation_check();
	});

	window.addEventListener('resize', () =>
	{
		in_animation_check();
	});

	let prev_width = window.innerWidth;

	generate_projects();

	window.addEventListener('resize', () =>
	{
		if (
			(prev_width > 780 && window.innerWidth <= 780) ||
			(prev_width <= 780 && window.innerWidth > 780)
		)
		{
			generate_projects();
			prev_width = window.innerWidth;
		}
	});
}