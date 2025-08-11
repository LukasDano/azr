const notifications = document.querySelector('.notifications');

const notificationIcon = {
    "info": 'fa-solid fa-circle-info',
    "warning": 'fa-solid fa-triangle-exclamation',
    "error": 'fa-solid fa-circle-exclamation',
    "success": 'fa-solid fa-circle-check'
};

/**
 * Erstellt und sendet der eigentliche Toast
 * @param {NotificationType} type Die Art der Notification
 * @param {string} icon Die Klasse des Icons
 * @param {string} title Der Notification Titel
 * @param {string} text Der Notification Text
 */
function createToast(type, icon, title, text) {
    const newToast = document.createElement('div');
    newToast.innerHTML = `
            <div class="toast ${type}">
                <i class="${icon}"></i>
                <div class="content">
                    <div class="title">${title}</div>
                    <span>${text}</span>
                </div>
                <i class="fa-solid fa-xmark" onclick="(this.parentElement).remove()"></i>
            </div>`;
    notifications.appendChild(newToast);
    newToast.timeOut = setTimeout(
        () => newToast.remove(), 5000
    )
}

/**
 * Sendet eine Info-Notification
 * @param {string} text Der Notification Text
 */
function sendSuccessNotification(text) {
    const type = 'success';
    const icon = 'fa-solid fa-circle-check';
    const title = 'Success';
    createToast(type, icon, title, text);
}

/**
 * Sendet eine Info-Notification
 * @param {string} text Der Notification Text
 */
function sendErrorNotification(text) {
    const type = 'error';
    const icon = 'fa-solid fa-circle-exclamation';
    const title = 'Error';
    createToast(type, icon, title, text);
}

/**
 * Sendet eine Info-Notification
 * @param {string} text Der Notification Text
 */
function sendWarningNotification(text) {
    const type = 'warning';
    const icon = 'fa-solid fa-triangle-exclamation';
    const title = 'Warning';
    createToast(type, icon, title, text);
}

/**
 * Sendet eine Info-Notification
 * @param {string} text Der Notification Text
 */
function sendInfoNotification(text) {
    const type = 'info';
    const icon = 'fa-solid fa-circle-info';
    const title = 'Info';
    createToast(type, icon, title, text);
}

/**
 * Sendet eine Notification der Config entsprechend
 * @param {NotificationConfig} config Config für die Notification
 */
function sendNotification(config) {
    const type = config.type;
    const text = config.text;
    const title = config.type.toUpperCase();
    const icon = notificationIcon[config.type];

    createToast(type, icon, title, text);
}
