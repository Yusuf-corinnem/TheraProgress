document.addEventListener('DOMContentLoaded', function() {
    const selectElement = document.getElementById('children-select');
    const childInfoElement = document.getElementById('child-info');
    const addSessionButton = document.getElementById('add-session-button');
    const saveSessionButton = document.getElementById('save-session-button');
    const sessionTableContainer = document.getElementById('session-table-container');
    const showAllSessionsButton = document.getElementById('show-all-sessions-button');

    let id_child = null; // Переменная для хранения ID выбранного ребенка

    // Функции
    function loadChildren() {
        return fetch('http://localhost:8080/children', {
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
            return data;
        });
    }

    function displayChildren(children) {
        selectElement.innerHTML = '';

        children.forEach(child => {
            const option = document.createElement('option');
            option.value = child.id;

            if (child.birth) {
                const birthDateParts = child.birth.split('.');
                const birthDate = new Date(birthDateParts[2], birthDateParts[1] - 1, birthDateParts[0]);
                const formattedBirthDate = birthDate.toLocaleDateString();
                option.text = `${child.lastName} ${child.firstName} ${child.secondName} - ${formattedBirthDate}`;
            } else {
                option.text = `${child.lastName} ${child.firstName} ${child.secondName}`;
            }

            selectElement.appendChild(option);
        });
    }

    function fetchChildInfo(childId) {
        return fetch(`http://localhost:8080/children/${childId}`, {
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
        });
    }

    function displayChildInfo(child) {
        let birthDateString = '';
        if (child.birth) {
            const birthDateParts = child.birth.split('.');
            const birthDate = new Date(birthDateParts[2], birthDateParts[1] - 1, birthDateParts[0]);
            if (!isNaN(birthDate.getTime())) {
                birthDateString = birthDate.toLocaleDateString();
            }
        }

        childInfoElement.innerHTML = `
            <h2>${child.lastName} ${child.firstName} ${child.secondName}</h2>
            <p>Target: ${child.target}</p>
            <p>Birth: ${birthDateString}</p>
            <p>Method: ${child.method}</p>
            <p>Prompt: ${child.prompt}</p>
        `;
    }

    function createSessionTable() {
        const table = document.createElement('table');
        table.style.borderCollapse = 'collapse';
        table.style.width = '100%';

        const headerRow = table.insertRow();
        const headers = ['Дата', 'Метод', 'Этап', 'Блок 1', 'Блок 2', 'Блок 3', 'Блок 4', 'Блок 5', 'Блок 6', 'Блок 7', 'Блок 8', 'Блок 9', 'Блок 10'];
        headers.forEach(headerText => {
            const headerCell = document.createElement('th');
            headerCell.textContent = headerText;
            headerCell.style.border = '1px solid black';
            headerCell.style.padding = '8px';
            headerRow.appendChild(headerCell);
        });

        const inputRow = table.insertRow();
        headers.forEach((headerText, index) => {
            const inputCell = document.createElement('td');
            if (index === 1) { // Метод
                const select = document.createElement('select');
                select.style.width = '100%';
                select.style.boxSizing = 'border-box';

                const methods = [
                    'DTT',
                    'Формирование реакции',
                    'NET',
                    'Обучение обратной цепочке',
                    'Обучение целой цепочке',
                    'Обучение прямой цепочке',
                    'Формирование реакции',
                    'Формирование условной дискриминации'
                ];
                methods.forEach(method => {
                    const option = document.createElement('option');
                    option.value = method;
                    option.text = method;
                    select.appendChild(option);
                });

                inputCell.appendChild(select);
            } else if (index < 3) { // Дата и Этап
                const input = document.createElement('input');
                input.type = 'text';
                input.style.width = '100%';
                input.style.boxSizing = 'border-box';
                inputCell.appendChild(input);
            } else { // Столбцы 1-10
                const select = document.createElement('select');
                select.style.width = '100%';
                select.style.boxSizing = 'border-box';

                const options = ['С', 'Н', '+'];
                options.forEach(optionText => {
                    const option = document.createElement('option');
                    option.value = optionText;
                    option.text = optionText;
                    select.appendChild(option);
                });

                select.addEventListener('change', updatePercentSelfReactions);
                inputCell.appendChild(select);
            }
            inputCell.style.border = '1px solid black';
            inputCell.style.padding = '8px';
            inputRow.appendChild(inputCell);
        });

        return table;
    }

//    Переделать
     function updatePercentSelfReactions() {
            const table = sessionTableContainer.querySelector('table');
            if (!table) return;

            const inputs = table.querySelectorAll('input');
            if (inputs.length !== 13) return;

            const sessionData = Array.from(inputs).slice(3, 13).map(input => input.value.charAt(0));
            const percentSelfReactions = countPercentSelfReactions(sessionData);

            const percentCell = table.rows[1].cells[13];
            percentCell.textContent = percentSelfReactions + '%';
        }

//    Переделать
        function countPercentSelfReactions(sessionData) {
            const selfReactionChar = 'c';
            const selfReactionsCount = sessionData.filter(value => value.toLowerCase() === selfReactionChar).length;
            return Math.round((selfReactionsCount / sessionData.length) * 100);
        }

function saveSession() {
    const table = sessionTableContainer.querySelector('table');
    if (!table) {
        alert('Таблица не найдена');
        return;
    }

    const inputs = table.querySelectorAll('input');
    const selects = table.querySelectorAll('select');

    // Проверка количества полей
    if (inputs.length !== 2 || selects.length !== 11) {
        alert('Неверное количество полей в таблице');
        return;
    }

    const dateInput = inputs[0].value;
    const phase = inputs[1].value;
    const method = selects[0].value;
    const sessionData = Array.from(selects).slice(1, 11).map(select => select.value);

    let date;
    if (dateInput) {
        const dateParts = dateInput.split('.');
        if (dateParts.length === 3) {
            date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
            if (isNaN(date.getTime())) {
                alert('Неверный формат даты');
                return;
            }
        } else {
            alert('Неверный формат даты');
            return;
        }
    } else {
        alert('Дата не введена');
        return;
    }

    const formattedDate = date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const percentSelfReactions = countPercentSelfReactions(sessionData);

    const session = {
        date: formattedDate,
        methodName: method,
        phaseName: phase,
        session: sessionData,
        percentSelfReactions: percentSelfReactions,
        childId: id_child
    };

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
}

function showAllSessions() {
    if (!id_child) {
        alert('Ребенок не выбран');
        return;
    }

    fetch(`http://localhost:8080/sessions?childId=${id_child}`, {
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
    .then(sessions => {
        // Сортировка сессий по дате
        sessions.sort((a, b) => {
            const dateA = new Date(a.date.split('.').reverse().join('-'));
            const dateB = new Date(b.date.split('.').reverse().join('-'));
            return dateA - dateB;
        });

        const newWindow = window.open('', '_blank');
        newWindow.document.write('<html><head><title>Сессии</title></head><body>');
        newWindow.document.write('<h1>Сессии ребенка</h1>');
        newWindow.document.write('<table border="1"><tr><th>Дата</th><th>Метод</th><th>Этап</th><th>Блок 1</th><th>Блок 2</th><th>Блок 3</th><th>Блок 4</th><th>Блок 5</th><th>Блок 6</th><th>Блок 7</th><th>Блок 8</th><th>Блок 9</th><th>Блок 10</th><th>Процент СР</th></tr>');

        sessions.forEach(session => {
            newWindow.document.write('<tr>');

            if (session.date) {
                const dateParts = session.date.split('.');
                const formattedDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]).toLocaleDateString();
                newWindow.document.write(`<td>${formattedDate}</td>`);
            } else {
                newWindow.document.write('<td>Дата не указана</td>');
            }

            newWindow.document.write(`<td>${session.methodName}</td>`);
            newWindow.document.write(`<td>${session.phaseName}</td>`);
            session.session.forEach(value => {
                newWindow.document.write(`<td>${value}</td>`);
            });

            newWindow.document.write(`<td>${session.percentSelfReactions}%</td>`);

            newWindow.document.write('</tr>');
        });

        newWindow.document.write('</table>');
        newWindow.document.write('</body></html>');
        newWindow.document.close();

        // Экспорт данных в файл .xlsx
        const data = sessions.map(session => {
            const dateParts = session.date.split('.');
            const formattedDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]).toLocaleDateString();
            return {
                Дата: formattedDate,
                ПроцентСР: session.percentSelfReactions
            };
        });

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sessions');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        function s2ab(s) {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }

        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sessions.xlsx';
        a.click();
        URL.revokeObjectURL(url);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        alert('Ошибка при получении сессий');
    });
}

    // Загрузка списка детей
    loadChildren()
        .then(children => {
            displayChildren(children);
            const selectedChildId = selectElement.value;
            if (selectedChildId) {
                id_child = selectedChildId;
                fetchChildInfo(selectedChildId).then(displayChildInfo);
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    // Обработчик события change для выпадающего списка
    selectElement.addEventListener('change', function() {
        const childId = selectElement.value;
        id_child = childId;
        if (childId) {
            fetchChildInfo(childId).then(displayChildInfo);
        } else {
            childInfoElement.innerHTML = '';
        }
    });

    // Обработчик события click для кнопки "Добавить сессию"
    addSessionButton.addEventListener('click', function() {
        const table = createSessionTable();
        sessionTableContainer.innerHTML = '';
        sessionTableContainer.appendChild(table);
    });

    // Обработчик события click для кнопки "Сохранить сессию"
    saveSessionButton.addEventListener('click', saveSession);

    // Обработчик события click для кнопки "Показать все сессии"
    showAllSessionsButton.addEventListener('click', showAllSessions);
});

document.addEventListener('DOMContentLoaded', function() {
    // ... (предыдущий код)

    const addStudentButton = document.getElementById('add-student-button');
    const addStudentForm = document.getElementById('add-student-form');
    const saveStudentButton = document.getElementById('save-student-button');

    // Функция для отображения формы добавления ученика
    function showAddStudentForm() {
        addStudentForm.style.display = 'block';
    }

    // Функция для сохранения ученика
    function saveStudent() {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const secondName = document.getElementById('secondName').value;
        const birth = document.getElementById('birth').value;
        const target = document.getElementById('target').value;
        const method = document.getElementById('method').value;
        const prompt = document.getElementById('prompt').value;

        const student = {
            firstName: firstName,
            lastName: lastName,
            secondName: secondName,
            birth: birth,
            target: target,
            method: method,
            prompt: prompt
        };

        fetch('http://localhost:8080/children', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(student)
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
            alert('Ученик успешно добавлен');
            addStudentForm.style.display = 'none'; // Скрыть форму после успешного добавления
            loadChildren().then(children => displayChildren(children)); // Обновить список детей
        })
    }

    // Обработчик события click для кнопки "Добавить ученика"
    addStudentButton.addEventListener('click', showAddStudentForm);

    // Обработчик события click для кнопки "Сохранить ученика"
    saveStudentButton.addEventListener('click', saveStudent);
});