import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import './ExtentPrediction.css';
import FloatingAssistant from '../FloatingAssistant/FloatingAssistant';

const ExtentPrediction = () => {
  const [data, setData] = useState([]);
  const [selectedState, setSelectedState] = useState('Odisha');
  const [stateData, setStateData] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  // eslint-disable-next-line
  const [cityData, setCityData] = useState([]);
  const [diseaseData, setDiseaseData] = useState([]);
  const [projectedCases, setProjectedCases] = useState([]);

  useEffect(() => {
    fetch('https://34.123.66.225:9070/load_data')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    if (selectedState) {
      setStateData(data.filter(row => row.STATE === selectedState));
    }
  }, [selectedState, data]);

  useEffect(() => {
    if (selectedCity) {
      setCityData(data.filter(row => row.CITY === selectedCity));
    }
  }, [selectedCity, data]);

  useEffect(() => {
    setDiseaseData(data.filter(row => row.Disease));
  }, [data]);

  useEffect(() => {
    fetch('https://34.123.66.225:9070/projected_cases', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Projected Cases Data:", data); // Log the data
        setProjectedCases(data);
      });
  }, [data]);

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const transformDataForGroupedBarChart = (data, column) => {
    const filteredData = data.filter(d => d[column] != null && d[column] !== '');
    const uniqueValues = Array.from(new Set(filteredData.map(d => d[column])));
    return uniqueValues.map(value => {
      return {
        x: filteredData.map(d => d.CITY),
        y: filteredData.map(d => (d[column] === value ? 1 : 0)),
        type: 'bar',
        name: `${value}`
      };
    });
  };

  return (
    <div className="ExtentPrediction">
      <FloatingAssistant />
      <h2>Patient Characteristics by State</h2>
      <select onChange={handleStateChange}>
        <option value="">Select a State</option>
        {Array.from(new Set(data.map(row => row.STATE))).map((state, index) => (
          <option key={index} value={state}>{state}</option>
        ))}
      </select>
      {selectedState && (
        <div className="state-charts">
          <div className="chart-row">
            <div className="chart">
              <Plot
                data={[{ x: stateData.map(d => d.GENDER), type: 'histogram', name: 'Gender Distribution' }]}
                layout={{ title: 'Gender Distribution', barmode: 'stack' }}
              />
            </div>
            <div className="chart">
              <Plot
                data={[{ x: stateData.map(d => d.BP_Status), type: 'histogram', name: 'BP Status Distribution' }]}
                layout={{ title: 'BP Status Distribution', barmode: 'stack' }}
              />
            </div>
          </div>
          <div className="chart-row">
            <div className="chart">
              <Plot
                data={[{ x: stateData.map(d => d.BLOODGROUP), type: 'histogram', name: 'Blood Group Distribution' }]}
                layout={{ title: 'Blood Group Distribution', barmode: 'stack' }}
              />
            </div>
            <div className="chart">
              <Plot
                data={[{ x: stateData.map(d => d.BMI_STATUS), type: 'histogram', name: 'BMI Status Distribution' }]}
                layout={{ title: 'BMI Status Distribution', barmode: 'stack' }}
              />
            </div>
            <Plot
              data={[{ x: stateData.map(d => d.AGE), type: 'histogram', name: 'Age Distribution' }]}
              layout={{ title: 'Age Distribution', barmode: 'stack' }}
            />
          </div>
        </div>
      )}
      {selectedState && (
        <>
          <Plot
            data={transformDataForGroupedBarChart(stateData, 'GENDER')}
            layout={{ title: 'Gender Distribution by City', barmode: 'stack' }}
          />
          <Plot
            data={transformDataForGroupedBarChart(stateData, 'BLOODGROUP')}
            layout={{ title: 'Blood Group Distribution by City', barmode: 'stack' }}
          />
          <Plot
            data={transformDataForGroupedBarChart(stateData, 'BP_Status')}
            layout={{ title: 'BP Status Distribution by City', barmode: 'stack' }}
          />
          <Plot
            data={transformDataForGroupedBarChart(stateData, 'BMI_STATUS')}
            layout={{ title: 'BMI Status Distribution by City', barmode: 'stack' }}
          />
        </>
      )}
      <h2>Chronic Conditions Analysis</h2>
      {diseaseData.length > 0 && (
        <>
          <Plot
            data={[
              {
                x: diseaseData.map(d => d.Disease),
                type: 'histogram',
                name: 'Disease Distribution'
              }
            ]}
            layout={{ title: 'Disease Distribution' }}
          />
          <Plot
            data={[
              {
                labels: diseaseData.map(d => d.Disease),
                values: diseaseData.map(d => d.AGE),
                type: 'pie',
                name: 'Disease Distribution'
              }
            ]}
            layout={{ title: 'Disease Distribution' }}
          />
        </>
      )}
      <h2>Projected Number of Cases of Each Disease in the Population of Odisha</h2>
      <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Disease</th>
            <th>Lower Bound</th>
            <th>Upper Bound</th>
          </tr>
        </thead>
        <tbody>
          {projectedCases.map((caseData, index) => (
            <tr key={index}>
              <td>{caseData["index"]}</td>
              <td>{caseData["Lower Bound"]}</td>
              <td>{caseData["Upper Bound"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default ExtentPrediction;
