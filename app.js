// BrandMeister API URL
const BM_URL = 'https://api.brandmeister.network/v2/device';

// Localization system
const translations = {
    ru: {
        title: 'MOTOTRBO Zone Generator',
        subtitle: 'Генератор зон для MOTOTRBO из списка репитеров BrandMeister',
        basedOn: 'Основано на работе',
        repository: 'Репозиторий',
        mainParams: 'Основные параметры',
        zoneName: 'Название зоны *',
        zoneNameTooltip: 'Выберите произвольное название для вашей зоны. Это название будет использоваться в имени XML файла и в настройках радио.',
        zoneNamePlaceholder: 'Например: Germany',
        band: 'Диапазон *',
        bandTooltip: 'Выберите частотный диапазон: VHF (2 метра, 144-148 МГц) или UHF (70 сантиметров, 430-440 МГц).',
        selectBand: 'Выберите диапазон',
        vhf: 'VHF (2м)',
        uhf: 'UHF (70см)',
        selectType: 'Тип выбора *',
        selectTypeTooltip: 'Выберите способ фильтрации репитеров: по MCC коду (код страны), по QTH локатору (Maidenhead) или по GPS координатам.',
        selectTypePlaceholder: 'Выберите тип',
        mccCode: 'MCC код',
        qthLocator: 'QTH локатор',
        gpsCoords: 'GPS координаты',
        zoneCapacity: 'Емкость зоны',
        zoneCapacityTooltip: 'Максимальное количество каналов в одной зоне. По умолчанию 160 для топовых моделей. Используйте 16 для lite и моделей без дисплея.',
        filterParams: 'Параметры фильтрации',
        forceDownload: 'Принудительно скачать список',
        forceDownloadTooltip: 'Принудительно загрузить свежий список репитеров с сервера, игнорируя кэш (данные кэшируются на 1 час).',
        onlyPep: 'Только репитеры с указанной мощностью',
        onlyPepTooltip: 'Показывать только репитеры, у которых указана мощность передатчика (PEP). Это помогает отфильтровать неполные записи.',
        onlySix: 'Только репитеры с 6-значным ID',
        onlySixTooltip: 'Показывать только репитеры с 6-значным ID. Это помогает отфильтровать хотспоты (обычно имеют 7-значный ID) и оставить только настоящие репитеры.',
        enableCustom: 'Включить пользовательские значения',
        enableCustomTooltip: 'Включить дополнительные настройки в каждый сгенерированный канал. Укажите XML-поля, которые будут добавлены в каждый канал (например, дополнительные field элементы).',
        customFields: 'Пользовательские XML-поля',
        customFieldsTooltip: 'Введите дополнительные XML-поля, которые будут добавлены в каждый канал. ВАЖНО: Контакт (например, RussianGlobal) должен быть предварительно внесен в список контактов в CPS2.0, чтобы его можно было использовать здесь. Например: &lt;field name=&quot;CP_CUSTOM&quot;&gt;value&lt;/field&gt;',
        important: '⚠️ Важно:',
        importantText: 'Контакт (например, "RussianGlobal") и группа RX (например, "Избранные") должны быть предварительно внесены в CPS2.0, чтобы их можно было использовать здесь.',
        contactExample: '1. Контакт "RussianGlobal":',
        contactsExampleAlt: 'Пример контактов в CPS2.0',
        rxGroupExample: '2. RX Group "Избранные":',
        rxGroupExampleAlt: 'Пример RX Group в CPS2.0',
        customFieldsPlaceholder: 'Например:\n<field name="CP_CUSTOM">value</field>\n<field name="CP_ANOTHER">another_value</field>',
        customFieldsNote: 'Содержимое будет добавлено в каждый сгенерированный канал.',
        callsignFilter: 'Фильтр по позывному',
        callsignFilterTooltip: 'Показывать только репитеры, позывной которых содержит указанную строку. Например, можно указать номер региона для фильтрации по региону.',
        callsignPlaceholder: 'Например: регион',
        mccParams: 'Параметры MCC',
        mccCodeOrCountry: 'MCC код или код страны',
        mccTooltip: 'MCC (Mobile Country Code) - первые 3 цифры ID репитера, обычно соответствуют коду страны. Можно указать 3-значный код (например: 262 для Германии) или двухбуквенный код страны (например: DE для Германии, RU для России).',
        mccPlaceholder: 'Например: 262 или DE',
        qthParams: 'Параметры QTH локатора',
        qthLocatorField: 'QTH локатор',
        qthTooltip: 'QTH локатор (Maidenhead Locator System) - система координат, используемая в радиолюбительской связи. Формат: 2-6 символов (например: KO26BX). Первые 2 буквы - крупная сетка, следующие 2 цифры - средняя, последние 2 буквы - мелкая сетка.',
        qthPlaceholder: 'Например: KO26BX',
        radius: 'Радиус (км)',
        radiusTooltip: 'Радиус поиска репитеров вокруг центра QTH локатора в километрах. По умолчанию 100 км.',
        gpsParams: 'Параметры GPS',
        latitude: 'Широта',
        latitudeTooltip: 'Географическая широта в градусах (от -90 до 90). Для северного полушария - положительное значение, для южного - отрицательное. Например: 59.225 для Стокгольма.',
        latitudePlaceholder: 'Например: 59.225',
        longitude: 'Долгота',
        longitudeTooltip: 'Географическая долгота в градусах (от -180 до 180). Для восточного полушария - положительное значение, для западного - отрицательное. Например: 18.250 для Стокгольма, -93.2780 для Миннеаполиса.',
        longitudePlaceholder: 'Например: 18.250',
        radiusGpsTooltip: 'Радиус поиска репитеров вокруг указанных GPS координат в километрах. По умолчанию 100 км.',
        generateZones: 'Сгенерировать зоны',
        reset: 'Сбросить',
        loading: 'Загрузка данных...',
        results: 'Результаты',
        foundRepeaters: 'Найдено репитеров:',
        callsign: 'Позывной',
        city: 'Город',
        lastSeen: 'Последний раз',
        link: 'Ссылка',
        downloadXml: 'Скачать XML файлы:',
        loadingRepeaters: 'Загрузка списка репитеров...',
        loadedRepeaters: 'Загружено репитеров:',
        filteringRepeaters: 'Фильтрация репитеров...',
        noRepeatersFound: 'Репитеры не найдены по заданным критериям',
        foundRepeatersCount: 'Найдено репитеров:',
        generatingXml: 'Генерация XML файлов...',
        zonesGenerated: 'Успешно сгенерировано зон:',
        error: 'Ошибка:',
        fillRequiredFields: 'Пожалуйста, заполните все обязательные поля',
        specifyMcc: 'Пожалуйста, укажите MCC код',
        specifyQth: 'Пожалуйста, укажите QTH локатор',
        specifyGps: 'Пожалуйста, укажите GPS координаты',
        invalidQth: 'Неверный QTH локатор'
    },
    en: {
        title: 'MOTOTRBO Zone Generator',
        subtitle: 'MOTOTRBO zone generator from BrandMeister repeater list',
        basedOn: 'Based on work by',
        repository: 'Repository',
        mainParams: 'Main Parameters',
        zoneName: 'Zone Name *',
        zoneNameTooltip: 'Choose an arbitrary name for your zone. This name will be used in the XML file name and in radio settings.',
        zoneNamePlaceholder: 'For example: Germany',
        band: 'Band *',
        bandTooltip: 'Select frequency band: VHF (2 meters, 144-148 MHz) or UHF (70 centimeters, 430-440 MHz).',
        selectBand: 'Select band',
        vhf: 'VHF (2m)',
        uhf: 'UHF (70cm)',
        selectType: 'Selection Type *',
        selectTypeTooltip: 'Choose how to filter repeaters: by MCC code (country code), by QTH locator (Maidenhead) or by GPS coordinates.',
        selectTypePlaceholder: 'Select type',
        mccCode: 'MCC Code',
        qthLocator: 'QTH Locator',
        gpsCoords: 'GPS Coordinates',
        zoneCapacity: 'Zone Capacity',
        zoneCapacityTooltip: 'Maximum number of channels in one zone. Default is 160 for top models. Use 16 for lite and non-display models.',
        filterParams: 'Filter Parameters',
        forceDownload: 'Force download list',
        forceDownloadTooltip: 'Force download a fresh repeater list from the server, ignoring cache (data is cached for 1 hour).',
        onlyPep: 'Only repeaters with specified power',
        onlyPepTooltip: 'Show only repeaters that have transmitter power (PEP) specified. This helps filter out incomplete records.',
        onlySix: 'Only repeaters with 6-digit ID',
        onlySixTooltip: 'Show only repeaters with 6-digit ID. This helps filter out hotspots (usually have 7-digit ID) and keep only real repeaters.',
        enableCustom: 'Enable custom values',
        enableCustomTooltip: 'Include additional settings in each generated channel. Specify XML fields that will be added to each channel (e.g., additional field elements).',
        customFields: 'Custom XML Fields',
        customFieldsTooltip: 'Enter additional XML fields that will be added to each channel. IMPORTANT: Contact (e.g., RussianGlobal) must be pre-added to the contact list in CPS2.0 to be used here. For example: &lt;field name=&quot;CP_CUSTOM&quot;&gt;value&lt;/field&gt;',
        important: '⚠️ Important:',
        importantText: 'Contact (e.g., "RussianGlobal") and RX Group (e.g., "Favorites") must be pre-added to CPS2.0 to be used here.',
        contactExample: '1. Contact "RussianGlobal":',
        contactsExampleAlt: 'Example of contacts in CPS2.0',
        rxGroupExample: '2. RX Group "Favorites":',
        rxGroupExampleAlt: 'Example of RX Group in CPS2.0',
        customFieldsPlaceholder: 'For example:\n<field name="CP_CUSTOM">value</field>\n<field name="CP_ANOTHER">another_value</field>',
        customFieldsNote: 'Content will be added to each generated channel.',
        callsignFilter: 'Callsign Filter',
        callsignFilterTooltip: 'Show only repeaters whose callsign contains the specified string. For example, you can specify a region number to filter by region.',
        callsignPlaceholder: 'For example: region',
        mccParams: 'MCC Parameters',
        mccCodeOrCountry: 'MCC Code or Country Code',
        mccTooltip: 'MCC (Mobile Country Code) - first 3 digits of repeater ID, usually correspond to country code. You can specify a 3-digit code (e.g., 262 for Germany) or a two-letter country code (e.g., DE for Germany, RU for Russia).',
        mccPlaceholder: 'For example: 262 or DE',
        qthParams: 'QTH Locator Parameters',
        qthLocatorField: 'QTH Locator',
        qthTooltip: 'QTH locator (Maidenhead Locator System) - coordinate system used in amateur radio. Format: 2-6 characters (e.g., KO26BX). First 2 letters - large grid, next 2 digits - medium, last 2 letters - small grid.',
        qthPlaceholder: 'For example: KO26BX',
        radius: 'Radius (km)',
        radiusTooltip: 'Search radius for repeaters around the center of the QTH locator in kilometers. Default is 100 km.',
        gpsParams: 'GPS Parameters',
        latitude: 'Latitude',
        latitudeTooltip: 'Geographic latitude in degrees (from -90 to 90). For northern hemisphere - positive value, for southern - negative. For example: 59.225 for Stockholm.',
        latitudePlaceholder: 'For example: 59.225',
        longitude: 'Longitude',
        longitudeTooltip: 'Geographic longitude in degrees (from -180 to 180). For eastern hemisphere - positive value, for western - negative. For example: 18.250 for Stockholm, -93.2780 for Minneapolis.',
        longitudePlaceholder: 'For example: 18.250',
        radiusGpsTooltip: 'Search radius for repeaters around the specified GPS coordinates in kilometers. Default is 100 km.',
        generateZones: 'Generate Zones',
        reset: 'Reset',
        loading: 'Loading data...',
        results: 'Results',
        foundRepeaters: 'Found repeaters:',
        callsign: 'Callsign',
        city: 'City',
        lastSeen: 'Last Seen',
        link: 'Link',
        downloadXml: 'Download XML Files:',
        loadingRepeaters: 'Loading repeater list...',
        loadedRepeaters: 'Loaded repeaters:',
        filteringRepeaters: 'Filtering repeaters...',
        noRepeatersFound: 'No repeaters found matching the criteria',
        foundRepeatersCount: 'Found repeaters:',
        generatingXml: 'Generating XML files...',
        zonesGenerated: 'Successfully generated zones:',
        error: 'Error:',
        fillRequiredFields: 'Please fill in all required fields',
        specifyMcc: 'Please specify MCC code',
        specifyQth: 'Please specify QTH locator',
        specifyGps: 'Please specify GPS coordinates',
        invalidQth: 'Invalid QTH locator'
    }
};

