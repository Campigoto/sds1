import React, { useState, useEffect } from 'react';
import Filters from '../../components/Filters';
import './styles.css';
import {barOptions, pieOptions } from './chart-options';
import Chart from 'react-apexcharts';
import axios from 'axios';
import {buildBarSeries, getPlatformChartData, getGenderChartData} from './helpers';

type PieChartData = {
    labels: string[];
    series: number[];
}

type BarChartData = {
    x: string;
    y: number;
}

const initialPieData = {
    labels: [],
    series: []
}

const BASE_URL = 'http://localhost:8080';

const Charts = () => {

    const [barChartData, setBarChartData] = useState<BarChartData[]>([]);
    const [platformtData, setplatformData] = useState<PieChartData>(initialPieData);
    const [genderData, setGenderData] =useState<PieChartData>(initialPieData);

    useEffect(() => {
        async function getData() {
            const recordsResponse = await axios.get(`${BASE_URL}/records`);
            const gamesResponse = await axios.get(`${BASE_URL}/games`);

            const barData = buildBarSeries(gamesResponse.data, recordsResponse.data.content);
            setBarChartData(barData);

            const PlatformChartData = getPlatformChartData(recordsResponse.data.content);
            setplatformData(PlatformChartData); 
            
            const GenderChartData = getGenderChartData(recordsResponse.data.content);
            setGenderData(GenderChartData);
        }
        getData();
    }, [] )

    return (
        <div className="page-container">
            <Filters link="/records" linkText="VER TABELAS" />
            <div className="chart-container">
                <div className="top-related">
                    <h1 className="top-related-title">
                      Jogos mais votados  
                    </h1>
                    <div className="gamers-container">
                        <Chart 
                            options={barOptions} 
                            type="bar"
                            width="900"
                            height="650"
                            series={[{ data: barChartData}]}
                        />
                    </div>
                </div>
                <div className="charts">
                    <div className="platform-chart">
                        <h2 className="chart-title" >Plataformas</h2> 
                        <Chart 
                          options={{...pieOptions, labels:platformtData?.labels}} 
                          type="donut"
                          width="350"
                          series={platformtData?.series}
                        />
                    </div>
                    <div className="gender-chart">
                        <h2 className="chart-title" >Gêneros</h2>
                         <Chart 
                          options={{...pieOptions, labels:genderData?.labels}} 
                          type="donut"
                          width="350"
                          series={genderData?.series}
                        />
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Charts;