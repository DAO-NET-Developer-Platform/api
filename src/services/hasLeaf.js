const { MerkleTreeNode } = require("@interep/db")
// import config from "src/config"
// import { getCors, logger, runAPIMiddleware } from "src/utils/backend"
// import { connectDatabase } from "src/utils/backend/database"
const createProof = require('./createProof')
const createError = require('http-errors')

module.exports = async function hasLeaf(data)  {

    // const root = req.query.root
    // const leaf = req.query.leaf

    const { provider, name, identityCommitment } = data

    const proof = await createProof(provider, name, identityCommitment)

    const { leaf, root } = proof


    if (!root || typeof root !== "string" || !leaf || typeof leaf !== "string") {
        throw new Error("Invalid Leaf or Root")
    }

    const rootNode = await MerkleTreeNode.findOne({ hash: root })

    if (!rootNode || rootNode.level !== parseInt(process.env.MERKLE_TREE_DEPTH)) {
        throw new Error("The root does not exist")
    }

    const leafNode = await MerkleTreeNode.findOne({ hash: leaf })

    
    return !!leafNode && leafNode.level === 0 && rootNode.group.provider === leafNode.group.provider && rootNode.group.name === leafNode.group.name

}


//get root from createProof then check if it has leaf