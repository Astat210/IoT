const BROKER_URL = "aa35ed01674b4913b0c754630c923b32.s1.eu.hivemq.cloud";
const WS_PORT = 8884;
const MQTT_USERNAME = "Artur";
const MQTT_PASSWORD = "Tt123456";
const TOPIC = "iot/device/temp";

const HOST = `wss:

const statusElement = document.getElementById('status');
const latestTempElement = document.getElementById('latestTemp');
const ctx = document.getElementById('tempChart').getContext('2d');

const MAX_DATA_POINTS = 20;
const chartData = {
    labels: [],
    datasets: [{
        label: 'Температура (°C)',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false
    }]
};

const tempChart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
        animation: false,
        scales: {
            y: {
                min: 15,
                max: 35,
                title: { display: true, text: 'Температура (°C)' }
            }
        }
    }
});


const client = mqtt.connect(HOST, {
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    clientId: 'web_viewer_' + Math.random().toString(16).substr(2, 8) // Уникальный ID для браузера
});


client.on('connect', function () {
    statusElement.textContent = "Статус: Подключено";
    statusElement.style.color = "green";

    client.subscribe(TOPIC, function (err) {
        if (!err) {
            console.log(`Успешно подписан на топик: ${TOPIC}`);
        } else {
            console.error('Ошибка подписки:', err);
        }
    });
});

client.on('message', function (topic, message) {
    const temperature = parseFloat(message.toString());

    if (isNaN(temperature)) {
        console.warn("Получено некорректное значение:", message.toString());
        return;
    }

    latestTempElement.textContent = temperature.toFixed(2);

    const now = new Date();
    const timeLabel = now.toLocaleTimeString();

    if (chartData.labels.length >= MAX_DATA_POINTS) {
        chartData.labels.shift();
        chartData.datasets[0].data.shift();
    }

    chartData.labels.push(timeLabel);
    chartData.datasets[0].data.push(temperature);

    tempChart.update();

    console.log(`Получено: ${temperature} °C`);
});

client.on('error', function (err) {
    statusElement.textContent = "Статус: Ошибка! Проверьте настройки URL/брокера";
    statusElement.style.color = "red";
    console.error("Ошибка MQTT:", err);
    client.end();
});

client.on('close', function () {
    statusElement.textContent = "Статус: Отключено";
    statusElement.style.color = "gray";
});