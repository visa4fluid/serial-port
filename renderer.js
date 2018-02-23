// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

//const serialport = require('serialport');
const serialport = require('virtual-serialport');

const buffer = require('buffer').Buffer;

const TEMPLATE_MAP = {
    CRONO: 'crono',
    TIMEOUT: 'timeout',
    TEAM_SCORE: 'teamScore',
    TEAM_FOULS: 'teamFouls',
    PLAYER_PENALITY: 'playerPenality',
    SET_POINT: 'setPoint',
    TEAM_NAME: 'teamName',
    HORN: 'horn',
    TIME: 'time',
    PLAYER_NAME: 'playerName',
    PLAYER_DATA: 'playerData',
    BRIGHTNESS: 'brightness'
};

class SerialPortClient {

    /**
     *
     * @return {Object}
     */
    static mapStartHexToTemplate() {
        return {
            0x80: TEMPLATE_MAP.CRONO,

            0x81: TEMPLATE_MAP.TIMEOUT,

            0x82: TEMPLATE_MAP.TEAM_SCORE,

            0x83: TEMPLATE_MAP.TEAM_FOULS,

            0x84: TEMPLATE_MAP.PLAYER_PENALITY,
            0x85: TEMPLATE_MAP.PLAYER_PENALITY,
            0x86: TEMPLATE_MAP.PLAYER_PENALITY,
            0x87: TEMPLATE_MAP.PLAYER_PENALITY,
            0x88: TEMPLATE_MAP.PLAYER_PENALITY,
            0x89: TEMPLATE_MAP.PLAYER_PENALITY,
            0x8A: TEMPLATE_MAP.PLAYER_PENALITY,
            0x8B: TEMPLATE_MAP.PLAYER_PENALITY,
            0x8C: TEMPLATE_MAP.PLAYER_PENALITY,
            0x8D: TEMPLATE_MAP.PLAYER_PENALITY,

            0x8E: TEMPLATE_MAP.SET_POINT,
            0x8F: TEMPLATE_MAP.SET_POINT,
            0x90: TEMPLATE_MAP.SET_POINT,
            0x91: TEMPLATE_MAP.SET_POINT,

            0x92: TEMPLATE_MAP.TEAM_NAME,
            0x93: TEMPLATE_MAP.TEAM_NAME,

            0x94: TEMPLATE_MAP.HORN,

            0x95: TEMPLATE_MAP.TIME,

            0xA0: TEMPLATE_MAP.PLAYER_NAME,
            0xA1: TEMPLATE_MAP.PLAYER_NAME,
            0xA2: TEMPLATE_MAP.PLAYER_NAME,
            0xA3: TEMPLATE_MAP.PLAYER_NAME,
            0xA4: TEMPLATE_MAP.PLAYER_NAME,
            0xA5: TEMPLATE_MAP.PLAYER_NAME,
            0xA6: TEMPLATE_MAP.PLAYER_NAME,
            0xA7: TEMPLATE_MAP.PLAYER_NAME,
            0xA8: TEMPLATE_MAP.PLAYER_NAME,
            0xA9: TEMPLATE_MAP.PLAYER_NAME,
            0xAA: TEMPLATE_MAP.PLAYER_NAME,
            0xAB: TEMPLATE_MAP.PLAYER_NAME,
            0xAC: TEMPLATE_MAP.PLAYER_NAME,
            0xAD: TEMPLATE_MAP.PLAYER_NAME,
            0xAE: TEMPLATE_MAP.PLAYER_NAME,
            0xB0: TEMPLATE_MAP.PLAYER_NAME,
            0xB1: TEMPLATE_MAP.PLAYER_NAME,
            0xB2: TEMPLATE_MAP.PLAYER_NAME,
            0xB3: TEMPLATE_MAP.PLAYER_NAME,
            0xB4: TEMPLATE_MAP.PLAYER_NAME,
            0xB5: TEMPLATE_MAP.PLAYER_NAME,
            0xB6: TEMPLATE_MAP.PLAYER_NAME,
            0xB7: TEMPLATE_MAP.PLAYER_NAME,
            0xB8: TEMPLATE_MAP.PLAYER_NAME,
            0xB9: TEMPLATE_MAP.PLAYER_NAME,
            0xBA: TEMPLATE_MAP.PLAYER_NAME,
            0xBB: TEMPLATE_MAP.PLAYER_NAME,
            0xBC: TEMPLATE_MAP.PLAYER_NAME,
            0xBD: TEMPLATE_MAP.PLAYER_NAME,
            0xBE: TEMPLATE_MAP.PLAYER_NAME,

            0xC0: TEMPLATE_MAP.PLAYER_DATA,
            0xC1: TEMPLATE_MAP.PLAYER_DATA,
            0xC2: TEMPLATE_MAP.PLAYER_DATA,
            0xC3: TEMPLATE_MAP.PLAYER_DATA,
            0xC4: TEMPLATE_MAP.PLAYER_DATA,
            0xC5: TEMPLATE_MAP.PLAYER_DATA,
            0xC6: TEMPLATE_MAP.PLAYER_DATA,
            0xC7: TEMPLATE_MAP.PLAYER_DATA,
            0xC8: TEMPLATE_MAP.PLAYER_DATA,
            0xC9: TEMPLATE_MAP.PLAYER_DATA,
            0xCA: TEMPLATE_MAP.PLAYER_DATA,
            0xCB: TEMPLATE_MAP.PLAYER_DATA,
            0xCC: TEMPLATE_MAP.PLAYER_DATA,
            0xCD: TEMPLATE_MAP.PLAYER_DATA,
            0xCE: TEMPLATE_MAP.PLAYER_DATA,
            0xD0: TEMPLATE_MAP.PLAYER_DATA,
            0xD1: TEMPLATE_MAP.PLAYER_DATA,
            0xD2: TEMPLATE_MAP.PLAYER_DATA,
            0xD3: TEMPLATE_MAP.PLAYER_DATA,
            0xD4: TEMPLATE_MAP.PLAYER_DATA,
            0xD5: TEMPLATE_MAP.PLAYER_DATA,
            0xD6: TEMPLATE_MAP.PLAYER_DATA,
            0xD7: TEMPLATE_MAP.PLAYER_DATA,
            0xD8: TEMPLATE_MAP.PLAYER_DATA,
            0xD9: TEMPLATE_MAP.PLAYER_DATA,
            0xDA: TEMPLATE_MAP.PLAYER_DATA,
            0xDB: TEMPLATE_MAP.PLAYER_DATA,
            0xDC: TEMPLATE_MAP.PLAYER_DATA,
            0xDD: TEMPLATE_MAP.PLAYER_DATA,
            0xDE: TEMPLATE_MAP.PLAYER_DATA,

            0xF0 : TEMPLATE_MAP.BRIGHTNESS
        };
    }

