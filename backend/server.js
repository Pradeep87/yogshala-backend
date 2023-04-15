const app = require("./app");
const PORT = process.env.PORT;
const { connectDatabase } = require("./db/coon");
const cloudinary = require("cloudinary");

connectDatabase();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(PORT, () => {
  console.log(`server in running at port ${PORT}`);
});
