(function() {
    // Попытка прочитать ключ из meta-тега
    function readFromMeta() {
        try {
            const meta = document.querySelector('meta[name="google-calendar-api-key"]');
            if (meta && meta.content && meta.content.trim() && meta.content.indexOf('__GOOGLE_CALENDAR_API_KEY__') === -1) {
                return meta.content.trim();
            }
        } catch (e) {
            /* ignore */
        }
        return null;
    }

    // Попытка загрузить /env.json (если вы генерируете такой файл на сервере)
    function fetchEnvJson() {
        return fetch('/env.json', { cache: 'no-store' })
            .then(resp => {
                if (!resp.ok) throw new Error('no env.json');
                return resp.json();
            })
            .then(json => json.GOOGLE_CALENDAR_API_KEY || null)
            .catch(() => null);
    }

    // Инициализация: сначала meta, затем /env.json
    (async function init() {
        let key = readFromMeta();

        if (!key) {
            key = await fetchEnvJson();
        }

        // В некоторых CI/hosting системах ключ могут подставлять в window.__ENV__ заранее
        if (!key && window.__ENV__ && window.__ENV__.GOOGLE_CALENDAR_API_KEY) {
            key = window.__ENV__.GOOGLE_CALENDAR_API_KEY;
        }

        // Записываем глобально для использования в других скриптах
        window.__GOOGLE_CALENDAR_API_KEY__ = key || null;

        // Лёгкое логирование для отладки (можно убрать в продакшене)
        if (!key) {
            // Не спамим консоль, только одно предупреждение
            console.warn('env-loader: Google Calendar API key not found. Установите meta[name="google-calendar-api-key"] или /env.json при деплое.');
        } else {
            console.info('env-loader: Google Calendar API key loaded.');
        }
    })();
})();

