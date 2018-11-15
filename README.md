# jrftimer

**jrftimer** is a simple **async/await** timer.

## Installation
```
$ npm i jrftimer
```

## Example start without delay
```js
const JrfTimer = require('jrftimer');

function wait(mlsecond = 1000) {
    return new Promise(resolve => setTimeout(resolve, mlsecond));
}

async function test() {

    let resObject = {
        cbOnStart: false,
        cbOnStop: false,
        timeRun: null,
    };

    //Example 1
    let timer = new JrfTimer();
    console.log('Start without delay. Before start. Example 1.');
    console.log(resObject);
    console.log('------------------------------------');

    //set callback event
    await timer.setOnEvent('onStart', async () => resObject.cbOnStart = true);
    await timer.setOnEvent('onStop', async () => {
        resObject.cbOnStop = true;
        resObject.timeRun = timer.datetimeFinish - timer.datetimeStart;
    });

    //set finish time 2100ms
    await timer.setDatetimeFinish('100ms, 2s');

    //start timer
    await timer.start();

    await wait(2110);

    console.log('Start without delay. After stop.  Example 1.');
    console.log(resObject);
    console.log('------------------------------------');

    /// -------------------------------------------------------------------

    //Example 2
    resObject.cbOnStart = false;
    resObject.cbOnStop = false;
    resObject.timeRun = null;
    
    await timer.reset();
    timer.onStart = null;
    timer.onStop = null;

    console.log('Start without delay. Before start. Example 2.');
    console.log(resObject);
    console.log('------------------------------------');

    //start timer
    await timer.start({
        datetimeFinish: '10ms, 1s, 500ms',
        onStart: async () => resObject.cbOnStart = true,
        onStop: async () => {
            resObject.cbOnStop = true;
            resObject.timeRun = timer.datetimeFinish - timer.datetimeStart;
        }
    });

    await wait(1550);

    console.log('Start without delay. After stop.  Example 2.');
    console.log(resObject);
    console.log('------------------------------------');

}

test();
```

## Example start with delay
```js
const JrfTimer = require('jrftimer');

function wait(mlsecond = 1000) {
    return new Promise(resolve => setTimeout(resolve, mlsecond));
}

async function testWithDelay() {

    let resObject = {
        cbOnStart: false,
        cbOnStop: false,
        timeRun: null,
        delay: null
    };

    //Example 1
    let timer = new JrfTimer();
    console.log('Start with delay. Before start. Example 1.');
    console.log(resObject);
    console.log('------------------------------------');

    //set callback event
    await timer.setOnEvent('onStart', async () => resObject.cbOnStart = true);
    await timer.setOnEvent('onStop', async () => {
        resObject.cbOnStop = true;
        resObject.timeRun = timer.datetimeFinish - timer.datetimeStart;
        resObject.delay = timer.datetimeStart - now;
    });

    //set delay time 500ms
    await timer.setDatetimeStart('500ms');

    //set finish time 2100ms
    await timer.setDatetimeFinish('100ms, 2s');

    let now = new Date();

    //start timer
    await timer.start();

    await wait(2650);

    console.log('Start without delay. After stop.  Example 1.');
    console.log(resObject);
    console.log('------------------------------------');

    /// -------------------------------------------------------------------

    //Example 2
    resObject.cbOnStart = false;
    resObject.cbOnStop = false;
    resObject.timeRun = null;
    resObject.delay = null;

    await timer.reset();
    timer.onStart = null;
    timer.onStop = null;

    console.log('Start without delay. Before start. Example 2.');
    console.log(resObject);
    console.log('------------------------------------');

    //start timer
    await timer.start({
        datetimeStart: '630ms',
        datetimeFinish: '10ms, 1s, 500ms',
        onStart: async () => resObject.cbOnStart = true,
        onStop: async () => {
            resObject.cbOnStop = true;
            resObject.timeRun = timer.datetimeFinish - timer.datetimeStart;
            resObject.delay = timer.datetimeStart - now;
        }
    });

    now = new Date();

    await wait(2160);

    console.log('Start without delay. After stop.  Example 2.');
    console.log(resObject);
    console.log('------------------------------------');

}

testWithDelay();
````

## Methods

| Method | Set status | Allowed with statuses | Description |
|--|--|--|--|
| start | RUNNING | READY | Start the timer. onStart event will be executed. Returns true or false. Input function can take an startObject |
| stop | COMPLETED | RUNNING| Stop the timer. onStop event will be executed. Returns true or false. |
| reset | READY | any | Reset timer. Events are not deleted. |
| setOnEvent | nothing | any | Set event handler. The first parameter is the name of the event. The second parameter is the function handler. |
| setDatetimeStart | nothing | READY | Set the start time of the timer. Or set a delay before the timer starts from the moment the timer starts. The delay is set by the format string: Xms - X milliseconds, Xs - X seconds, Xm - X minutes, Xh - X hours, Xd - X days. For example: "1d, 2h, 3ms" |
| setDatetimeFinish | nothing | READY | Set the time to stop the timer. Or set a delay before the timer stops from the time the timer starts. The delay is set by the format string: Xms - X milliseconds, Xs - X seconds, Xm - X minutes, Xh - X hours, Xd - X days. For example: "1d, 2h, 3ms" |

**startObject**

Properties are optional.

```js
{
    datetimeStart: new Date(),
    datetimeFinish: '10ms, 1s, 500ms',
    onStart: async () => console.log('timer start'),
    onStop: async () => console.log('timer stop')
}
```

## Properties 

| Properties | Type | Description |
|--|--|--|
| datetimeStart | date | Date start time |
| datetimeFinish | date | Date stop time. |
| onStart | date | Function handler start timer. |
| onStop | date | Function handler stop timer. |
| statusList | array | List of statuses. READY, RUNNING, COMPLETED. |
| status | string | Current status. |
| partsTime | object | An object containing time units in milliseconds. |

