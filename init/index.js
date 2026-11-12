const dns = require("dns");

// Use Google DNS
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, "../.env")
});
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const dbUrl = process.env.ATLASDB_URL;

// Function to get geometry from location
const getGeometry = async (location) => {
  try {
    const response = await geocodingClient
      .forwardGeocode({
        query: location,
        limit: 1,
      })
      .send();

    const feature = response.body.features[0];

    if (!feature) {
      console.log(`Location not found: ${location}`);
      return null;
    }

    return {
      type: "Point",
      coordinates: feature.geometry.coordinates,
    };

  } catch (err) {
    console.log(`Geocoding error for ${location}:`, err.message);
    return null;
  }
};

// Database connection
async function main() {
  await mongoose.connect(dbUrl);
  console.log("Connected to DB");
}

// Initialize database
const initDB = async () => {
  try {
    await Listing.deleteMany({});

    const updatedData = await Promise.all(
      initData.data.map(async (obj) => {
        const geometry = await getGeometry(obj.location);

        return {
          ...obj,
          owner: "6acf48da8dc8403f52ab3c9e",
          geometry,
        };
      })
    );

    const validData = updatedData.filter((obj) => obj.geometry !== null);

    await Listing.insertMany(validData);

    console.log(`${validData.length} listings initialized successfully`);
    console.log(`${updatedData.length - validData.length} listings skipped`);

  } catch (err) {
    console.log("Initialization error:", err);
  } finally {
    await mongoose.connection.close();
  }
};

// Run program
main()
  .then(initDB)
  .catch((err) => {
    console.log(err);
  });