// Get current language from localStorage or default to 'ru'
let currentLang = localStorage.getItem('language') || 'ru';

// Function to get translation
function t(key) {
    return translations[currentLang][key] || translations['ru'][key] || key;
}

// Function to set language (global)
window.setLanguage = function(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    updatePageLanguage();
};

// Function to update all text on the page
function updatePageLanguage() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (el.tagName === 'INPUT') {
            if (el.type === 'text' || el.type === 'number') {
                if (el.hasAttribute('placeholder')) {
                    const placeholderKey = key + 'Placeholder';
                    const placeholderText = t(placeholderKey);
                    // Only update if translation exists (not the key itself)
                    if (placeholderText !== placeholderKey) {
                        el.placeholder = placeholderText;
                    }
                }
            }
        } else if (el.tagName === 'TEXTAREA') {
            if (el.hasAttribute('placeholder')) {
                const placeholderKey = key + 'Placeholder';
                const placeholderText = t(placeholderKey);
                // Only update if translation exists (not the key itself)
                if (placeholderText !== placeholderKey) {
                    // Replace \n with actual newlines for textarea
                    el.placeholder = placeholderText.replace(/\\n/g, '\n');
                }
            }
        } else if (el.tagName === 'OPTION') {
            el.textContent = t(key);
        } else if (el.tagName === 'IMG' && el.hasAttribute('data-i18n-alt')) {
            el.alt = t(el.getAttribute('data-i18n-alt'));
        } else {
            el.textContent = t(key);
        }
    });
    
    // Update title
    document.title = t('title');
    
    // Update tooltips
    document.querySelectorAll('[data-tooltip-key]').forEach(el => {
        const key = el.getAttribute('data-tooltip-key');
        el.setAttribute('data-tooltip', t(key));
    });
    
    // Update language switcher buttons
    const langRu = document.getElementById('langRu');
    const langEn = document.getElementById('langEn');
    if (langRu && langEn) {
        if (currentLang === 'ru') {
            langRu.classList.add('active');
            langEn.classList.remove('active');
        } else {
            langRu.classList.remove('active');
            langEn.classList.add('active');
        }
    }
}

