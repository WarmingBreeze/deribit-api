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
    // do something with the response...
    console.log('received from server : ', e.data);
};
ws.onopen = function () {
    ws.send(JSON.stringify(msg));
};