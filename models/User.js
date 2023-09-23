const mongoose = require('mongoose')

const uri = "mongodb+srv://seneca_pratham:GcUrq-cX85pWKSV@cluster0.mm22pii.mongodb.net/hi?retryWrites=true&w=majority";

module.exports = mongoose.connect(uri, {
    useNewUrlParser: true, useUnifiedTopology: true
}, (error) => {
    if (error) {
        console.log(error)
    }
    else {

        console.log("Mongodb Connected!!!")
    }
})

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true }
})



module.exports = mongoose.model('user', userSchema)