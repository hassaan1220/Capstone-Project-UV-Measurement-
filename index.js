import axios from 'axios';
import bodyParser from 'body-parser';
import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

// My API keys
const openweathermap_key = "f28fdd9f87b8285ffab426678c232268";

// Middlewares
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Routes
app.get('/', (req, res) => {
    res.render("index.ejs", { uvResponse: null, error: null });
});

// using post req
app.post('/uv', async (req, res) => {
    const city = req.body["city"];
    const country = req.body["country"];
    const date = req.body["datetime"];
    try {
        // calling an geocoding api for latittude and longitude
        const geocodingAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&appid=${openweathermap_key}`;
        const result1 = await axios.get(geocodingAPI);
        const latitude = result1.data[0].lat;
        const longitude = result1.data[0].lon;

        // calling an openuv api for measuring the uv
        const openuvAPI = `https://api.openuv.io/api/v1/uv?lat=${latitude}&lng=${longitude}&dt=${date}`;
        const uvResponse = await axios.get(openuvAPI, {
            headers: {
                "x-access-token": "openuv-3ivcrmcgfdgs0-io"
            }
        });
        res.render('index.ejs', { uvResponse: uvResponse.data, error: null });
    } catch (error) {
        res.render('index.ejs', { uvResponse: null, error: "can't fetch the data" });
    }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

