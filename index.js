const express = require("express");
const db = require("./data/hubs-model.js");

const server = express();

server.listen(4000, () => {
  console.log("*** listening on port 4000");
});

// global middleware section
server.use(express.json());

/*

GET https://my.host.example.com/mypath/to/some/resource?parameters-lit?this&that
DELETE https://my.host.example.com/mypath/to/some/resource?parameters-lit?this&that
PUT https://my.host.example.com/mypath/to/some/resource?parameters-lit?this&that
POST https://my.host.example.com/mypath/to/some/resource?parameters-lit?this&that

*/

server.get("/", (req, res) => {
  res.send("hello world!");
});

server.get("/now", (req, res) => {
  res.send(new Date().toISOString());
});

// CRUD
// C - create   - POST
// R - Read     - GET
// U - update   - PUT
// D - Delete   - DELETE

//----------------------------------------------
// retrieve info from the db
//----------------------------------------------
server.get("/hubs", (req, res) => {
  db.find()
    .then(hubs => {
      res.status(200).json(hubs);
    })
    .catch(err => {
      res.status(500).json({ success: false, err });
    });
});

//----------------------------------------------
// add a record to the db
//----------------------------------------------

server.post("/hubs", (req, res) => {
  const hubInfo = req.body;
  db.add(hubInfo)
    .then(hub => {
      res.status(201).json({ success: true, hub });
    })
    .catch(err => {
      res.status(500).json({ success: false, err });
    });
});

//----------------------------------------------
// delete a record to the db
//----------------------------------------------

server.delete("/hubs/:id", (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(204).end();
      } else {
        res.status(404).json({ success: false, message: "id not found" });
      }
    })
    .catch(err => {
      res.status(500).json({ success: false, err });
    });
});

//----------------------------------------------
// delete a record to the db
//----------------------------------------------

server.put("/hubs/:id", (req, res) => {
  const { id } = req.params;
  const change = req.body;

  db.update(id, change)
    .then(updated => {
      if (updated) {
        res.status(200).json({ success: true, updated });
      } else {
        res.status(404).json({ success: false, message: "id not found" });
      }
    })
    .catch(err => {
      res.status(500).json({ success: false, err });
    });
});
