import React from "react"
import { useLoaderData, Await } from "react-router-dom"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Transaction from "../../components/Host/Transaction"
import Loading from "../../components/Loading"
import { isWithinLast30Days } from "../../../utils"

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function Income() {
    // defer promise
    const { hostRentedVans } = useLoaderData()

    function renderHostIncomeElements(hostRentedVans) {
        let rentalsWithinLast30Days = []
        let totalIncome = 0
        let transactionElements = []
        if (hostRentedVans) {
            // get last 30 day rental transactions
            rentalsWithinLast30Days = hostRentedVans.filter(rentedVan => isWithinLast30Days(rentedVan, "placed_date"))
            totalIncome = rentalsWithinLast30Days.reduce((totalIncome, rentedVan) => totalIncome + rentedVan.total_cost, 0)
            transactionElements = rentalsWithinLast30Days.map(rental => {
                const {total_cost, placed_date} = rental;
                return <Transaction key={rental._id} total_cost={Number(total_cost)} placed_date={placed_date} />
            })
        }

        const barGraphData = generateBarGraphData(hostRentedVans || []);
        
        const graphOptions = {
            elements: {
                bar: {
                    borderRadius: {
                        topLeft: 5,
                        topRight: 5,
                        bottomLeft: 0,
                        bottomRight: 0,
                    },
                },
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
        
        
        return (
            <>
                <h1>${totalIncome}</h1>
                <div className="income--graph">
                    {barGraphData && <Bar data={barGraphData} options={graphOptions}/>}
                </div>
                <div className="transactions--container">
                    <div>
                        <h3>Your transactions ({transactionElements.length})</h3>
                        <p>Last <span>30 days</span></p>
                    </div>
                    {transactionElements}
                </div>
            </>
        )

    }

    // helper funciton to calculate total revenue for each month
    function calculateMonthlyRevenues(hostRentedVans) {
        const monthlyRevenues = {}

        hostRentedVans.forEach(hostRentedVan => {
            const date = new Date(hostRentedVan.placed_date); 
            const month = date.toLocaleString('default', { month: 'short' });
            monthlyRevenues[month] = (monthlyRevenues[month] || 0) + hostRentedVan.total_cost
        })

        return monthlyRevenues
    }

    // helper function to generate what the last 8 months were for
    function getLastEightMonths() {
        const today = new Date();
        const months = [];

        for (let i = 7; i >= 0; i--) {
            const month = new Date();
            month.setMonth(today.getMonth() - i);
            months.push(month.toLocaleString('default', { month: 'short' }));
        }
      
        return months;
    }

    function generateBarGraphData(hostRentedVans) {
        const monthlyRevenues = calculateMonthlyRevenues(hostRentedVans);
        
        const labels = getLastEightMonths();
        const data = labels.map(month => monthlyRevenues[month] || 0);

        const backgroundColors = labels.map(month =>
            (month === new Date().toLocaleString('default', { month: 'short' })) ? '#FF8C38' : '#FFEAD0'
        );

        return {
            labels: labels,
            datasets: [
                {
                    backgroundColor: backgroundColors,
                    data: data,
                },
            ],
        }
    }

    return (
        <section className="income">
            <h2>Income</h2>
            <p>Last <span>30 days</span></p>
            <React.Suspense fallback={<Loading />}>
                <Await resolve={hostRentedVans}>
                    {renderHostIncomeElements}
                </Await>
            </React.Suspense>
        </section>
    )
}

export default Income