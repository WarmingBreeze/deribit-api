const express = require('express');
const WebSocket = require('ws');
const mongoose = require('mongoose');

const app = express();

const msg =
{
    'jsonrpc': '2.0',
    'id': 't9',
    'method': 'public/get_book_summary_by_instrument',
    'params': {
        'instrument_name': 'BTC-PERPETUAL'
    }
};

const ws = new WebSocket('wss://www.deribit.com/ws/api/v2');

ws.on('error', console.error);
ws.on('open', function open(){
    ws.send(JSON.stringify(msg));
});
let result;
ws.on('message', function message(data) {
    result = JSON.parse(data).result;
    
    console.log('received: ', JSON.parse(data));
});

app.listen(3000, function(){console.log('Server starts on port 3000.')});