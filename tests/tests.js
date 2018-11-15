const JrfTimer = require('../jrftimer');

function wait(mlsecond = 1000) {
    return new Promise(resolve => setTimeout(resolve, mlsecond));
}

let glObj = {
    countValid: 0,
    countInvalid: 0
};

let tests = {

    async createTimer(key) {

        /// ---- HEAD ----
        let okay = false;
        let timer = new JrfTimer();

        /// ---- BODY ----
        okay = timer.datetimeStart === null;

        if (okay) {
            okay = timer.datetimeFinish === null;
        }

        if (okay) {
            okay = timer.onStart === null;
        }

        if (okay) {
            okay = timer.onStop === null;
        }

        if (okay) {
            okay = timer.status === timer.statusList.READY;
        }

        if (okay) {
            okay = JSON.stringify(timer.statusList) === JSON.stringify({
                READY: 'READY',
                RUNNING: 'RUNNING',
                COMPLETED: 'COMPLETED'
            });
        }

        if (okay) {
            okay = JSON.stringify(timer.partsTime) === JSON.stringify({
                MS: 1,
                S: 1000,
                M: 1000 * 60,
                H: 1000 * 60 * 60,
                D: 1000 * 60 * 60 * 24
            });
        }

        /// ---- FOOTER ----
        if (okay) {
            glObj.countValid++;
            return;
        }

        glObj.countInvalid++;
        console.log(`invalid test ${key}`);

    },

    async testStart(key) {

        /// ---- HEAD ----
        let okay = false;
        let timer = new JrfTimer();

        /// ---- BODY ----
        timer.status = timer.statusList.RUNNING;
        okay = !await timer.start({});

        if (okay) {
            timer.status = timer.statusList.COMPLETED;
            okay = !await timer.start({});
        }

        if (okay) {
            timer.status = timer.statusList.READY;
            okay = await timer.start({});
        }

        /// ---- FOOTER ----
        if (okay) {
            glObj.countValid++;
            return;
        }

        glObj.countInvalid++;
        console.log(`invalid test ${key}`);

    },

    async testStop(key) {

        /// ---- HEAD ----
        let okay = false;
        let timer = new JrfTimer();

        /// ---- BODY ----
        timer.status = timer.statusList.COMPLETED;
        await timer.setOnEvent('onStop', async () => glObj.testStop = true);

        okay = !await timer.stop();

        if (okay) {
            timer.status = timer.statusList.READY;
            okay = !await timer.stop();
        }

        if (okay) {
            timer.status = timer.statusList.RUNNING;
            okay = await timer.stop();
        }

        if (okay) {
            okay = glObj.testStop;
        }

        /// ---- FOOTER ----
        if (okay) {
            glObj.countValid++;
            return;
        }

        glObj.countInvalid++;
        console.log(`invalid test ${key}`);

    },

    async testReset(key) {

        /// ---- HEAD ----
        let okay = false;
        let timer = new JrfTimer();

        /// ---- BODY ----
        timer.status = timer.statusList.RUNNING;
        timer.datetimeStart = new Date();
        timer.datetimeFinish = new Date();
        timer._datetimeFinish = new Date();
        await timer.reset();

        okay = timer.status === timer.statusList.READY;

        if (okay) {
            okay = timer.datetimeStart === null;
        }

        if (okay) {
            okay = timer.datetimeFinish === null;
        }

        if (okay) {
            okay = timer._datetimeFinish === null;
        }

        /// ---- FOOTER ----
        if (okay) {
            glObj.countValid++;
            return;
        }

        glObj.countInvalid++;
        console.log(`invalid test ${key}`);

    },

    async testSetOnEvent(key) {

        /// ---- HEAD ----
        let okay = false;
        let timer = new JrfTimer();

        /// ---- BODY ----
        okay = !await timer.setOnEvent();

        if (okay) {
            okay = !await timer.setOnEvent('onAny');
        }

        let func = async () => glObj.setOnEvent = true;

        if (okay) {
            okay = !await timer.setOnEvent('onAny', func);
        }

        if (okay) {
            okay = await timer.setOnEvent('onStart', func);
        }

        if (okay) {
            okay = timer.onStart === func;
        }

        /// ---- FOOTER ----
        if (okay) {
            glObj.countValid++;
            return;
        }

        glObj.countInvalid++;
        console.log(`invalid test ${key}`);

    },

    async testSetDatetimeStart(key) {

        /// ---- HEAD ----
        let okay = false;
        let timer = new JrfTimer();

        /// ---- BODY ----
        timer.status = timer.statusList.RUNNING;
        okay = !await timer.setDatetimeStart();

        if (okay) {
            timer.status = timer.statusList.COMPLETED;
            okay = !await timer.setDatetimeStart();
        }

        if (okay) {
            timer.status = timer.statusList.READY;
            okay = await timer.setDatetimeStart();
        }

        if (okay) {
            okay = timer.datetimeStart <= new Date();
        }

        let now = new Date();
        if (okay) {
            await timer.setDatetimeStart(now);
            okay = timer.datetimeStart === now;
        }

        if (okay) {
            await timer.setDatetimeStart(1000);
            okay = timer._datetimeStart === 1000;
        }

        if (okay) {
            await timer.setDatetimeStart('5s');
            okay = timer._datetimeStart === timer.partsTime.S * 5;
        }

        if (okay) {
            await timer.setDatetimeStart('100ms');
            okay = timer._datetimeStart === timer.partsTime.MS * 100;
        }

        if (okay) {
            await timer.setDatetimeStart('1m');
            okay = timer._datetimeStart === timer.partsTime.M;
        }

        if (okay) {
            await timer.setDatetimeStart('1h');
            okay = timer._datetimeStart === timer.partsTime.H;
        }

        if (okay) {
            await timer.setDatetimeStart('1d');
            okay = timer._datetimeStart === timer.partsTime.D;
        }

        /// ---- FOOTER ----
        if (okay) {
            glObj.countValid++;
            return;
        }

        glObj.countInvalid++;
        console.log(`invalid test ${key}`);

    },

    async testSetDatetimeFinish(key) {

        /// ---- HEAD ----
        let okay = false;
        let timer = new JrfTimer();

        /// ---- BODY ----
        timer.status = timer.statusList.RUNNING;
        okay = !await timer.setDatetimeFinish();

        if (okay) {
            timer.status = timer.statusList.COMPLETED;
            okay = !await timer.setDatetimeFinish();
        }

        let now = new Date();
        if (okay) {
            timer.status = timer.statusList.READY;
            okay = await timer.setDatetimeFinish();
        }

        if (okay) {
            okay = timer.datetimeFinish <= new Date();
        }

        if (okay) {
            await timer.setDatetimeFinish(now);
            okay = timer.datetimeFinish === now;
        }

        if (okay) {
            await timer.setDatetimeFinish(1000);
            okay = 1000 === timer._datetimeFinish;
        }

        if (okay) {
            await timer.setDatetimeFinish('5s');
            okay = timer.partsTime.S * 5 === timer._datetimeFinish;
        }

        if (okay) {
            await timer.setDatetimeFinish('100ms');
            okay = timer.partsTime.MS * 100 === timer._datetimeFinish;
        }

        if (okay) {
            await timer.setDatetimeFinish('1m');
            okay = timer.partsTime.M === timer._datetimeFinish;
        }

        if (okay) {
            await timer.setDatetimeFinish('1h');
            okay = timer.partsTime.H === timer._datetimeFinish;
        }

        if (okay) {
            await timer.setDatetimeFinish('1d');
            okay = timer.partsTime.D === timer._datetimeFinish;
        }

        /// ---- FOOTER ----
        if (okay) {
            glObj.countValid++;
            return;
        }

        glObj.countInvalid++;
        console.log(`invalid test ${key}`);

    },

    async testRunEvent(key) {

        /// ---- HEAD ----
        let okay = false;
        let timer = new JrfTimer();

        /// ---- BODY ----
        await timer.setOnEvent('onStart', async () => glObj.onStart = true);
        await timer.setOnEvent('onStop', async () => glObj.onStop = true);
        okay = !glObj.onStart && !glObj.onStop;

        if (okay) {
            await timer._runEvent('onStart');
            okay = glObj.onStart;
        }

        if (okay) {
            await timer._runEvent('onStop');
            okay = glObj.onStop;
        }

        /// ---- FOOTER ----
        if (okay) {
            glObj.countValid++;
            return;
        }

        glObj.countInvalid++;
        console.log(`invalid test ${key}`);

    },

    async testGetPeriodBeteween(key) {

        /// ---- HEAD ----
        let okay = false;
        let timer = new JrfTimer();

        /// ---- BODY ----
        let parts = {
            d: 0,
            h: 0,
            m: 0,
            s: 0,
            ms: 0
        };

        let res = await timer._getPeriodBetween();
        okay = JSON.stringify(res) === JSON.stringify(parts);

        let start = new Date();
        let finish = new Date(start.getTime() + timer.partsTime.MS);
        if (okay) {
            res = await timer._getPeriodBetween(start, finish);
            okay = res.ms === 1
                && res.s < 1
                && res.m < 1
                && res.h < 1
                && res.d < 1
        }

        finish = new Date(start.getTime() + timer.partsTime.S);
        if (okay) {
            res = await timer._getPeriodBetween(start, finish);
            okay = res.ms === 1000
                && res.s === 1
                && res.m < 1
                && res.h < 1
                && res.d < 1
        }

        finish = new Date(start.getTime() + timer.partsTime.M);
        if (okay) {
            res = await timer._getPeriodBetween(start, finish);
            okay = res.ms === 1000 * 60
                && res.s === 60
                && res.m === 1
                && res.h < 1
                && res.d < 1
        }

        finish = new Date(start.getTime() + timer.partsTime.H);
        if (okay) {
            res = await timer._getPeriodBetween(start, finish);
            okay = res.ms === 1000 * 60 * 60
                && res.s === 60 * 60
                && res.m === 60
                && res.h === 1
                && res.d < 1
        }

        finish = new Date(start.getTime() + timer.partsTime.D);
        if (okay) {
            res = await timer._getPeriodBetween(start, finish);
            okay = res.ms === 1000 * 60 * 60 * 24
                && res.s === 60 * 60 * 24
                && res.m === 60 * 24
                && res.h === 24
                && res.d === 1
        }

        /// ---- FOOTER ----
        if (okay) {
            glObj.countValid++;
            return;
        }

        glObj.countInvalid++;
        console.log(`invalid test ${key}`);

    },

    async testGetPartPeriod(key) {

        /// ---- HEAD ----
        let okay = false;
        let timer = new JrfTimer();

        /// ---- BODY ----
        let res = await timer._getPartPeriod();
        okay = res === 0;

        if (okay) {
            res = await timer._getPartPeriod('1ms');
            okay = res === timer.partsTime.MS;
        }

        if (okay) {
            res = await timer._getPartPeriod('1s');
            okay = res === timer.partsTime.S;
        }

        if (okay) {
            res = await timer._getPartPeriod('1m');
            okay = res === timer.partsTime.M;
        }

        if (okay) {
            res = await timer._getPartPeriod('1h');
            okay = res === timer.partsTime.H;
        }

        if (okay) {
            res = await timer._getPartPeriod('1d');
            okay = res === timer.partsTime.D;
        }

        /// ---- FOOTER ----
        if (okay) {
            glObj.countValid++;
            return;
        }

        glObj.countInvalid++;
        console.log(`invalid test ${key}`);

    },

    async testGetParseStrPeriodToMS(key) {

        /// ---- HEAD ----
        let okay = false;
        let timer = new JrfTimer();

        /// ---- BODY ----
        let res = await timer._parseStrPeriodToMS(' 1 s    , 300ms');
        okay = res === 1300;

        res = await timer._parseStrPeriodToMS('1ms, 2s, 3m, 4h, 5d');
        let ms = timer.partsTime.MS;
        ms += timer.partsTime.S * 2;
        ms += timer.partsTime.M * 3;
        ms += timer.partsTime.H * 4;
        ms += timer.partsTime.D * 5;
        okay = res === ms;

        /// ---- FOOTER ----
        if (okay) {
            glObj.countValid++;
            return;
        }

        glObj.countInvalid++;
        console.log(`invalid test ${key}`);

    },

    async testNextRing(key) {

        /// ---- HEAD ----
        let okay = false;
        let timer = new JrfTimer();

        /// ---- BODY ----
        let now = new Date();
        let cb = async () => glObj.cb = true;
        await timer.setDatetimeStart(now);
        await timer.setDatetimeFinish('2s');

        let res = await timer._nextRing();
        okay = !res;
        timer.status = timer.statusList.RUNNING;

        if (okay) {
            await timer._nextRing(null, timer.datetimeFinish, cb);
            okay = !glObj.cb;
        }

        if (okay) {
            await wait(2100);
            okay = glObj.cb;
        }

        /// ---- FOOTER ----
        if (okay) {
            glObj.countValid++;
            return;
        }

        glObj.countInvalid++;
        console.log(`invalid test ${key}`);

    },

    async testRunWork(key) {

        /// ---- HEAD ----
        let okay = false;
        let timer = new JrfTimer();

        /// ---- BODY ----
        glObj.cbStart = false;
        glObj.cbStop = false;
        await timer.setDatetimeFinish('500ms');
        await timer.setOnEvent('onStart', async () => glObj.cbStart = true);
        await timer.setOnEvent('onStop', async () => glObj.cbStop = true);
        await timer.start();
        await wait(600);
        okay = glObj.cbStart && glObj.cbStop;
        await timer.reset();

        if (okay) {
            glObj.cbStart = false;
            glObj.cbStop = false;
            await timer.setDatetimeStart('100ms');
            await timer.setDatetimeFinish('500ms');
            await timer.start();
            await wait(620);
            okay = glObj.cbStart && glObj.cbStop;
            await timer.reset();
        }

        if (okay) {
            glObj.cbStart = false;
            glObj.cbStop = false;
            await timer.setDatetimeStart(new Date(new Date().getTime() + 100));
            await timer.setDatetimeFinish('500ms');
            await timer.start({});
            await wait(620);
            okay = glObj.cbStart && glObj.cbStop;
            await timer.reset();
        }

        if (okay) {
            glObj.cbStart = false;
            glObj.cbStop = false;
            timer.onStart = null;
            timer.onStop = null;
            await timer.start({
                datetimeStart: new Date(new Date().getTime() + 100),
                datetimeFinish: '500ms',
                onStart: async () => glObj.cbStart = true,
                onStop: async () => glObj.cbStop = true
            });
            await wait(620);
            okay = glObj.cbStart && glObj.cbStop;
            await timer.reset();
        }

        /// ---- FOOTER ----
        if (okay) {
            glObj.countValid++;
            return;
        }

        glObj.countInvalid++;
        console.log(`invalid test ${key}`);

    }

};

async function runTests() {

    for (let [key, value] of Object.entries(tests)) {
        await value(key);
    }

    console.log(JSON.stringify(glObj, null, 4));
    console.log(`Count valid tests: ${glObj.countValid}`);
    console.log(`Count invalid tests: ${glObj.countInvalid}`);

}

runTests();