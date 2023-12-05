const aws = require("aws-sdk")

const endpoint = new aws.Endpoint(process.env.FILE_ENDPOINT_S3)

const s3 = new aws.S3({
  endpoint,
  credentials: {
    accessKeyId: process.env.FILE_KEY_ID,
    secretAccessKey: process.env.FILE_APP_KEY,
  },
})

const uploadImagem = async (path, buffer, mimetype) => {
  const imagem = await s3
    .upload({
      Bucket: process.env.FILE_BLACKBLAZE_BUCKET,
      Key: path,
      Body: buffer,
      ContentType: mimetype,
    })
    .promise()

  return {
    path: imagem.Key,
    url: `https://${process.env.FILE_BLACKBLAZE_BUCKET}.${process.env.FILE_ENDPOINT_S3}/${imagem.Key}`,
  }
}

const listarImagem = async () => {
  const arquivos = await s3
    .listObjects({
      Bucket: process.env.FILE_BLACKBLAZE_BUCKET,
    })
    .promise()

  const files = arquivos.Contents.map((file) => {
    return {
      url: `https://${process.env.FILE_BLACKBLAZE_BUCKET}.${process.env.FILE_ENDPOINT_S3}/${file.Key}`,
      path: file.Key,
    }
  })

  return files
}

const deletarImagem = async (path) => {
  await s3
    .deleteObject({
      Bucket: process.env.FILE_BLACKBLAZE_BUCKET,
      Key: path,
    })
    .promise()
}

module.exports = {
  uploadImagem,
  deletarImagem,
  listarImagem,
}
