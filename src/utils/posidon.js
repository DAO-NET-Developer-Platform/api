const poseidonService = require('../services/poseidon')

/**
 * Creates a Poseidon big number hash.
 * @param values The list of values to hash.
 * @returns The big number hash.
 */
module.exports = function poseidon(...values){
    values = values.map(BigInt)
    
    return poseidonService(values).toString()
}