// Mobile country codes mapping (common codes)
const MOBILE_CODES = {
    'US': '310', 'CA': '302', 'GB': '234', 'DE': '262', 'FR': '208', 'IT': '222',
    'ES': '214', 'NL': '204', 'BE': '206', 'CH': '228', 'AT': '232', 'SE': '240',
    'NO': '242', 'DK': '238', 'FI': '244', 'PL': '260', 'CZ': '230', 'SK': '231',
    'HU': '216', 'RO': '226', 'BG': '284', 'GR': '202', 'TR': '286', 'RU': '250',
    'UA': '255', 'BY': '257', 'LT': '246', 'LV': '247', 'EE': '248', 'IE': '272',
    'PT': '268', 'IS': '274', 'LU': '270', 'MT': '278', 'CY': '280', 'HR': '219',
    'SI': '293', 'BA': '218', 'RS': '220', 'ME': '297', 'MK': '294', 'AL': '276',
    'IL': '425', 'JP': '440', 'KR': '450', 'CN': '460', 'IN': '404', 'AU': '505',
    'NZ': '530', 'BR': '724', 'MX': '334', 'AR': '722', 'CL': '730', 'CO': '732',
    'PE': '716', 'VE': '734', 'ZA': '655', 'EG': '602', 'MA': '604', 'DZ': '603',
    'TN': '605', 'LY': '606', 'SD': '634', 'ET': '636', 'KE': '639', 'TZ': '640',
    'UG': '641', 'GH': '620', 'NG': '621', 'SN': '608', 'CI': '612', 'CM': '624',
    'CD': '630', 'AO': '631', 'ZM': '645', 'ZW': '648', 'BW': '652', 'NA': '649',
    'MZ': '643', 'MG': '646', 'MU': '617', 'RE': '647', 'SC': '633'
};

