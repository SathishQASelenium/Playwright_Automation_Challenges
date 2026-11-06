/* JSONPlaceholder frontend harness */

(() => {
    'use strict';

    const API_BASE = 'https://jsonplaceholder.typicode.com';

    const els = {
        form: document.querySelector('[data-testid="create-user-form"]'),
        name: document.querySelector('[data-testid="create-name"]'),
        username: document.querySelector('[data-testid="create-username"]'),
        email: document.querySelector('[data-testid="create-email"]'),
        submit: document.querySelector('[data-testid="create-submit"]'),
        status: document.querySelector('[data-testid="status-message"]'),
        apiStatus: document.querySelector('[data-testid="api-status"]'),
        rows: document.querySelector('[data-testid="user-rows"]'),
        count: document.querySelector('[data-testid="user-count"]'),
        empty: document.querySelector('[data-testid="empty-state"]'),
        error: document.querySelector('[data-testid="error-message"]'),
    };

    function setStatus(message, tone = 'info') {
        els.status.textContent = message;
        els.status.dataset.tone = tone;
    }

    const STATUS_TEXT = {
        200: 'OK',
        201: 'Created',
        204: 'No Content',
        400: 'Bad Request',
        404: 'Not Found',
        500: 'Internal Server Error',
    };

    function setApiStatus(response) {
        // HTTP/2 responses expose an empty statusText, so fall back to the code map.
        const text = response.statusText || STATUS_TEXT[response.status] || '';
        els.apiStatus.textContent = `${response.status}${text ? ` ${text}` : ''}`;
        els.apiStatus.dataset.status = String(response.status);
    }

    function showError(error) {
        els.error.textContent = error instanceof Error ? error.message : String(error);
        els.error.hidden = false;
    }

    function clearError() {
        els.error.textContent = '';
        els.error.hidden = true;
    }

    function textCell(testId, value) {
        const td = document.createElement('td');
        const span = document.createElement('span');
        span.dataset.testid = testId;
        span.textContent = String(value);
        td.append(span);
        return td;
    }

    function createRow(user, { created = false } = {}) {
        const row = document.createElement('tr');
        row.dataset.testid = 'user-row';
        row.dataset.userId = String(user.id);
        if (created) {
            row.dataset.created = 'true';
        }

        const nameCell = document.createElement('td');
        const name = document.createElement('span');
        name.dataset.testid = 'user-name';
        name.textContent = String(user.name ?? '');
        nameCell.append(name);

        if (created) {
            const badge = document.createElement('span');
            badge.className = 'badge';
            badge.dataset.testid = 'new-badge';
            badge.textContent = 'NEW';
            nameCell.append(badge);
        }

        row.append(
            textCell('user-id', user.id),
            nameCell,
            textCell('user-username', user.username ?? ''),
            textCell('user-email', user.email ?? ''),
        );

        return row;
    }

    function renderUsers(users) {
        els.rows.replaceChildren(...users.map((user) => createRow(user)));
        els.count.textContent = String(users.length);
        els.empty.hidden = users.length > 0;
    }

    async function loadUsers() {
        setStatus('Loading users from the API…');

        try {
            const response = await fetch(`${API_BASE}/users`, {
                headers: { Accept: 'application/json' },
            });
            setApiStatus(response);

            if (!response.ok) {
                throw new Error(`GET /users failed with ${response.status} ${response.statusText}`);
            }

            const users = await response.json();
            renderUsers(users);
            setStatus(`Loaded ${users.length} users from the API.`, 'success');
        } catch (error) {
            showError(error);
            setStatus('Unable to load users.', 'error');
        }
    }

    async function createUser(event) {
        event.preventDefault();
        clearError();

        const payload = {
            name: els.name.value.trim(),
            username: els.username.value.trim(),
            email: els.email.value.trim(),
        };

        if (!payload.name || !payload.username || !payload.email) {
            showError(new Error('Name, username and email are required.'));
            return;
        }

        els.submit.disabled = true;
        setStatus(`Creating "${payload.username}" through the API…`);

        try {
            const response = await fetch(`${API_BASE}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(payload),
            });
            setApiStatus(response);

            if (!response.ok) {
                throw new Error(`POST /users failed with ${response.status} ${response.statusText}`);
            }

            const created = await response.json();
            els.rows.prepend(createRow(created, { created: true }));
            els.count.textContent = String(els.rows.children.length);
            els.empty.hidden = true;
            els.form.reset();
            setStatus(`User "${created.name}" created via the API with id ${created.id}.`, 'success');
        } catch (error) {
            showError(error);
            setStatus('Unable to create the user.', 'error');
        } finally {
            els.submit.disabled = false;
        }
    }

    els.form.addEventListener('submit', createUser);
    loadUsers();
})();
