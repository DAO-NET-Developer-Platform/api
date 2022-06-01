const { ZkIdentity, Strategy } = require("@zk-kit/identity")

// const identity = new ZkIdentity()
const identity = new ZkIdentity(Strategy.MESSAGE, "message")

const serializedIdentity = identity.serializeIdentity()
const identity2 = new ZkIdentity(Strategy.SERIALIZED, serializedIdentity)
const identityCommitment = identity.genIdentityCommitment()


console.log(identity)
console.log(identity2)
console.log(identityCommitment)