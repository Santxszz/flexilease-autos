const app = require("../src/index")

const PORT = process.env.PORT_SERVER || 3030;
app.listen(PORT, () => {
    console.log(`[🤖] API: FLEXI LEASE AUTO - ONLINE - PORTA: ${PORT}`);
});

