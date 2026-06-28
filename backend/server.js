require("dotenv").config();
const express = require("express")
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const Message = require("./models/Message")

const app = express();
const http = require("http");

const server = http.createServer(app);


const { Server } = require("socket.io");

const io = new Server(server, {
    cors: {
        origin:process.env.CLIENT_URL,
        methods:["GET", "POST"],
        credentials: true
    }
});



app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials:true,
}));
app.use(express.json())

app.use("/uploads",
    express.static(path.join(__dirname, "uploads"))
)

app.get("/", (req,res) =>{
    res.send("Server is alive ")
});

const userRoutes = require("./routes/userRoutes");
app.use('/api/users', userRoutes)

const bookRoutes = require("./routes/bookRoutes");
app.use('/api/books', bookRoutes);

const orderRouters = require("./routes/orderRoutes");
app.use("/api/orders", orderRouters)

const exchangeRoutes = require("./routes/exchangeRoutes");
app.use("/api/exchange", exchangeRoutes)

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes)

const messagesRoutes = require("./routes/messageRoutes");
app.use("/api/messages", messagesRoutes)

const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payment", paymentRoutes);

//---SOCKET---------------------------

io.on("connection", (socket) => {

    // console.log("User Connected:", socket.id);

    socket.on("sendMessage", async(data) => {

        try{

            if(
                !data.senderId ||
                !data.receiverId ||
                !data.text 
            ){
                return;
            }

            const newMessage = await Message.create({

                sender:data.senderId,
                receiver: data.receiverId,
                text: data.text 
            });

            console.log ("Message", newMessage);

            io.emit("receiveMessage", newMessage);

        } catch (err) {
            console.log(err)
        }

    });

    socket.on("disconnect", () => {
        console.log("User disconnected")
    });
});



mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB  Connected"))
.catch(err => console.log(err));

const PORT = process.env.PORT || 4000

server.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})
