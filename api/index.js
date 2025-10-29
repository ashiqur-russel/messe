const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// MongoDB Atlas Connection
const MONGODB_URI = process.env.MONGODB_URI ||
    'mongodb+srv://devopstuc_db_user:qRMLJDyBLZiuYr73@cluster0.bcxumgu.mongodb.net/amuvee-trade-fair?retryWrites=true&w=majority';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Schema
const TradeFairLeadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    company: { type: String, required: true },
    role: { type: String, required: true },
    submittedAt: String,
    submittedAtLocal: String,
    date: String,
    time: String,
    timestamp: Number
}, {
    timestamps: true,
    collection: 'trade-fair-leads'
});

const TradeFairLead = mongoose.model('TradeFairLead', TradeFairLeadSchema);

// Connect to MongoDB with better error handling
let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        return;
    }
    
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            retryWrites: true,
            w: 'majority'
        });
        isConnected = true;
        console.log('✅ Connected to MongoDB Atlas');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        throw err;
    }
};

// Initial connection
connectDB().catch(err => console.error('Failed to connect to MongoDB:', err));

// Routes

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Trade Fair API',
        endpoints: {
            'POST /api/trade-fair/leads': 'Submit a lead',
            'GET /api/trade-fair/leads': 'Get all leads',
            'GET /api/trade-fair/leads/count': 'Get count'
        }
    });
});

// POST - Submit new lead
app.post('/api/trade-fair/leads', async (req, res) => {
    try {
        // Ensure DB connection
        await connectDB();

        const { name, email, phone, company, role } = req.body;

        // Validation
        if (!name || !email || !phone || !company || !role) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['name', 'email', 'phone', 'company', 'role']
            });
        }

        // Add timestamps
        const now = new Date();
        const leadData = {
            name,
            email,
            phone,
            company,
            role,
            submittedAt: now.toISOString(),
            submittedAtLocal: now.toLocaleString('de-DE'),
            date: now.toLocaleDateString('de-DE'),
            time: now.toLocaleTimeString('de-DE'),
            timestamp: now.getTime()
        };

        // Save to database
        const lead = new TradeFairLead(leadData);
        await lead.save();

        // Get total count
        const totalLeads = await TradeFairLead.countDocuments();

        console.log(`✅ Lead saved from ${email}. Total: ${totalLeads}`);

        res.status(201).json({
            message: 'Lead saved successfully',
            totalLeads
        });

    } catch (error) {
        console.error('❌ Error saving lead:', error);
        res.status(500).json({
            error: 'Failed to save lead',
            message: error.message
        });
    }
});

// GET - Get all leads
app.get('/api/trade-fair/leads', async (req, res) => {
    try {
        await connectDB();
        const leads = await TradeFairLead.find().sort({ timestamp: -1 });
        res.json(leads);
    } catch (error) {
        console.error('❌ Error fetching leads:', error);
        res.status(500).json({
            error: 'Failed to fetch leads',
            message: error.message
        });
    }
});

// GET - Get leads count
app.get('/api/trade-fair/leads/count', async (req, res) => {
    try {
        await connectDB();
        const count = await TradeFairLead.countDocuments();
        res.json({ totalLeads: count });
    } catch (error) {
        console.error('❌ Error counting leads:', error);
        res.status(500).json({
            error: 'Failed to count leads',
            message: error.message
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        path: req.path
    });
});

// Start server (for local dev)
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Trade Fair API running on port ${PORT}`);
    });
}

// Export for Vercel
module.exports = app;


