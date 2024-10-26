document.addEventListener('DOMContentLoaded', function() {
    const selectElement = document.getElementById('children-select');
    const childInfoElement = document.getElementById('child-info');
    const addSessionButton = document.getElementById('add-session-button');
    const saveSessionButton = document.getElementById('save-session-button');
    const sessionTableContainer = document.getElementById('session-table-container');
    const showAllSessionsButton = document.getElementById('show-all-sessions-button'); // Добавляем ссылку на кнопку

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

            // Проверяем, что поле birth существует и не является null или undefined
            if (child.birth) {
                // Преобразуем строку даты в объект Date
                const birthDateParts = child.birth.split('.');
                const birthDate = new Date(birthDateParts[2], birthDateParts[1] - 1, birthDateParts[0]);

                // Форматируем дату
                const formattedBirthDate = birthDate.toLocaleDateString();

                // Устанавливаем текст опции
                option.text = `${child.lastName} ${child.firstName} ${child.secondName} - ${formattedBirthDate}`;
            } else {
                // Если поле birth отсутствует, устанавливаем текст опции без даты
                option.text = `${child.lastName} ${child.firstName} ${child.secondName}`;
            }

            // Добавляем опцию в селект элемент
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
                // Проверяем, что поле birth существует и не является null или undefined
                let birthDateString = '';
                if (child.birth) {
                    // Преобразуем строку даты в объект Date
                    const birthDateParts = child.birth.split('.');
                    const birthDate = new Date(birthDateParts[2], birthDateParts[1] - 1, birthDateParts[0]);

                    // Проверяем, что дата корректно преобразована
                    if (!isNaN(birthDate.getTime())) {
                        // Форматируем дату
                        birthDateString = birthDate.toLocaleDateString();
                    }
                }

                // Отображаем информацию о ребенке
                childInfoElement.innerHTML = `
                    <h2>${child.lastName} ${child.firstName} ${child.secondName}</h2>
                    <p>Birth: ${birthDateString}</p>
                    <p>Method: ${child.method}</p>
                    <p>Prompt: ${child.prompt}</p>
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
                // Проверяем, что поле birth существует и не является null или undefined
                let birthDateString = '';
                if (child.birth) {
                    // Преобразуем строку даты в объект Date
                    const birthDateParts = child.birth.split('.');
                    const birthDate = new Date(birthDateParts[2], birthDateParts[1] - 1, birthDateParts[0]);

                    // Проверяем, что дата корректно преобразована
                    if (!isNaN(birthDate.getTime())) {
                        // Форматируем дату
                        birthDateString = birthDate.toLocaleDateString();
                    }
                }

                // Отображаем информацию о ребенке
                childInfoElement.innerHTML = `
                    <h2>${child.lastName} ${child.firstName} ${child.secondName}</h2>
                    <p>Birth: ${birthDateString}</p>
                    <p>Method: ${child.method}</p>
                    <p>Prompt: ${child.prompt}</p>
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

        const dateInput = inputs[0].value;
        const method = inputs[1].value;
        const phase = inputs[2].value;
        const sessionData = Array.from(inputs).slice(3).map(input => input.value);

        // Проверяем, что дата введена и корректно преобразована
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

        // Форматируем дату в формат dd.MM.yyyy
        const formattedDate = date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });

        const session = {
            date: formattedDate, // Используем формат dd.MM.yyyy
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

    // Обработчик события click для кнопки "Показать все сессии"
   showAllSessionsButton.addEventListener('click', function() {
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
           // Создаем новую вкладку и отображаем сессии
           const newWindow = window.open('', '_blank');
           newWindow.document.write('<html><head><title>Сессии</title></head><body>');
           newWindow.document.write('<h1>Сессии ребенка</h1>');
           newWindow.document.write('<table border="1"><tr><th>Дата</th><th>Метод</th><th>Этап</th><th>Столбец 1</th><th>Столбец 2</th><th>Столбец 3</th><th>Столбец 4</th><th>Столбец 5</th><th>Столбец 6</th><th>Столбец 7</th><th>Столбец 8</th><th>Столбец 9</th><th>Столбец 10</th></tr>');

           sessions.forEach(session => {
               newWindow.document.write('<tr>');

               // Проверяем, что поле date существует и не является null или undefined
               if (session.date) {
                   // Преобразуем дату в формат, который может быть корректно обработан new Date()
                   const dateParts = session.date.split('.');
                   const formattedDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]).toLocaleDateString();
                   newWindow.document.write(`<td>${formattedDate}</td>`); // Отображаем дату сессии
               } else {
                   newWindow.document.write('<td>Дата не указана</td>'); // Если поле date отсутствует, отображаем сообщение
               }

               newWindow.document.write(`<td>${session.methodName}</td>`);
               newWindow.document.write(`<td>${session.phaseName}</td>`);
               session.session.forEach(value => {
                   newWindow.document.write(`<td>${value}</td>`);
               });
               newWindow.document.write('</tr>');
           });

           newWindow.document.write('</table></body></html>');
           newWindow.document.close();
       })
       .catch(error => {
           console.error('There was a problem with the fetch operation:', error);
           alert('Ошибка при получении сессий');
       });
   });
   });