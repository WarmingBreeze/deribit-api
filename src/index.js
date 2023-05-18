// Include the core fusioncharts file from core
import FusionCharts from 'fusioncharts/core';
// Include the chart from viz folder
import CandleStick from 'fusioncharts/viz/candlestick';
// Include the fusion theme
import FusionTheme from 'fusioncharts/themes/es/fusioncharts.theme.fusion';
// Add the chart and theme as dependency
// E.g. FusionCharts.addDep(ChartType)
FusionCharts.addDep(CandleStick);
FusionCharts.addDep(FusionTheme);

// Deribit API request
let instrumentName = 'BTC-PERPETUAL';
let endTime = Date.now();
let startTime = endTime - 7776000000
let freq = '1D';

var msg = 
{
  "jsonrpc" : "2.0",
  "id" : 999,
  "method" : "public/get_tradingview_chart_data",
  "params" : {
    "instrument_name" : instrumentName,
    "start_timestamp" : startTime,
    "end_timestamp" : endTime,
    "resolution" : freq
  }
};
var ws = new WebSocket('wss://www.deribit.com/ws/api/v2');
ws.onmessage = function (e) {
  let response = JSON.parse(e.data);
  let result = response.result;
  let chartData = [];
  function OHLC (open, high, low, close, x, volume) {
    this.open = open;
    this.high = high;
    this.low = low;
    this.close = close;
    this.x = x;
    this.volume = volume;
  }
  let count = 0;
  result.open.forEach(e => {
    chartData.push(new OHLC(e, result.high[count], result.low[count], result.close[count], count+1, result.volume[count]));
    count++;
  });

  // Charting
  // Create a JSON object to store the chart configurations
  const chartConfigs = {
    //Specify the chart type
    type: "candlestick",
    //Set the container object
    renderAt: "candlestick-chart",
    //Specify the width of the chart
    width: "100%",
    //Specify the height of the chart
    height: "70%",
    //Set the type of data
    dataFormat: "json",
    dataSource: {
      "chart": {
        "caption": "Deribit BTC-PERPETUAL",
        "subCaption": "Last 3 months",
        "numberprefix": "$",
        "vNumberPrefix": " ",
        "pyaxisname": "Price",
        "vyaxisname": "Volume",
        "theme": "fusion",
        "showVolumeChart": "1",
        "pYAxisMinValue": Math.min(...result.low),
        "pYAxisMaxValue": Math.max(...result.high)
      },
      "categories": [
        {
            "category": [
                {
                    "label": "3 month ago",
                    "x": "1"
                },
                {
                    "label": "2 month ago",
                    "x": "31"
                },
                {
                    "label": "1 month ago",
                    "x": "61"
                },
                {
                  "label": "today",
                  "x": "91"
                }
            ]
        }
      ],
      "dataset": [
        {
          "data": chartData
        },
      ]
    }
  };

  //render the chart
  FusionCharts.ready(function(){
    var fusioncharts = new FusionCharts(chartConfigs);
    fusioncharts.render();
  }); 
  console.log('received from server : ', chartData);
};
ws.onopen = function () {
    ws.send(JSON.stringify(msg));
};