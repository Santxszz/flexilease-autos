const app = require("../src/index")

const PORT = process.env.PORT_SERVER || 3000;
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[🤖] API: FLEXI LEASE AUTO - ONLINE - PORTA: ${PORT}`);
});

