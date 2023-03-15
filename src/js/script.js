const form = document.querySelector('.form');

form.substring.addEventListener('input', () => deleteErrorMessage('substring'));

document.body.addEventListener('keydown', (e) => {
	if (e.code == 'Enter' &&  e.target.nodeName != 'INPUT') handler();
})
form.addEventListener('submit', handler);

async function handler(e) {
	e?.preventDefault();

	// const li = document.createElement('li');
	// li.classList.add('comment');

	// let isValidate = true;
	// isValidate = validateInput('name') && isValidate;
	// isValidate = validateInput('datepicker') && isValidate;
	// isValidate = validateInput('text') && isValidate;
	// if ( !isValidate ) return;

	// const elements = ['name', 'date', 'text', 'like', 'delete'];
	// data = {
	// 	form: form,
	// 	datapicker: form.datepicker,
	// 	likeIcon: likeSvg,
	// 	deleteIcon: deleteSvg,
	// }
	// elements.forEach( (element) => li.append(createElement(element, form, form.datepicker, likeSvg, deleteSvg)) );

	// li.children[3].addEventListener('click', toggleLike);
	// li.children[4].addEventListener('click', deleteElement);

	// document.querySelector('.comments').append(li);

	// form.reset();

	const response = await fetch('https://api.github.com/search/repositories?q=git');

	console.log(await response.json());
}


function createElement(elementType, form, datepicker, likeIcon, deleteIcon) {
	const div = document.createElement('div');

	div.classList.add(`comment__${elementType}`);

	switch (elementType) {
		case 'date':
			const time = new Date(),
				  hourse = time.getHours();
				  date = datepicker.value;
			let minutes = time.getMinutes();

			minutes = minutes < 10 ? `0${minutes}` : minutes;
		
			div.textContent = `${getFormatedDate(date)}, ${hourse}:${minutes}`;
			break;

		case 'name':
		case 'text':
			div.textContent = form[elementType].value;
			break;
		
		case 'like':
			div.innerHTML = likeIcon;
			div.dataset.liked = 'false';
			break;
		
		case 'delete':
			div.innerHTML = deleteIcon;
			break;
	}

	return div;
}

function getFormatedDate(date) {
	const nowDate = new Date();
		  day = date.slice(0, 2),
		  month = date.slice(3, 5),
		  year = date.slice(6),
		  divDate = new Date(year, month - 1, day, ...nowDate.toLocaleTimeString('it-IT').slice(0, 8).split(':'));

	if ( date == '' || Math.abs(nowDate - divDate) < 10000 ) return 'Сегодня';

	if ( (nowDate > divDate) && (nowDate - divDate < 1000 * 60 * 60 * 24 + 10000) ) return 'Вчера';
	
	return date;
}

function toggleLike(e) {
	if (e.target.nodeName == 'DIV') return;

	const likeDiv = e.target.closest('div');

	if (likeDiv.dataset.liked === 'true')	{
		likeDiv.innerHTML = likeSvg;
		likeDiv.style.setProperty('--like-color', '#f5f2e8');
		
		likeDiv.dataset.liked = 'false';
		
		return;
	}
	
	likeDiv.innerHTML = likeSvgfilled;
	likeDiv.style.setProperty('--like-color', '#f07b61');

	likeDiv.dataset.liked = 'true';
}

function deleteElement(e) {
	if (e.target.nodeName == 'DIV') return;

	e.target.closest('li').remove();
}

function validateInput(inputId) {
	const input = document.getElementById(inputId);

	switch (inputId) {
		case 'name':
			if (input.value.trim().length < 2 || input.value.trim().length >= 40) {
				addErrorMessage(input, 'Введите корректное имя!')
				return false;
			}
			break;
		case 'datepicker':
			regexp = /^(?:(?:31(\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;

			if (input.value.length > 0 && (!input.value.match(regexp) || input.value.length != 10)) {
				addErrorMessage(input, 'Некорректный формат даты!');
				return false;
			}
			break;
		case 'text':
			if (input.value.trim().length < 3) {
				addErrorMessage(input, 'Слишком короткий комментарий!')
				return false;
			}
			break;
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