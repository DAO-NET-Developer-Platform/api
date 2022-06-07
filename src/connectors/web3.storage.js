const { Web3Storage, File, getFilesFromPath } = require('web3.storage')
const token = process.env.WEB_THREE_STORAGE
const client = new Web3Storage({ token })

module.exports =  {

    async uploadFile(filePath) {

        const file = await getFilesFromPath(filePath)

        const cid = await client.put(file)

        const image = `https://${cid}.ipfs.dweb.link${file[0].name}`

        return { cid, image }
    },

    async retrieve(cid) {

        const res = await client.get(cid)

        const files = await res.files()

       
        console.log(`https://${files[0].cid}.ipfs.dweb.link/${files[0].name}`)

        return `https://${files[0].cid}.ipfs.dweb.link/${files[0].name}`

    }

}