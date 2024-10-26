let id_child;

document.addEventListener('DOMContentLoaded', function() {
    const selectElement = document.getElementById('children-select');
    const childInfoElement = document.getElementById('child-info');
    const addSessionButton = document.getElementById('add-session-button');
    const saveSessionButton = document.getElementById('save-session-button');
    const sessionTableContainer = document.getElementById('session-table-container');

    // Загрузка списка детей
    fetch('http://localhost:8080/children', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Network response was not ok: ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        if (!Array.isArray(data)) {
            throw new TypeError('Expected an array of children');
        }

        selectElement.innerHTML = '';

        data.forEach(child => {
            const option = document.createElement('option');
            option.value = child.id;
            option.text = `${child.lastName} ${child.firstName} ${child.secondName}`;
            selectElement.appendChild(option);
        });

        // Проверяем, есть ли уже выбранный ребенок
        const selectedChildId = selectElement.value;
        if (selectedChildId) {
            id_child = selectedChildId;
            fetch(`http://localhost:8080/children/${selectedChildId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`Network response was not ok: ${text}`);
                    });
                }
                return response.json();
            })
            .then(child => {
                // Отображаем информацию о ребенке
                childInfoElement.innerHTML = `
                    <h2>${child.lastName} ${child.firstName} ${child.secondName}</h2>
                    <p>Birth: ${new Date(child.birth).toLocaleDateString()}</p>
                    <p>Method View: ${child.methodView}</p>
                    <p>Prompt View: ${child.promptView}</p>
                `;
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

    // Обработчик события change для выпадающего списка
    selectElement.addEventListener('change', function() {
        const childId = selectElement.value;
        id_child = childId;
        console.log('Selected child ID:', id_child); // Добавляем отладочное сообщение
        if (childId) {
            fetch(`http://localhost:8080/children/${childId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`Network response was not ok: ${text}`);
                    });
                }
                return response.json();
            })
            .then(child => {
                // Отображаем информацию о ребенке
                childInfoElement.innerHTML = `
                    <h2>${child.lastName} ${child.firstName} ${child.secondName}</h2>
                    <p>Birth: ${new Date(child.birth).toLocaleDateString()}</p>
                    <p>Method View: ${child.methodView}</p>
                    <p>Prompt View: ${child.promptView}</p>
                `;
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        } else {
            // Очищаем информацию, если ничего не выбрано
            childInfoElement.innerHTML = '';
        }
    });

    // Обработчик события click для кнопки "Добавить сессию"
    addSessionButton.addEventListener('click', function() {
        const table = document.createElement('table');
        table.style.borderCollapse = 'collapse';
        table.style.width = '100%';

        const headerRow = table.insertRow();
        const headers = ['Дата', 'Метод', 'Этап', 'Столбец 1', 'Столбец 2', 'Столбец 3', 'Столбец 4', 'Столбец 5', 'Столбец 6', 'Столбец 7', 'Столбец 8', 'Столбец 9', 'Столбец 10'];
        headers.forEach(headerText => {
            const headerCell = document.createElement('th');
            headerCell.textContent = headerText;
            headerCell.style.border = '1px solid black';
            headerCell.style.padding = '8px';
            headerRow.appendChild(headerCell);
        });

        const inputRow = table.insertRow();
        headers.forEach(headerText => {
            const inputCell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.style.width = '100%';
            input.style.boxSizing = 'border-box';
            inputCell.appendChild(input);
            inputCell.style.border = '1px solid black';
            inputCell.style.padding = '8px';
            inputRow.appendChild(inputCell);
        });

        sessionTableContainer.innerHTML = '';
        sessionTableContainer.appendChild(table);
    });

    // Обработчик события click для кнопки "Сохранить сессию"
    saveSessionButton.addEventListener('click', function() {
        const table = sessionTableContainer.querySelector('table');
        if (!table) {
            alert('Таблица не найдена');
            return;
        }

        const inputs = table.querySelectorAll('input');
        if (inputs.length !== 13) {
            alert('Неверное количество полей в таблице');
            return;
        }

        const date = inputs[0].value;
        const method = inputs[1].value;
        const phase = inputs[2].value;
        const sessionData = Array.from(inputs).slice(3).map(input => input.value);

        const session = {
            date: new Date(date),
            methodName: method,
            phaseName: phase,
            session: sessionData.map(value => value.charAt(0)),
            childId: id_child // Добавляем child_id в объект сессии
        };

        // Проверяем, что child_id не является null
        if (!id_child) {
            alert('Ребенок не выбран');
            return;
        }

        fetch('http://localhost:8080/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(session)
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`Network response was not ok: ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            alert('Сессия успешно сохранена');
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            alert('Ошибка при сохранении сессии');
        });
    });
});