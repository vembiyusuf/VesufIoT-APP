const ctx = document.getElementById('waveformChart').getContext('2d');

const waveformChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: Array(50).fill(''),  // Titik waktu kosong untuk real-time
        datasets: [
            {
                label: 'Suhu (°C)',
                borderColor: 'red',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                data: Array(50).fill(0),
                fill: true
            },
            {
                label: 'Kelembaban (%)',
                borderColor: 'blue',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                data: Array(50).fill(0),
                fill: true
            },
            {
                label: 'Kecerahan (Lux)',
                borderColor: 'yellow',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                data: Array(50).fill(0),
                fill: true
            },
            {
                label: 'Soil Moisture (%)',
                borderColor: 'green',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                data: Array(50).fill(0),
                fill: true
            }
        ]
    },
    options: {
        responsive: true,
        animation: { duration: 0 },  // Hilangkan delay untuk real-time
        scales: {
            x: { display: false },  // Sumbu X disembunyikan agar fokus ke gelombang
            y: { title: { display: true, text: 'Nilai Sensor' } }
        },
        elements: { line: { tension: 0.3 } } // Haluskan garis gelombang
    }
});

function updateWaveform(sensor, value) {
    // Geser data ke kiri agar bergerak real-time
    waveformChart.data.labels.shift();
    waveformChart.data.datasets.forEach(dataset => dataset.data.shift());

    // Tambahkan nilai terbaru ke dataset yang sesuai
    waveformChart.data.labels.push('');
    if (sensor === 'suhu') {
        waveformChart.data.datasets[0].data.push(value);
    } else if (sensor === 'kelembaban') {
        waveformChart.data.datasets[1].data.push(value);
    } else if (sensor === 'kecerahan') {
        waveformChart.data.datasets[2].data.push(value);
    } else if (sensor === 'soil-moisture') {
        waveformChart.data.datasets[3].data.push(value);
    }

    waveformChart.update();
}

// MQTT menerima data sensor
client.on('message', (topic, message) => {
    const payload = parseFloat(message.toString());  // Ubah string jadi angka
    console.log('MQTT Data:', topic, payload);

    if (topic === 'vesuf-iot/suhu') {
        document.getElementById('suhu').innerText = payload;
        updateWaveform('suhu', payload);
    } else if (topic === 'vesuf-iot/kelembaban') {
        document.getElementById('kelembaban').innerText = payload;
        updateWaveform('kelembaban', payload);
    } else if (topic === 'vesuf-iot/kecerahan') {
        document.getElementById('kecerahan').innerText = payload;
        updateWaveform('kecerahan', payload);
    } else if (topic === 'vesuf-iot/soil-moisture') {
        document.getElementById('soil-moisture').innerText = payload;
        updateWaveform('soil-moisture', payload);
    }
});
