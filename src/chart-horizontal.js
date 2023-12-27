import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  indexAxis: 'y',
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
    },
    title: {
      display: true,
      text: 'Expense and Income Chart',
    },
  },
};

const HorizontalChart = () => {
  const [data, setData] = useState({
    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    datasets: [
      {
        label: 'Expense',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Income',
        data: [],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      const expenseUrl = '/api/expenses/chart';
      const incomeUrl = '/api/incomes/chart';

      try {
        const [expenseResponse, incomeResponse] = await Promise.all([
          fetch(expenseUrl),
          fetch(incomeUrl),
        ]);

        const [expenseData, incomeData] = await Promise.all([
          expenseResponse.json(),
          incomeResponse.json(),
        ]);

        const labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const expenseValues = expenseData.map((expense) => expense.totalAmount);
        const incomeValues = incomeData.map((income) => income.totalAmount);

        setData({
          labels,
          datasets: [
            {
              ...data.datasets[0],
              data: expenseValues,
            },
            {
              ...data.datasets[1],
              data: incomeValues,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: '80%', height: '50%' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default HorizontalChart;
