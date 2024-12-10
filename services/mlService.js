// services/mlService.js
import axios from 'axios'; // Untuk memanggil API Flask

// Service untuk memanggil API Flask dan mendapatkan hasil prediksi cuaca
export const mlpredictWeather = async (inputData) => {
    try {
        // Kirim data cuaca ke API Flask
        const response = await axios.post('https://ml-melaut-project-276667022964.asia-southeast2.run.app/predict', inputData 
        );

        // Ambil data dari response API
        const result = response.data;

        // Format hasil yang diterima sesuai dengan yang diinginkan
        const formattedResult = {
            input_data: result.input_data,
            predicted_condition: result.predicted_condition,
            predicted_rad: result.predicted_rad
        };

        return formattedResult;
    } catch (error) {
        console.error('Error in calling Flask API:', error);
        throw new Error('Error in calling Flask API');
    }
};
