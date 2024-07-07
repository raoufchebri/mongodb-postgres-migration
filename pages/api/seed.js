"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function handler(_req, res) {
    // Placeholder for setup function
    const setup = async () => {
        // Simulate setup process
        return null;
    };
    const message = await setup();
    if (message) {
        res.status(500).json({
            error: { message }
        });
    }
    else {
        await res.revalidate(`/`);
        res.status(200).send('ok.');
    }
}
exports.default = handler;
