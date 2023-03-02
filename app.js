const express = require("express")
const fs = require("fs")
// const { addDatas } = require('./db')
const { getDb, saveDb } = require("./db");
const app = express()
app.use(express.json())

// 查询封装
app.get("/todos", (req, res) => {
  fs.readFile("./db.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
    const db = JSON.parse(data);
    res.status(200).json(db.todos);
  });
});

// id
app.get("/todos/:id", (req, res) => {
  fs.readFile("./db.json", "utf8", (err, data) => {
    if (err) {
      // 发送json数据
      return res.status(500).json({
        error: err.message,
      });
    }
    const db = JSON.parse(data);
    // console.log(typeof req.params.id) // string
    const todo = db.todos.find((todo) => todo.id === +req.params.id);
    if (!todo) {
      return res.status(404).end();
    }
    res.status(200).json(todo);
  });
});


// 添加
app.post('/todos', async (req, res) => {
  try {
    // 获取客户端请求参数
    const todo = req.body
    // 数据验证
    if (!todo.title) {
      return res.status(800).json({
        error: "字段标题是必须的"
      })
    }
    // 通过数据验证，把数据存到db
    const db = await getDb()
    const lastTodo = db.todos[db.todos.length - 1]
    // 添加的要从1添加
    todo.id = lastTodo ? lastTodo.id + 1 : 1
    db.todos.push(todo)
    await saveDb(db)
    //  发送响应
    res.status(200).json(todo)

  } catch (err) {
    res.status(500), json({
      error: err.message
    })
  }
})



// 修改
app.patch("/todos/:id", async (req, res) => {
  try {
    // 1. 获取数据
    const todo = req.body;
    // 2. 查找到要修改的数据
    const db = await getDb();
    // 用id匹配
    const result = db.todos.find((todo) => todo.id === +req.params.id); //id查询
    
    if (!result) {
      return res.status(404).end();
    }
    // 3. 合并对象
    Object.assign(result, todo);
    await saveDb(db);
    // 4. 发送响应
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// 删除
// app.delete('/todos/:id', (req, res) => {
//   res.send('delete/todos')
// })

app.delete("/todos/:id", async (req, res) => {
  try {
    const db = await getDb();
    const index = db.todos.findIndex((todo) => todo.id === +req.params.id);
    if (index === -1) {
      return res.status(404).end();
    }
    db.todos.splice(index, 1);
    await saveDb(db);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


app.listen(3000, () => {

  console.log('Server running at http at http://localhost:3000/')
})