    /**
     * @return {Object}
     */
    static mapTemplateToConfig() {
        let obj = {};

        obj[TEMPLATE_MAP.PLAYER_DATA] = {
            'length' : 12
        };

        obj[TEMPLATE_MAP.BRIGHTNESS] = {
            'length' : 12
        };

        return obj;
    }

    constructor(serialDevice, options) {
        /**
         *
         * @type {Buffer}
         */
        this.buffer = buffer.from([]);
        this.messages = [];

        this.currentMessage = null;
        this.index = 0;

        this.serialPort = new serialport(serialDevice, options);
        this.serialPort.on('data', this.receiveData.bind(this));
    }

    /**
     * Evt data
     *
     * @param data
     */
    receiveData(data) {

        this.buffer = buffer.concat([this.buffer, data]);

        for (this.index; this.buffer.length > this.index; this.index++) {

            switch (true) {

                case this.isEndSymbol(this.buffer[this.index]):
                    this.currentMessage.setLrc(this.buffer[this.index]);
                    // TODO invio clear, send, ecc
                    console.log('sono un messaggio fatto e finito', this.currentMessage);

                    this.messages.push(this.currentMessage);
                    if (this.buffer.length >= this.currentMessage.getLenghtMessage()) {
                        this.buffer = this.buffer.slice(this.currentMessage.getLenghtMessage(), this.buffer.length);
                        this.index = -1;
                    }

                    this.currentMessage = null;
                    break;

                case this.isStartSymbol(this.buffer[this.index]):
                    this.currentMessage = new GenericMessage(this.buffer[this.index]);
                    break;

                case this.isCurrentMessageSet():
                    this.currentMessage.appendData(this.buffer[this.index]);
                    break;

                default:

                    this.buffer = this.buffer.slice(this.index+1, this.buffer.length);
                    this.index = -1;
                    console.log('Sono un carattere di merda', this.buffer[this.index]);
            }
        }
    }

    /**
     * @param value
     * @return {boolean}
     */
    isStartSymbol(value) {
        let map = SerialPortClient.mapStartHexToTemplate();

        return !!map[value] && !this.currentMessage;
    }

    /**
     * @param value
     * @return {boolean}
     */
    isEndSymbol(value) {
        if (this.currentMessage) {
            let template =  SerialPortClient.mapStartHexToTemplate()[this.currentMessage.type];
            let config = SerialPortClient.mapTemplateToConfig()[template];

            if (config.length === (2 + this.currentMessage.data.length)) {
                return true;
            }
        }
        return false;
    }

    /**
     * @return {boolean}
     */
    isCurrentMessageSet() {
        return !!this.currentMessage;
    }

    _mockData(data) {
        this.serialPort.writeToComputer(new Buffer(data));
    }
}

/**
 *
 */
class GenericMessage {

    constructor(type) {
        /**
         * @param Number
         */
        this.type = type,
        /**
         * @param Buffer
         */
        this.data = buffer.from([]);
        /**
         * @param Number
         */
        this.lrc = null;
    }

    /**
     *
     * @param lrc
     * @return {GenericMessage}
     */
    setLrc(lrc) {
        this.lrc = lrc;
        return this;
    }

    /**
     *
     * @param data
     * @return {GenericMessage}
     */
    appendData(data) {

        let bufferData = data;
        if (data.constructor.name !== 'Buffer') {
            bufferData = buffer.from(Array.isArray(data) ? data : [data]);
        }

        this.data = buffer.concat([this.data, bufferData]);
        return this;
    }

    /**
     *
     * @return {number}
     */
    getLenghtMessage() {
        return this.data.length + 2;
    }
}

module.exports = SerialPortClient;

