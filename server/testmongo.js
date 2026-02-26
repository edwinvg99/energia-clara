const { MongoClient, ServerApiVersion } = require('mongodb');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const uri = "mongodb+srv://admin_TDEA:admin_3nergia@energia-clara-bd.9kwdnjk.mongodb.net/?retryWrites=true&w=majority&appName=energia-clara-BD";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    console.log("Intentando conectar...");
    await client.connect();
    console.log("Conectado, enviando ping...");
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error("Error de conexión:", err);
  } finally {
    await client.close();
    console.log("Conexión cerrada.");
  }
}
run();