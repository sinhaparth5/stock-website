export interface StockData {
    "Time Series (1min)": {
        [key: string]: {
            "1. open": string,
            "2. high": string,
            "3. low": string,
            "4. closes": string,
            "5. volumes": string,
        };
    };
}