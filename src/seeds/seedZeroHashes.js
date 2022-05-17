const { MerkleTreeZero } = require("@interep/db")
// import config from "src/config"
// import { logger } from "src/utils/backend"
const poseidon = require("../utils/posidon")

module.exports = async function seedZeroHashes(req, res, next){
    console.log("Seeding zero hashes...")

    let level = 0
    let zeroHash = "0"

    const zeroHashes = await MerkleTreeZero.find()

    if (zeroHashes && zeroHashes.length > 0) {
        level = zeroHashes.length
        zeroHash = zeroHashes[level - 1].hash
    }

    for (level; level < process.env.MERKLE_TREE_DEPTH; level++) {
        zeroHash = level === 0 ? zeroHash : poseidon(zeroHash, zeroHash)

        await MerkleTreeZero.create({
            level,
            hash: zeroHash
        })

        console.log(`Zero hash '${zeroHash}' has been inserted`)
    }

    console.log("All the zero hashes have been inserted correctly")
}
