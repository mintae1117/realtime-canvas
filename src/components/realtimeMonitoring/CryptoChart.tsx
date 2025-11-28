import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  useMonitoringStore,
  TIME_INTERVALS,
  type TimeInterval,
} from "../../store/monitoringStore";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const CryptoChart: React.FC = () => {
  const {
    selectedCrypto,
    priceHistory,
    realtimePrice,
    timeInterval,
    setTimeInterval,
  } = useMonitoringStore();

  // 시간 간격에 따른 라벨 포맷
  const formatLabel = (timestamp: number, interval: TimeInterval) => {
    const date = new Date(timestamp);
    if (interval === "1d") {
      return date.toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
      });
    }
    if (interval === "4h" || interval === "1h") {
      return date.toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
      });
    }
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 시간 간격에 따른 차트 제목
  const getChartTitle = (interval: TimeInterval) => {
    switch (interval) {
      case "1m":
        return "1시간 가격 차트";
      case "5m":
        return "6시간 가격 차트";
      case "15m":
        return "24시간 가격 차트";
      case "1h":
        return "3일 가격 차트";
      case "4h":
        return "15일 가격 차트";
      case "1d":
        return "3개월 가격 차트";
      default:
        return "가격 차트";
    }
  };

  const chartData = useMemo(() => {
    // 히스토리 데이터 + 실시간 가격을 합침
    const combinedHistory = [...priceHistory];

    // 실시간 가격이 있고, 마지막 히스토리보다 최신이면 추가
    if (realtimePrice && combinedHistory.length > 0) {
      const lastHistoryTime =
        combinedHistory[combinedHistory.length - 1].timestamp;
      if (realtimePrice.timestamp > lastHistoryTime) {
        combinedHistory.push(realtimePrice);
      }
    }

    const labels = combinedHistory.map((item) =>
      formatLabel(item.timestamp, timeInterval)
    );

    const prices = combinedHistory.map((item) => item.price);

    // Determine color based on price trend
    const isPositive =
      prices.length >= 2 ? prices[prices.length - 1] >= prices[0] : true;
    const lineColor = isPositive
      ? "rgba(34, 197, 94, 1)"
      : "rgba(239, 68, 68, 1)";
    const bgColor = isPositive
      ? "rgba(34, 197, 94, 0.1)"
      : "rgba(239, 68, 68, 0.1)";

    return {
      labels,
      datasets: [
        {
          label: `${selectedCrypto?.name || "Crypto"} Price (USD)`,
          data: prices,
          borderColor: lineColor,
          backgroundColor: bgColor,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: lineColor,
        },
      ],
    };
  }, [priceHistory, realtimePrice, selectedCrypto, timeInterval]);

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            if (value === null || value === undefined) return "";
            return `$${value.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: "#9ca3af",
          font: {
            size: 10,
          },
          maxTicksLimit: 8,
        },
      },
      y: {
        display: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          color: "#9ca3af",
          font: {
            size: 10,
          },
          callback: (value) => {
            const numValue =
              typeof value === "string" ? parseFloat(value) : value;
            if (numValue >= 1000) {
              return `$${(numValue / 1000).toFixed(1)}K`;
            }
            return `$${numValue.toFixed(2)}`;
          },
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

  if (priceHistory.length === 0) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-2 text-gray-500 text-sm">차트 데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">
          {getChartTitle(timeInterval)}
        </h3>
        <div className="flex gap-1">
          {TIME_INTERVALS.map((interval) => (
            <button
              key={interval.value}
              onClick={() => setTimeInterval(interval.value)}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                timeInterval === interval.value
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {interval.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};
