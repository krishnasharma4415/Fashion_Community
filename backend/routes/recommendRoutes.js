const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');

router.get('/recommend/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        
        // Run the Python recommendation script
        const pythonProcess = spawn('python', [
            './fashion_recommender/mongo_integration.py',
            postId
        ]);
        
        let recommendations = '';
        
        pythonProcess.stdout.on('data', (data) => {
            recommendations += data.toString();
        });
        
        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                return res.status(500).json({ error: 'Recommendation failed' });
            }
            try {
                const result = JSON.parse(recommendations);
                res.json(result);
            } catch (e) {
                res.status(500).json({ error: 'Failed to parse recommendations' });
            }
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
