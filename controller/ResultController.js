// controller/resultController.js
import { mlpredictWeather } from '../services/mlService.js';
import { getCurrentWeather } from '../services/weatherService.js'; // Mengimpor service cuaca

// Controller untuk menerima input data cuaca dan memanggil mlService untuk prediksi
export const predictWeather = async (req, res) => {
    console.log("Received Body: ", req.body);
    try {
        // Ambil data lat, lon dari body request
        const { lat, lon } = req.body;

        // Pastikan data lat dan lon ada
        if (lat === undefined || lon === undefined) {
            return res.status(400).json({ error: 'Koordinat lat dan lon tidak lengkap' });
        }

        // Panggil service cuaca untuk mendapatkan data cuaca (Tn, Tx, Tavg, RH_avg, ff_avg) berdasarkan koordinat
        const weatherData = await getCurrentWeather(lat, lon);

        // Ambil data yang dibutuhkan: Tn, Tx, Tavg, RH_avg, ff_avg
        const inputData = {
            Tn: weatherData.temp_min,   // Suhu minimum (Tn)
            Tx: weatherData.temp_max,   // Suhu maksimum (Tx)
            Tavg: weatherData.temperature, // Suhu rata-rata (Tavg)
            RH_avg: weatherData.humidity, // Kelembapan rata-rata (RH_avg)
            ff_avg: weatherData.wind_speed // Kecepatan angin rata-rata (ff_avg)
        };

        // Panggil service untuk memanggil API Flask dan mendapatkan hasil prediksi
        const result = await mlpredictWeather(inputData);

        // Kembalikan hasil prediksi ke client
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in weather prediction:', error);
        return res.status(500).json({ error: 'Terjadi error saat melakukan prediksi cuaca' });
    }
};
