const form = document.querySelector('.form');

form.substring.addEventListener('input', () => deleteErrorMessage('substring'));

document.body.addEventListener('keydown', (e) => {
	if (e.code == 'Enter' && e.target.nodeName != 'INPUT') handler();
})
form.addEventListener('submit', handler);

async function handler(e) {
	e?.preventDefault();

	if ( !validateInput('substring') ) return;

	const url = new URL('https://api.github.com/search/repositories');
	url.searchParams.set('per_page', 10);
	url.searchParams.set('q', form.substring.value);

	const arrayOfRepo = await fetch(url)
						.then(response => response.json())
						.then(obj => obj.items);


	arrayOfRepo.forEach((repo) => {
		const li = document.createElement('li');
		li.classList.add('repo');		
	
		const elements = [
			['name', 'name'],
			['owner', 'owner'],
			['createDate', 'data'],
			['updateDate', 'data'],
			['language', 'data']
		];
		elements.forEach( ([element, selector]) => li.append(createElement(element, selector, repo)) );
	
		document.querySelector('.results').append(li);
	});


	form.reset();

}


function createElement(elementType, elementSelector, repo) {
	const div = elementType != 'name' ? document.createElement('div') : null;

	div?.classList.add(`repo__${elementSelector}`);

	switch (elementType) {
		case 'name':
			const nameLink = document.createElement('a');
			nameLink.classList.add(`repo__${elementSelector}`);

			nameLink.textContent = repo.name;
			nameLink.href = repo.html_url;
			nameLink.target = '_blank';

			return nameLink;
			break;

		case 'owner':
			div.textContent = 'Владелец: ';

			const ownerLink = document.createElement('a');
			ownerLink.textContent = repo.owner.login;
			ownerLink.href = repo.owner.html_url;
			ownerLink.target = '_blank';
			

			div.append(ownerLink);
			break;

		case 'createDate':
			div.textContent = 'Дата создания: ';

			const createSpan = document.createElement('span');
			createSpan.textContent = getFormatedDate(repo.created_at);

			div.append(createSpan);
			break;
		
		case 'updateDate':
			div.textContent = 'Дата обновления: ';

			const updateSpan = document.createElement('span');
			updateSpan.textContent = getFormatedDate(repo.updated_at);

			div.append(updateSpan);
			break;
		
		case 'language':
			div.textContent = 'Язык: ';

			const languageSpan = document.createElement('span');
			languageSpan.textContent = repo.language ? repo.language : 'No data :(';

			div.append(languageSpan);
			break;
	}

	return div;
}

function getFormatedDate(date) {
	let newDate;

	newDate = date.slice(8, 10) + '.' 
			+ date.slice(5, 7) + '.'
			+ date.slice(0, 4);
	
	return newDate;
}

function validateInput(inputId) {
	const input = document.getElementById(inputId);

	if (input.value.trim().length < 2 || input.value.trim().length >= 150) {
		addErrorMessage(input, 'Введите корректную подстроку!')
		return false;
	}

	return true;
}

function addErrorMessage(input, text) {
	const error = document.createElement('div');

	error.classList.add('form__error');
	error.textContent = text;
	error.dataset.for = input.name;

	error.style.top = input.getBoundingClientRect().bottom + window.pageYOffset + 5 + 'px';
	error.style.left = input.getBoundingClientRect().left + window.pageXOffset + 'px';

	form.append(error);
}

function deleteErrorMessage(inputName) {
	const errors = document.querySelectorAll('.form__error');

	errors.forEach((e) => {
		if (e.dataset.for == inputName) e.remove();
	})
}