/**
* Andrés Sabas @ Electronic Cats
* 8 octuber 2018 
* https://www.electroniccats.com 

https://github.com/ElectronicCats/pxt-airQuality

* Based in the work of Mary West @ SparkFun Electronics 
* Ryan Mortenson https://github.com/ryanjmortenson
* August 25, 2017
* https://github.com/ADataDate/pxt-CCS811

* Development environment specifics:
* Written in Microsoft Makecode
* Tested with a CatSat Zero Electronic Cats, CCS811 sensor for SAMD21
*
* This code is released under the [MIT License](http://opensource.org/licenses/MIT).
* Please review the LICENSE.md file included with this example. If you have any questions 
* or concerns with licensing, please contact support@electroniccats.com.
* Distributed as-is; no warranty is given.
*/


/**
 * Functions to operate the CCS811
 */

enum CCS811_I2C_ADDRESS {
    //% block="0x5A"
    ADDR_0x5A = 0x5A,
    //% block="0x5B"
    ADDR_0x5B = 0x5B
}

//% color=#33acff icon="\u27BE"
namespace airQuality {
    let ccsAddr = 0x00
    //CCS811 Addresses
    const ccsStatus = 0x00
    const ccsMeas = 0x01
    const ccsAlg = 0x02
    const ccsRaw = 0x03
    const ccsEnv = 0x05
    const ccsNtc = 0x06
    const ccsThres = 0x10
    const ccsBase = 0x11
    const ccsHi = 0x20
    const ccsHv = 0x21
    const ccsBoot = 0x23
    const ccsAppv = 0x24
    const ccsErr = 0xE0
    const ccsApps = 0xF4
    const ccsReset = 0xFF

    function init() {
        pins.i2cWriteNumber(ccsAddr, ccsApps, NumberFormat.Int8LE)
        writeCCSReg(ccsMeas, 0x10)
        console.log("Init")
    }
    
	/**
     *  Easy test for ensuring I2C read is working
     */
    //% weight=1 blockId="AIRQUALITY_HARDWAREID" block="HWID"
    //% parts=airQuality trackArgs=0
    export function hardwareID(): number {
        if (!ccsAddr) {  // lazy init
            ccsAddr = CCS811_I2C_ADDRESS.ADDR_0x5A;
            init();
        }
        let hardwareId = readCCSReg(0x20, NumberFormat.UInt8LE)
        return hardwareId
    }


    /**
     * Gets the CO2 data from the algorithm register
     * of the CCS811 Air Quality Sensor
     */

    //% weight=100 blockId="AIRQUALITY_READCO2" block="Read eCO2"
    //% parts=airQuality trackArgs=0
    export function readCo2(): number {
        if (!ccsAddr) {  // lazy init
            ccsAddr = CCS811_I2C_ADDRESS.ADDR_0x5A;
            init();
        }
        //read Algorithm Results register
        let algRes = readCCSReg(ccsAlg, NumberFormat.UInt16BE)
        return algRes
    }

    /**
     * Gets the TVOC data from the algorithm register
     * of the CCS811 Air Quality Sensor
     */

    //% weight=90 blockId="AIRQUALITY_READTVOC" block="Read TVOCs"
    //% parts=airQuality trackArgs=0
    export function readTvoc(): number {
        if (!ccsAddr) {  // lazy init
            ccsAddr = CCS811_I2C_ADDRESS.ADDR_0x5A;
            init();
        }
        //read Algorithm Results register
        let algRes = readCCSReg(ccsAlg, NumberFormat.Int32BE)
        let Tvoc = (algRes & 0x0000FFFF)
        return Tvoc
    }

    //% weight=2 blockId="AIRQUALITY_READSTATUS" block="Device Status"
    //% parts=airQuality trackArgs=0
    export function readStatus(): number {
        if (!ccsAddr) {  // lazy init
            ccsAddr = CCS811_I2C_ADDRESS.ADDR_0x5A;
            init();
        }
        //Return status of Device
        let status = readCCSReg(ccsStatus, NumberFormat.UInt8LE)
        return status
    }

    /**
     * Read the device error code if there are
     * any problems with device
     */
    //% weight=3 blockId="AIRQUALITY_READERROR" block="Device Error"
    //% parts=airQuality trackArgs=0
    export function readError(): number {
        if (!ccsAddr) {  // lazy init
            ccsAddr = CCS811_I2C_ADDRESS.ADDR_0x5A;
            init();
        }
        //Return Error of Device
        let error = readCCSReg(ccsErr, NumberFormat.Int8LE)
        return error
    }


	/**
     * Writes a value to a register on the CCS811 Air Quality Sensor
     */
    function writeCCSReg(reg: number, val: number): void {
        let test = reg << 8 | val
        pins.i2cWriteNumber(ccsAddr, reg << 8 | val, NumberFormat.Int16BE)
    }

	/**
     * Reads a value from a register on the CCS811 Air Quality Sensor
     */
    function readCCSReg(reg: number, format: NumberFormat) {
        pins.i2cWriteNumber(ccsAddr, reg, NumberFormat.UInt8LE, false)
        let val = pins.i2cReadNumber(ccsAddr, format, false)
        return val
    }

    /**
    * set I2C address
    */
    //% blockId="AIRQUALITY_SET_ADDRESS" block="set address %addr"
    //% weight=50 blockGap=8
    //% parts=airQuality trackArgs=0
    export function setAddress(addr: CCS811_I2C_ADDRESS) {
        if (ccsAddr != addr) {
            ccsAddr = addr
        }
    }
}
