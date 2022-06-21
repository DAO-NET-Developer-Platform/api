const { MerkleTreeNode, MerkleTreeNodeDocument, MerkleTreeRootBatch, MerkleTreeZero } = require("@interep/db")
// import config from "src/config"
// import { checkGroup } from "src/core/groups"
// import { GroupName, Provider } from "src/types/groups"
const poseidon = require("../utils/posidon")

/**
 * Deletes a leaf from a tree.
 * @param provider The provider of the group.
 * @param name The name of the group.
 * @param identityCommitment The leaf of the tree.
 * @returns The new Merkle tree root.
 */
module.exports = async function deleteLeaf(
    provider,
    name,
    identityCommitment
){
    // if (!checkGroup(provider, name)) {
    //     throw new Error(`The group ${provider} ${name} does not exist`)
    // }

    // Get the zero hashes.
    const zeroes = await MerkleTreeZero.find()

    if (!zeroes || zeroes.length !== parseInt(process.env.MERKLE_TREE_DEPTH)) {
        throw new Error(`The zero hashes have not yet been created`)
    }

    let node = await MerkleTreeNode.findByGroupAndHash({ provider, name }, identityCommitment)

    if (!node) {
        throw new Error(`The identity commitment ${identityCommitment} does not exist`)
    }

    node.hash = zeroes[0].hash

    await node.save()

    let currentIndex = node.index

    for (let level = 0; level < parseInt(process.env.MERKLE_TREE_DEPTH); level++) {
        const parentNode = (await MerkleTreeNode.findByGroupAndLevelAndIndex(
            { provider, name },
            level + 1,
            Math.floor(currentIndex / 2)
        ))
        const siblingNode = await MerkleTreeNode.findByGroupAndLevelAndIndex(
            { provider, name },
            level,
            currentIndex % 2 === 0 ? currentIndex + 1 : currentIndex - 1
        )

        if (siblingNode) {
            siblingNode.siblingHash = node.hash

            await siblingNode.save()
        }

        if (currentIndex % 2 === 0) {
            parentNode.hash = poseidon(node.hash, node.siblingHash.toString())
        } else {
            parentNode.hash = poseidon(node.siblingHash.toString(), node.hash)
        }

        await parentNode.save()

        currentIndex = Math.floor(currentIndex / 2)
        node = parentNode
    }

    let rootBatch = await MerkleTreeRootBatch.findOne({ group: { provider, name }, transaction: undefined })

    if (!rootBatch) {
        rootBatch = new MerkleTreeRootBatch({
            group: {
                provider,
                name
            }
        })
    }

    rootBatch.roots.push(node.hash)

    await rootBatch.save()

    return node.hash
}
