const express = require("express");
const bodyParser = require("body-parser");
// module.exports = index;

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/", (req, res) => {
  const { payload } = req.body;

  if (!Array.isArray(payload)) {
    throw new Error("Could not decode request: JSON parsing failed");
  }

  const response = payload.reduce(function(result, item) {
    if (
      item.drm &&
      item.episodeCount > 0 &&
      (item.image && item.slug && item.title)
    ) {
      result.push({
        image: item.image.showImage,
        slug: item.slug,
        title: item.title
      });
    }
    return result;
  }, []);

  return res.json({ response });
});

app.use(function(req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

app.use(function(err, req, res, next) {
  const response = {
    code: err.status,
    message: err.message,
    error: "Could not decode request: JSON parsing failed"
  };

  res.status(err.status);
  res.json(response);
  res.end();
});

app.listen(port, () =>
  console.log(`Challenge Code listening on port ${port}!`)
);
