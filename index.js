const express = require("express");
const app = express();
const ejs = require("ejs");
const fs = require("fs");

let posts = [];
const reafile = fs.readFileSync("postDB.json", "utf-8");
const jsonData = JSON.parse(reafile);
posts = [...jsonData];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("pages/index.ejs", { posts });
});

app.post("/create", function (req, res) {
  const post = req.body;
  let a = {};
  a.itemName = post.itemName; // 품명
  a.quantity = post.quantity; // 수량
  a.remark = post.remark; // 비고
  const day = new Date();
  let year = day.getFullYear();
  let month = day.getMonth() + 1;
  let date = day.getDate();
  let today = `${year}.${month}.${date}`;
  a.entryDate = today; // 기입날짜
  posts.push(a);
  fs.writeFileSync("postDB.json", JSON.stringify(posts));
  console.log("데이터베이스에 새로운 데이터가 성공적으로 추가되었습니다.");
  res.redirect("/");
});

app.post("/delete/:id", function (req, res) {
  const id = req.params.id;
  posts.splice(id, 1);
  fs.writeFileSync("postDB.json", JSON.stringify(posts));
  res.redirect("/");
});

const port = 3003;
app.listen(port, () => {
  console.log(`server${port}`);
});
