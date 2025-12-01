import { Request, Response, Router } from "express";
import mongoose from "mongoose";
import { User } from "./models/User";

const router = Router();

const MONGO_URI = "mongodb://127.0.0.1:27017/testdb";

mongoose.connect(MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB error:", err));

router.post("/add", async (req: Request, res: Response) => {
const n = req.body.name;
const t = req.body.todo;

try {
let u = await User.findOne({ name: n });

if (u) {
    u.todos.push({ todo: t, checked: false });
    await u.save();
} else {
    u = new User({
    name: n,
    todos: [{ todo: t, checked: false }]
    });
    await u.save();
}

res.json({ message: `Todo added for ${n}.` });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Error' });
}

});

router.get("/todos/:id", async (req: Request, res: Response) => {
const id = req.params.id;

try {
const u = await User.findOne({ name: id });

if (!u) {
    res.json({ message: "User not found", data: '' });
} else {
    res.json({ message: 'User found', data: u });
}
} catch (err) {
console.error(err);
res.status(500).json({ message: "Error" });
}

});

router.delete("/delete", async (req: Request, res: Response) => {
const n = req.body.name;

try {
const r = await User.deleteOne({ name: n });

if (r.deletedCount === 0) {
    res.json({ message: `User "${n}" not found.`, data: "" });
} else {
    res.json({ message: "User deleted.", data: "" });
}
} catch (err) {
console.error(err);
res.status(500).json({ message: "Error" });
}

});

router.put("/update", async (req: Request, res: Response) => {
const n = req.body.name;
const t = req.body.todo;

try {
const u = await User.findOne({ name: n });
if (!u) {
    return res.json({ message: "User not found", success: false });
}

const l = u.todos.length;
u.todos = u.todos.filter(item => item.todo !== t);

if (u.todos.length === l) {
    return res.json({ message: "Todo not found", success: false });
}

await u.save();
res.json({ message: "Todo deleted.", success: true });
} catch (err) {
console.error(err);
res.status(500).json({ message: "Error", success: false });
}

});

router.put("/updateTodo", async (req: Request, res: Response) => {
const n = req.body.name;
const t = req.body.todo;
const c = req.body.checked;

try {
const u = await User.findOne({ name: n });
if (!u) {
    return res.json({ message: "User not found", success: false });
}

const todoIndex = u.todos.findIndex(item => item.todo === t);
if (todoIndex === -1) {
    return res.json({ message: "Todo not found", success: false });
}

u.todos[todoIndex].checked = c;
await u.save();

res.json({ message: "Todo updated.", success: true });
} catch (err) {
console.error(err);
res.status(500).json({ message: "Error", success: false });
}

});

export default router;