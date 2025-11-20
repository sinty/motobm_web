// BrandMeister API URL
const BM_URL = 'https://api.brandmeister.network/v2/device';

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
            throw new Error('Неверный QTH локатор');
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
    
    resultCount.textContent = `Найдено репитеров: ${outputList.length}`;
    
    // Create table
    let tableHTML = '<table><thead><tr><th>Позывной</th><th>RX</th><th>TX</th><th>CC</th><th>Город</th><th>Последний раз</th><th>URL</th></tr></thead><tbody>';
    
    outputList.forEach(item => {
        tableHTML += `<tr>
            <td>${item.alias}</td>
            <td>${item.rx}</td>
            <td>${item.tx}</td>
            <td>${item.cc}</td>
            <td>${item.city}</td>
            <td>${item.lastSeen}</td>
            <td><a href="${item.url}" target="_blank">Ссылка</a></td>
        </tr>`;
    });
    
    tableHTML += '</tbody></table>';
    resultsTable.innerHTML = tableHTML;
    
    // Create download links
    downloadLinks.innerHTML = '<h3>Скачать XML файлы:</h3>';
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
        showStatus('Пожалуйста, заполните все обязательные поля', 'error');
        return;
    }
    
    // Validate type-specific fields
    if (params.type === 'mcc' && !params.mcc) {
        showStatus('Пожалуйста, укажите MCC код', 'error');
        return;
    }
    if (params.type === 'qth' && !params.qth) {
        showStatus('Пожалуйста, укажите QTH локатор', 'error');
        return;
    }
    if (params.type === 'gps' && (params.lat === null || params.lng === null)) {
        showStatus('Пожалуйста, укажите GPS координаты', 'error');
        return;
    }
    
    loading.classList.add('active');
    showStatus('Загрузка списка репитеров...', 'info');
    
    try {
        // Download repeater list
        const repeaterList = await downloadRepeaterList(params.force);
        showStatus(`Загружено репитеров: ${repeaterList.length}`, 'info');
        
        // Filter list
        showStatus('Фильтрация репитеров...', 'info');
        const filteredList = filterRepeaterList(repeaterList, params);
        
        if (filteredList.length === 0) {
            showStatus('Репитеры не найдены по заданным критериям', 'error');
            loading.classList.remove('active');
            return;
        }
        
        showStatus(`Найдено репитеров: ${filteredList.length}`, 'success');
        
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
        showStatus('Генерация XML файлов...', 'info');
        const { zoneFiles, outputList } = generateZoneFiles(filteredList, params, customValues);
        
        // Display results
        displayResults(outputList, zoneFiles);
        showStatus(`Успешно сгенерировано зон: ${zoneFiles.length}`, 'success');
        
    } catch (error) {
        console.error('Error:', error);
        showStatus(`Ошибка: ${error.message}`, 'error');
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
