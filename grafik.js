const ctx = document.getElementById('sensorChart').getContext('2d');
const sensorChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Waktu pengambilan data
        datasets: [
            {
                label: 'Suhu (°C)',
                borderColor: 'red',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                data: [],
                fill: true
            },
            {
                label: 'Kelembaban (%)',
                borderColor: 'blue',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                data: [],
                fill: true
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            x: { title: { display: true, text: 'Waktu' } },
            y: { title: { display: true, text: 'Nilai' } }
        }
    }
});

function updateChart(sensor, value) {
    const now = new Date().toLocaleTimeString();
    if (sensorChart.data.labels.length > 10) {
        sensorChart.data.labels.shift();
        sensorChart.data.datasets[0].data.shift();
        sensorChart.data.datasets[1].data.shift();
    }

    sensorChart.data.labels.push(now);
    if (sensor === 'suhu') {
        sensorChart.data.datasets[0].data.push(value);
    } else if (sensor === 'kelembaban') {
        sensorChart.data.datasets[1].data.push(value);
    }
    sensorChart.update();
}

client.on('message', (topic, message) => {
    const payload = message.toString();
    console.log('Pesan:', topic, payload);

    if (topic === 'vesuf-iot/suhu') {
        document.getElementById('suhu').innerText = payload;
        updateChart('suhu', parseFloat(payload));
    } else if (topic === 'vesuf-iot/kelembaban') {
        document.getElementById('kelembaban').innerText = payload;
        updateChart('kelembaban', parseFloat(payload));
    }
});
