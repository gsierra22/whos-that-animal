const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();

//get route for personal pets
router.get("/mypets/:id", (req, res) => {
  const queryText = ` SELECT * FROM "user"
  JOIN "pets" ON "user".id=pets.user_id
  WHERE "user".id=$1`;
  pool
    .query(queryText, [req.params.id])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("Unable to process mypets request");
      res.sendStatus(500);
    });
});

//get route for all pets
router.get("/all", (req, res) => {
  const query = `SELECT * FROM pets`;
  pool
    .query(query)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("ERROR: Get all movies", err);
      res.sendStatus(500);
    });
});

//post route for new pets
router.post("/", (req, res) => {
  // RETURNING "id" will give us back the id of the created pet
  const insertPetQuery = `INSERT INTO "pets" (name, catdog, missing, description, neighborhood, photo, missing_message, user_id) 
  VALUES ( $1, $2, $3, $4, $5, $6, $7, $8 ) RETURNING "id";
  `;

  // FIRST QUERY MAKES Pet
  pool
    .query(insertPetQuery, [
      req.body.name,
      req.body.catdog,
      req.body.missing,
      req.body.description,
      req.body.neighborhood,
      req.body.photo,
      req.body.missing_message,
      req.body.user_id,
    ])
    .then((result) => {
      const createdPetId = result.rows[0].id;

      // Now handle the track reference
      const insertTrackQuery = `
      INSERT INTO "track" (pets_id, dates, location, user_id)
      VALUES  ($1, $2, $3, $4);
      `;
      // SECOND QUERY ADDS TRACKING INFORMATION FOR THAT NEW PET
      pool
        .query(insertTrackQuery, [
          createdPetId,
          req.body.dates,
          req.body.location,
          req.body.user_id,
        ])
        .then((result) => {
          //Now that both are done, send back success!
          res.sendStatus(201);
        })
        .catch((err) => {
          // catch for second query
          console.log(err);
          res.sendStatus(500);
        });

      // Catch for first query
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

//put route to set pets as missing
router.put("/missing/:id", (req, res) => {
  const queryString = `UPDATE "pets" SET missing=$1 WHERE id=${req.params.id};`;
  console.log(req.query);
  values = [req.query.missing];
  pool
    .query(queryString, values)
    .then((results) => {
      res.sendStatus(200);
      console.log(req.params.id);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

//deletes personal pet
router.delete("/delete/:id", (req, res) => {
  console.log("my pets delete", req.params.id);
  const deletePets = `DELETE FROM pets WHERE id=$1`;
  values = [req.params.id];
  pool
    .query(deletePets, values)
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("Error DELETE /api/animals", error);
      res.sendStatus(500);
    });
});

module.exports = router;
