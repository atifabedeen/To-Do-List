import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "123456", //Not the correct passowrd so it won't connect to the db
  port: 5432,
});
db.connect();

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async(req, res) => {
  const result = await db.query("SELECT * FROM items ORDER BY id ASC")
  items = result.rows
  res.render("index.ejs", {
    listTitle: "My To-Do List!",
    listItems: items,
  });
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  await db.query("INSERT INTO items (title) VALUES($1)", [item])

  //items.push({ title: item });
  res.redirect("/");
});

app.post("/edit", async(req, res) => {
  const updatedItem = req.body.updatedItemTitle
  if(updatedItem === "") {
    res.redirect("/")
  } 
  else {
    await db.query("UPDATE items SET title = $1 WHERE id = $2", [updatedItem, req.body.updatedItemId])
    res.redirect("/")
  }
});

app.post("/delete", async(req, res) => {
  await db.query("DELETE FROM items WHERE id = $1", [req.body.deleteItemId])
  res.redirect("/")
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
