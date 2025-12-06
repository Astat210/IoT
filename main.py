import time
import random
import paho.mqtt.client as mqtt
import ssl

BROKER_URL = "aa35ed01674b4913b0c754630c923b32.s1.eu.hivemq.cloud"
BROKER_PORT = 8883
MQTT_USERNAME = "Artur"
MQTT_PASSWORD = "Tt123456"
TOPIC = "iot/device/temp"


def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print(" Успешное подключение к облаку HiveMQ!")
    else:
        print(f" Ошибка подключения. Код: {rc}")


client = mqtt.Client()

client.tls_set(cert_reqs=ssl.CERT_NONE)

client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)

client.on_connect = on_connect

print("Подключение к брокеру...")
try:
    client.connect(BROKER_URL, BROKER_PORT)
except Exception as e:
    print(f"Не удалось подключиться: {e}")
    exit()

client.loop_start()
try:
    while True:
        temperature = round(random.uniform(20.0, 30.0), 2)

        client.publish(TOPIC, temperature)

        print(f" Отправлено: {temperature} °C в топик {TOPIC}")
        time.sleep(3)

except KeyboardInterrupt:
    print("\nОстановка скрипта...")
    client.loop_stop()
    client.disconnect()