const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 3000;



// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')) // For serving static files
app.use(express.urlencoded({ extended: true }))

// PUG SPECIFIC STUFF
app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', path.join(__dirname, 'views')) // Set the views directory
 
// ENDPOINTS
app.get('/', (req, res)=>{
    const params = { sent: req.query.sent === '1' }
    res.status(200).render('index', params);
})

app.post('/contact', (req, res) => {
    let { name, email, message } = req.body;
    name = name ? name.trim().substring(0, 2000) : "";
    email = email ? email.trim().substring(0, 2000) : "";
    message = message ? message.trim().substring(0, 2000) : "";

    if (!name || !email || !message) {
        return res.status(400).send('Please fill in all fields.');
    }

    const filePath = path.join(__dirname, 'messages.json');
    let messages = [];

    if (fs.existsSync(filePath)) {
        try {
            const data = fs.readFileSync(filePath, 'utf-8');
            messages = data ? JSON.parse(data) : [];
        } catch (e) {
            return res.status(500).send('Error reading messages.');
        }
    }

    messages.push({ name, email, message, date: new Date().toISOString() });

    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));

    res.redirect('/?sent=1#contact');
});

// START THE SERVER
app.listen(port, ()=>{
    console.log(`The application started successfully on port ${port}`);
});