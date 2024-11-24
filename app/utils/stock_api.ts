import axios from "axios";

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY as string;

export const getStockPrices = async (symbol: string): Promise<any> => {
    const endpoint = `https://www.alphavantage.co/query`;
    const params = {
        function: "TIME_SERIES_INTRADAY",
        symbol: symbol,
        interval: "1min",
        apikey: API_KEY,
    };

    const response = await axios.get(endpoint, { params });
    return response.data;
}