const options = {
    connectTimeout: 4000,
    clientId: 'mqttx_1aba0144',
    username: 'vesuf-iot',
    password: 'vJZW5PbJXWRUpY7t',
    keepalive: 60,
    clean: true,
};

const client = mqtt.connect('wss://vesuf-iot.cloud.shiftr.io', options);

client.on('connect', () => {
    console.log('Terhubung ke broker MQTT');
    document.getElementById('brokerStatus').innerHTML =
        'Status Broker: <span class="font-bold text-green-500">Terhubung</span>';
    client.subscribe('vesuf-iot/#');
});

client.on('close', () => {
    console.log('Terputus dari broker MQTT');
    document.getElementById('brokerStatus').innerHTML =
        'Status Broker: <span class="font-bold text-red-500">Terputus</span>';
});

client.on('message', (topic, message) => {
    const payload = message.toString();
    console.log('Pesan:', topic, payload);

    if (topic === 'vesuf-iot/suhu') {
        document.getElementById('suhu').innerText = payload;
    } else if (topic === 'vesuf-iot/kelembaban') {
        document.getElementById('kelembaban').innerText = payload;
    } else if (topic === 'vesuf-iot/soil-moisture') {
        document.getElementById('kelembabanTanah').innerText = payload;
    } else if (topic === 'vesuf-iot/wifi') {
        const espStatus = payload === 'online' 
            ? '<span class="font-bold text-green-500">Hidup</span>' 
            : '<span class="font-bold text-red-500">Mati</span>';
        document.getElementById('espStatus').innerHTML = `Status ESP: ${espStatus}`;
    } else if (topic === 'vesuf-iot/kecerahan') {
        document.getElementById('kecerahan').innerText = payload;
    } else if (topic === 'vesuf-iot/lampu/status') {
        const lampStatus = payload === 'ON' 
            ? '<span class="font-bold text-green-500">Nyala</span>' 
            : '<span class="font-bold text-red-500">Mati</span>';
        document.getElementById('lampStatus').innerHTML = `Status Lampu: ${lampStatus}`;
    }
});

document.getElementById('servoPosition').addEventListener('input', function() {
    const servoValue = this.value;
    document.getElementById('servoValue').innerText = `Posisi: ${servoValue}°`;
    
    client.publish('vesuf-iot/servo', servoValue, { qos: 1 }, (err) => {
        if (err) {
            alert('Kesalahan saat mengatur posisi servo.');
            console.error('Kesalahan Publish:', err);
        }
    });
});

function controlLamp(state) {
    client.publish('vesuf-iot/lampu', state, { qos: 1 }, (err) => {
        if (err) {
            alert('Kesalahan saat mengontrol lampu.');
            console.error('Kesalahan Publish:', err);
        } else {
            const lampStatusElement = document.getElementById('lampStatus');
            if (state === 'ON') {
                lampStatusElement.innerHTML = '<span class="font-bold text-green-500">Nyala</span>';
                speakResponse("Lampu telah dinyalakan.");
            } else {
                lampStatusElement.innerHTML = '<span class="font-bold text-red-500">Mati</span>';
                speakResponse("Lampu telah dimatikan.");
            }
        }
    });
}


function speakResponse(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'id-ID'; 
    speech.volume = 1; 
    speech.rate = 1; 
    speech.pitch = 0;

    if ('speechSynthesis' in window) {
        window.speechSynthesis.speak(speech);
    } else {
        alert('Speech Synthesis tidak didukung di perangkat ini.');
    }
}

let recognition;

function startVoiceControl() {
    console.log('Memulai voice control...');
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
        recognition = new window.SpeechRecognition();
    } else {
        alert('Speech Recognition tidak didukung di perangkat ini.');
        return;
    }

    recognition.lang = 'id-ID';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
        document.getElementById('voiceStatus').innerText = "Mendengarkan... Silakan berbicara.";
    };

    recognition.onresult = (event) => {
        const hasil = event.results[0][0].transcript.toLowerCase();
        document.getElementById('voiceStatus').innerText = `Anda berkata: "${hasil}"`;
        processVoiceCommand(hasil);
    };

    recognition.onerror = (event) => {
        document.getElementById('voiceStatus').innerText = "Terjadi kesalahan: " + event.error;
    };

    recognition.onend = () => {
        document.getElementById('voiceStatus').innerText = "Voice control selesai.";
    };

    recognition.start();
}

function processVoiceCommand(command) {
    const perintahNyalakan = [
        "nyalakan lampu",
        "lampu nyala",
        "hidupkan lampu",
        "lampu hidup",
        "menyalalah lampu",
        "tolong nyalakan lampu",
        "bisa nyalakan lampu"
    ];

    const perintahMatikan = [
        "matikan lampu",
        "lampu mati",
        "padamkan lampu",
        "lampu padam",
        "tolong matikan lampu",
        "bisa matikan lampu"
    ];

    if (perintahNyalakan.some(perintah => command.includes(perintah))) {
        controlLamp("ON");
        speakResponse("Lampu telah dinyalakan.");
    } else if (perintahMatikan.some(perintah => command.includes(perintah))) {
        controlLamp("OFF");
        speakResponse("Lampu telah dimatikan.");
    } else {
        speakResponse("Perintah tidak dikenali. Coba lagi.");
    }
}