// Maidenhead locator to coordinates conversion
function maidenheadToLocation(locator, center = true) {
    if (locator.length < 2) return null;
    
    locator = locator.toUpperCase();
    let lon = (locator.charCodeAt(0) - 65) * 20 - 180;
    let lat = (locator.charCodeAt(1) - 65) * 10 - 90;
    
    if (locator.length >= 4) {
        lon += parseInt(locator[2]) * 2;
        lat += parseInt(locator[3]) * 1;
    }
    
    if (locator.length >= 6) {
        lon += (locator.charCodeAt(4) - 65) * 5 / 60;
        lat += (locator.charCodeAt(5) - 65) * 2.5 / 60;
    }
    
    if (center) {
        if (locator.length >= 6) {
            lon += 2.5 / 60;
            lat += 1.25 / 60;
        } else if (locator.length >= 4) {
            lon += 1;
            lat += 0.5;
        } else {
            lon += 10;
            lat += 5;
        }
    }
    
    return [lat, lon];
}

// Haversine formula for distance calculation
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Convert country code to MCC
function countryCodeToMCC(code) {
    const upperCode = code.toUpperCase();
    return MOBILE_CODES[upperCode] || code;
}

// IndexedDB helper functions
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('BMRepeaterDB', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('repeaters')) {
                db.createObjectStore('repeaters');
            }
        };
    });
}

