import { json, LoaderFunction, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getStockPrices } from "~/utils/stock_api";
import { StockData } from "~/types/StockData";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  ChartOptions
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, TimeScale);

export const meta: MetaFunction = () => {
  return [
    { title: "Invest" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const symbol = url.searchParams.get("symbol") || "AAPL";
  const stockData: StockData = await getStockPrices(symbol);
  return json({ stockData });
};

export default function Index() {
  const { stockData } = useLoaderData<{ stockData: StockData }>();

  if (!stockData || !stockData["Time Series (1min)"]) {
    return <div>Failed to fetch stock data.</div>;
  }

  const timeSeries = stockData["Time Series (1min)"];
  const labels = Object.keys(timeSeries).reverse();
  const prices = labels.map((key) => parseFloat(timeSeries[key]["1. open"]));

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: prices,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'minute' as const,
          displayFormats: {
            minute: 'HH:mm'
          }
        },
        ticks: {
          source: 'auto',
          maxRotation: 45
        }
      },
      y: {
        type: 'linear' as const,
        beginAtZero: false,
        position: 'left' as const,
      }
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      tooltip: {
        enabled: true
      }
    }
  };

  return (
    <div>
      <h1>Stock Prices</h1>
      <Line data={data} options={options} />
    </div>
  );
}