async function getCachedData() {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['repeaters'], 'readonly');
            const store = transaction.objectStore('repeaters');
            const request = store.get('bm_repeater_list');
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const data = request.result;
                if (data) {
                    const cacheTime = data.timestamp;
                    const now = Date.now();
                    const oneHour = 60 * 60 * 1000;
                    
                    if (now - cacheTime < oneHour) {
                        resolve(data.list);
                    } else {
                        resolve(null);
                    }
                } else {
                    resolve(null);
                }
            };
        });
    } catch (error) {
        console.warn('Error reading from IndexedDB:', error);
        return null;
    }
}

async function setCachedData(data) {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['repeaters'], 'readwrite');
            const store = transaction.objectStore('repeaters');
            const request = store.put({
                list: data,
                timestamp: Date.now()
            }, 'bm_repeater_list');
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    } catch (error) {
        console.warn('Error writing to IndexedDB:', error);
        // Don't throw, just log - we can still use the data without caching
    }
}

// Download repeater list from BrandMeister
async function downloadRepeaterList(force = false) {
    if (!force) {
        const cachedData = await getCachedData();
        if (cachedData) {
            return cachedData;
        }
    }
    
    try {
        const response = await fetch(BM_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Cache the data in IndexedDB
        await setCachedData(data);
        
        return data;
    } catch (error) {
        console.error('Error downloading repeater list:', error);
        throw error;
    }
}

// Filter repeater list
function filterRepeaterList(repeaterList, params) {
    const filtered = [];
    const existing = {};
    let qthCoords = null;
    
    // Calculate coordinates if needed
    if (params.type === 'qth' && params.qth) {
        qthCoords = maidenheadToLocation(params.qth, true);
        if (!qthCoords) {
            throw new Error(t('invalidQth'));
        }
    } else if (params.type === 'gps' && params.lat !== null && params.lng !== null) {
        qthCoords = [parseFloat(params.lat), parseFloat(params.lng)];
    }
    
    // Convert MCC if it's a country code
    let mcc = params.mcc;
    if (params.type === 'mcc' && mcc && !/^\d+$/.test(mcc)) {
        mcc = countryCodeToMCC(mcc);
    }
    
    // Sort list
    const sortedList = [...repeaterList].sort((a, b) => {
        const callsignCompare = (a.callsign || '').localeCompare(b.callsign || '');
        if (callsignCompare !== 0) return callsignCompare;
        return parseInt(a.id || 0) - parseInt(b.id || 0);
    });
    
    // Filter
    for (const item of sortedList) {
        // Band filter
        if (params.band === 'vhf' && !item.rx?.startsWith('1')) continue;
        if (params.band === 'uhf' && !item.rx?.startsWith('4')) continue;
        
        // MCC filter
        if (params.type === 'mcc' && mcc) {
            if (!item.id?.toString().startsWith(mcc)) continue;
        }
        
        // Distance filter
        if ((params.type === 'qth' || params.type === 'gps') && qthCoords) {
            const radius = params.type === 'qth' ? params.radius : params.radiusGps;
            if (!item.lat || !item.lng) continue;
            const distance = calculateDistance(
                qthCoords[0], qthCoords[1],
                parseFloat(item.lat), parseFloat(item.lng)
            );
            if (distance > radius) continue;
        }
        
        // PEP filter
        if (params.pep && (!item.pep || item.pep === '0' || !/^\d+$/.test(item.pep.toString()))) {
            continue;
        }
        
        // 6-digit ID filter
        if (params.six && item.id?.toString().length !== 6) {
            continue;
        }
        
        // Callsign filter
        if (params.callsign && item.callsign && !item.callsign.slice(0, -1).includes(params.callsign)) {
            continue;
        }
        
        // Process callsign
        let callsign = item.callsign || item.id || '';
        if (callsign === '') callsign = item.id || '';
        callsign = callsign.split(' ')[0];
        
        // Check for duplicates
        const isDuplicate = filtered.some(existingItem => 
            existingItem.rx === item.rx && 
            existingItem.tx === item.tx && 
            existingItem.callsign === callsign
        );
        if (isDuplicate) continue;
        
        // Count occurrences
        if (!existing[callsign]) existing[callsign] = 0;
        existing[callsign]++;
        
        filtered.push({
            ...item,
            callsign: callsign,
            turn: existing[callsign]
        });
    }
    
    return filtered;
}

// Format channel XML
function formatChannel(item, existing, customValues = '') {
    const chAlias = existing[item.callsign] === 1 
        ? item.callsign 
        : `${item.callsign} #${item.turn}`;
    
    const chRx = item.rx;
    const chTx = item.tx;
    const chCc = item.colorcode || '1';
    
    if (item.rx === item.tx) {
        return `
<set name="ConventionalPersonality" alias="${chAlias}" key="DGTLCONV6PT25">
  <field name="CP_PERSTYPE" Name="Digital">DGTLCONV6PT25</field>
  <field name="CP_SLTASSGMNT" Name="2">SLOT2</field>
  <field name="CP_COLORCODE">${chCc}</field>
  <field name="CP_TXFREQ">${chRx}</field>
  <field name="CP_RXFREQ">${chTx}</field>
  <field name="CP_EMACKALERTEN">True</field>
  <field name="CP_CNVPERSALIAS">${chAlias}</field>
  <field name="CP_TXINHXPLEN" Name="Color Code Free">MTCHCLRCD</field>
  <field name="CP_MLTSTPSNLTIND">True</field>
  <field name="CP_GPSRVRTPERSIT" Name="Selected">SELECTED</field>
  <field name="CP_OVCMDECODEENABLE">True</field>
  <field name="CP_TXCOMPUDPIPHEADEN" Name="DMR Standard">DMR_UDP_HEADER</field>
  <field name="CP_LOCATIONDATADELIVERYMODE" Name="Follow Data Call Confirmed">FOLLOW_CALL_DATA_SETTING</field>
  <field name="CP_MYCALLADCRTR" Name="Follow Admit Criteria">FOLLOW_ADMIT_CRITERIA</field>
  <field name="CP_TEXTMESSAGETYPE" Name="Advantage">TMS</field>
  <field name="CP_TRANSMITINTERRUPTTYPE" Name="Advantage">PROPRIETARY</field>
  <field name="CP_MLTSTPSNLTIND">True</field>
  <field name="CP_TOT">180</field>
  <field name="CP_INTRPTMSGDLY">510</field>
${customValues}
</set>
    `;
    }
    
    return `
<set name="ConventionalPersonality" alias="${chAlias} TS1" key="DGTLCONV6PT25">
  <field name="CP_PERSTYPE" Name="Digital">DGTLCONV6PT25</field>
  <field name="CP_SLTASSGMNT" Name="1">SLOT1</field>
  <field name="CP_COLORCODE">${chCc}</field>
  <field name="CP_TXFREQ">${chRx}</field>
  <field name="CP_RXFREQ">${chTx}</field>
  <field name="CP_EMACKALERTEN">True</field>
  <field name="CP_CNVPERSALIAS">${chAlias} TS1</field>
  <field name="CP_TXINHXPLEN" Name="Color Code Free">MTCHCLRCD</field>
  <field name="CP_MLTSTPSNLTIND">True</field>
  <field name="CP_GPSRVRTPERSIT" Name="Selected">SELECTED</field>
  <field name="CP_OVCMDECODEENABLE">True</field>
  <field name="CP_TXCOMPUDPIPHEADEN" Name="DMR Standard">DMR_UDP_HEADER</field>
  <field name="CP_LOCATIONDATADELIVERYMODE" Name="Follow Data Call Confirmed">FOLLOW_CALL_DATA_SETTING</field>
  <field name="CP_MYCALLADCRTR" Name="Follow Admit Criteria">FOLLOW_ADMIT_CRITERIA</field>
  <field name="CP_TEXTMESSAGETYPE" Name="Advantage">TMS</field>
  <field name="CP_TRANSMITINTERRUPTTYPE" Name="Advantage">PROPRIETARY</field>
  <field name="CP_MLTSTPSNLTIND">True</field>
  <field name="CP_ARSPLUS" Name="On System/Site Change">ARS_SYS_SITE_CHANGE</field>
  <field name="CP_TOT">180</field>
  <field name="CP_INTRPTMSGDLY">510</field>
${customValues}
</set>
<set name="ConventionalPersonality" alias="${chAlias} TS2" key="DGTLCONV6PT25">
  <field name="CP_PERSTYPE" Name="Digital">DGTLCONV6PT25</field>
  <field name="CP_SLTASSGMNT" Name="2">SLOT2</field>
  <field name="CP_COLORCODE">${chCc}</field>
  <field name="CP_TXFREQ">${chRx}</field>
  <field name="CP_RXFREQ">${chTx}</field>
  <field name="CP_EMACKALERTEN">True</field>
  <field name="CP_CNVPERSALIAS">${chAlias} TS2</field>
  <field name="CP_TXINHXPLEN" Name="Color Code Free">MTCHCLRCD</field>
  <field name="CP_MLTSTPSNLTIND">True</field>
  <field name="CP_GPSRVRTPERSIT" Name="Selected">SELECTED</field>
  <field name="CP_OVCMDECODEENABLE">True</field>
  <field name="CP_TXCOMPUDPIPHEADEN" Name="DMR Standard">DMR_UDP_HEADER</field>
  <field name="CP_LOCATIONDATADELIVERYMODE" Name="Follow Data Call Confirmed">FOLLOW_CALL_DATA_SETTING</field>
  <field name="CP_MYCALLADCRTR" Name="Follow Admit Criteria">FOLLOW_ADMIT_CRITERIA</field>
  <field name="CP_TEXTMESSAGETYPE" Name="Advantage">TMS</field>
  <field name="CP_TRANSMITINTERRUPTTYPE" Name="Advantage">PROPRIETARY</field>
  <field name="CP_MLTSTPSNLTIND">True</field>
  <field name="CP_ARSPLUS" Name="On System/Site Change">ARS_SYS_SITE_CHANGE</field>
  <field name="CP_TOT">180</field>
  <field name="CP_INTRPTMSGDLY">510</field>
${customValues}
</set>
    `;
}

// Generate zone XML files
function generateZoneFiles(filteredList, params, customValues = '') {
    const zoneCapacity = parseInt(params.zoneCapacity) || 160;
    const channelChunks = [];
    
    for (let i = 0; i < filteredList.length; i += zoneCapacity) {
        channelChunks.push(filteredList.slice(i, i + zoneCapacity));
    }
    
    const existing = {};
    filteredList.forEach(item => {
        if (!existing[item.callsign]) existing[item.callsign] = 0;
        existing[item.callsign]++;
    });
    
    const zoneFiles = [];
    const outputList = [];
    
    channelChunks.forEach((chunk, index) => {
        let channels = '';
        const chunkOutput = [];
        
        chunk.forEach(item => {
            channels += formatChannel(item, existing, customValues);
            const chAlias = existing[item.callsign] === 1 
                ? item.callsign 
                : `${item.callsign} #${item.turn}`;
            chunkOutput.push({
                alias: chAlias,
                rx: item.rx,
                tx: item.tx,
                cc: item.colorcode || '1',
                city: item.city || '',
                lastSeen: item.last_seen || '',
                url: `https://brandmeister.network/?page=repeater&id=${item.id}`
            });
        });
        
        const zoneAlias = channelChunks.length === 1 
            ? params.name 
            : `${params.name} #${index + 1}`;
        
        const xmlContent = `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<config>
  <category name="Zone">
    <set name="Zone" alias="${zoneAlias}" key="NORMAL">
      <collection name="ZoneItems">
        ${channels}
      </collection>
      <field name="ZP_ZONEALIAS">${zoneAlias}</field>
      <field name="ZP_ZONETYPE" Name="Normal">NORMAL</field>
      <field name="ZP_ZVFNLITEM" Name="None">NONE</field>
      <field name="Comments"></field>
    </set>
  </category>
</config>
`;
        
        zoneFiles.push({
            name: `${zoneAlias}.xml`,
            content: xmlContent
        });
        
        outputList.push(...chunkOutput);
    });
    
    return { zoneFiles, outputList };
}

// Display results
function displayResults(outputList, zoneFiles) {
    const resultsSection = document.getElementById('resultsSection');
    const resultsTable = document.getElementById('resultsTable');
    const downloadLinks = document.getElementById('downloadLinks');
    const resultCount = document.getElementById('resultCount');
    
    resultCount.textContent = `${t('foundRepeaters')} ${outputList.length}`;
    
    // Create table
    let tableHTML = `<table><thead><tr><th>${t('callsign')}</th><th>RX</th><th>TX</th><th>CC</th><th>${t('city')}</th><th>${t('lastSeen')}</th><th>URL</th></tr></thead><tbody>`;
    
    outputList.forEach(item => {
        tableHTML += `<tr>
            <td>${item.alias}</td>
            <td>${item.rx}</td>
            <td>${item.tx}</td>
            <td>${item.cc}</td>
            <td>${item.city}</td>
            <td>${item.lastSeen}</td>
            <td><a href="${item.url}" target="_blank">${t('link')}</a></td>
        </tr>`;
    });
    
    tableHTML += '</tbody></table>';
    resultsTable.innerHTML = tableHTML;
    
    // Create download links
    downloadLinks.innerHTML = `<h3>${t('downloadXml')}</h3>`;
    zoneFiles.forEach(file => {
        const blob = new Blob([file.content], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        link.textContent = file.name;
        downloadLinks.appendChild(link);
    });
    
    resultsSection.classList.add('active');
}

// Show status message
function showStatus(message, type = 'info') {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status ${type} active`;
    
    if (type === 'success' || type === 'error') {
        setTimeout(() => {
            status.classList.remove('active');
        }, 5000);
    }
}

// Form submission handler
document.getElementById('repeaterForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const loading = document.getElementById('loading');
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.classList.remove('active');
    
    // Get form data
    const formData = new FormData(e.target);
    const params = {
        name: formData.get('name'),
        band: formData.get('band'),
        type: formData.get('type'),
        mcc: formData.get('mcc') || null,
        qth: formData.get('qth') || null,
        radius: parseInt(formData.get('radius')) || 100,
        lat: formData.get('lat') || null,
        lng: formData.get('lng') || null,
        radiusGps: parseInt(formData.get('radiusGps')) || 100,
        pep: formData.get('pep') === 'on',
        six: formData.get('six') === 'on',
        customize: formData.get('customize') === 'on',
        callsign: formData.get('callsign') || null,
        zoneCapacity: parseInt(formData.get('zoneCapacity')) || 160,
        force: formData.get('force') === 'on'
    };
    
    // Validate required fields
    if (!params.name || !params.band || !params.type) {
        showStatus(t('fillRequiredFields'), 'error');
        return;
    }
    
    // Validate type-specific fields
    if (params.type === 'mcc' && !params.mcc) {
        showStatus(t('specifyMcc'), 'error');
        return;
    }
    if (params.type === 'qth' && !params.qth) {
        showStatus(t('specifyQth'), 'error');
        return;
    }
    if (params.type === 'gps' && (params.lat === null || params.lng === null)) {
        showStatus(t('specifyGps'), 'error');
        return;
    }
    
    loading.classList.add('active');
    showStatus(t('loadingRepeaters'), 'info');
    
    try {
        // Download repeater list
        const repeaterList = await downloadRepeaterList(params.force);
        showStatus(`${t('loadedRepeaters')} ${repeaterList.length}`, 'info');
        
        // Filter list
        showStatus(t('filteringRepeaters'), 'info');
        const filteredList = filterRepeaterList(repeaterList, params);
        
        if (filteredList.length === 0) {
            showStatus(t('noRepeatersFound'), 'error');
            loading.classList.remove('active');
            return;
        }
        
        showStatus(`${t('foundRepeatersCount')} ${filteredList.length}`, 'success');
        
        // Get custom values from textarea if enabled
        let customValues = '';
        if (params.customize) {
            const customValuesText = formData.get('customValues') || '';
            if (customValuesText.trim()) {
                customValues = customValuesText.trim();
                // Ensure proper formatting (add newline before if not empty)
                if (customValues && !customValues.startsWith('\n')) {
                    customValues = '\n' + customValues;
                }
            }
        }
        
        // Generate zone files
        showStatus(t('generatingXml'), 'info');
        const { zoneFiles, outputList } = generateZoneFiles(filteredList, params, customValues);
        
        // Display results
        displayResults(outputList, zoneFiles);
        showStatus(`${t('zonesGenerated')} ${zoneFiles.length}`, 'success');
        
    } catch (error) {
        console.error('Error:', error);
        showStatus(`${t('error')} ${error.message}`, 'error');
    } finally {
        loading.classList.remove('active');
    }
});

// Show/hide type-specific parameters
document.getElementById('type').addEventListener('change', (e) => {
    document.getElementById('mccParams').classList.remove('active');
    document.getElementById('qthParams').classList.remove('active');
    document.getElementById('gpsParams').classList.remove('active');
    
    if (e.target.value === 'mcc') {
        document.getElementById('mccParams').classList.add('active');
    } else if (e.target.value === 'qth') {
        document.getElementById('qthParams').classList.add('active');
    } else if (e.target.value === 'gps') {
        document.getElementById('gpsParams').classList.add('active');
    }
});

// Show/hide custom values textarea
document.getElementById('customize').addEventListener('change', (e) => {
    const container = document.getElementById('customValuesContainer');
    if (e.target.checked) {
        container.classList.add('active');
    } else {
        container.classList.remove('active');
    }
});

// Reset form
function resetForm() {
    document.getElementById('repeaterForm').reset();
    document.getElementById('resultsSection').classList.remove('active');
    document.getElementById('status').classList.remove('active');
    document.getElementById('mccParams').classList.remove('active');
    document.getElementById('qthParams').classList.remove('active');
    document.getElementById('gpsParams').classList.remove('active');
    document.getElementById('customValuesContainer').classList.remove('active');
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set language attribute on html element
    document.documentElement.lang = currentLang;
    updatePageLanguage();
});
