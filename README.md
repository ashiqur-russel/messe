# Trade Fair API

Simple Express.js API for trade fair lead collection. Deploy to Vercel.

## Features

✅ Express.js (no TypeScript, pure JavaScript)
✅ MongoDB Atlas
✅ CORS enabled
✅ Vercel-ready

## Local Development

**1. Install dependencies:**
```bash
npm install
```

**2. Run locally:**
```bash
npm run dev
```

API available at: `http://localhost:3000`

**3. Test the API:**
```bash
curl -X POST http://localhost:3000/api/trade-fair/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Max Mustermann",
    "email": "max@example.com",
    "phone": "+49 123 456789",
    "company": "Test GmbH",
    "role": "Manager"
  }'
```

## Deploy to Vercel

**1. Install Vercel CLI:**
```bash
npm i -g vercel
```

**2. Login:**
```bash
vercel login
```

**3. Deploy:**
```bash
vercel --prod
```

**4. Your API will be live at:**
`https://your-project.vercel.app`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API status |
| POST | `/api/trade-fair/leads` | Submit new lead |
| GET | `/api/trade-fair/leads` | Get all leads |
| GET | `/api/trade-fair/leads/count` | Get total count |

## Frontend Integration

Update your Angular frontend to use the Vercel API:

**environment.prod.ts:**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://test.amuvee.de:3000',  // Main IONOS API
  tradeFairApiUrl: 'https://your-vercel-app.vercel.app',  // New Vercel API
};
```

**trade-fair.component.ts:**
```typescript
private async saveToServer(formData: any): Promise<void> {
  // Change from environment.apiUrl to environment.tradeFairApiUrl
  const url = `${environment.tradeFairApiUrl}/api/trade-fair/leads`;
  const response = await firstValueFrom(
    this.http.post<{ message: string; totalLeads: number }>(url, formData)
  );
  console.log('✅ Lead saved to server! Total leads:', response.totalLeads);
}
```

## Environment Variables (Vercel)

Set in Vercel dashboard > Settings > Environment Variables:

- `MONGODB_URI` = `mongodb+srv://devopstuc_db_user:qRMLJDyBLZiuYr73@cluster0.bcxumgu.mongodb.net/amuvee-trade-fair?retryWrites=true&w=majority`

## Database

- **Provider**: MongoDB Atlas
- **Database**: `amuvee-trade-fair`
- **Collection**: `trade-fair-leads`
- **Dashboard**: https://cloud.mongodb.com/

## Architecture

```
Frontend (Apache Server)
    ↓
Vercel API (trade-fair-api)
    ↓
MongoDB Atlas (amuvee-trade-fair)
```

**Separate from main app:**
- Main app still uses IONOS API
- Trade fair uses Vercel API
- Independent deployment
- No impact on production

## Git Setup

```bash
cd ~/Desktop/trade-fair-api
git init
git add .
git commit -m "Initial commit: Trade Fair API"
git remote add origin https://github.com/rahmantuc/trade-fair-api.git
git push -u origin main
```

## Testing

After deployment, test with:

```bash
curl -X POST https://your-vercel-app.vercel.app/api/trade-fair/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@test.com",
    "phone": "+49 123",
    "company": "Test GmbH",
    "role": "Tester"
  }'
```

## Troubleshooting

**MongoDB Connection Failed:**
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0)
- Verify credentials
- Check network access in Atlas

**CORS Errors:**
- Already configured with `cors()`
- Accepts all origins by default

**Vercel Deploy Failed:**
- Check `vercel.json` configuration
- Ensure `api/index.js` exists
- Check Vercel logs

## Next Steps

1. ✅ Test locally
2. ✅ Deploy to Vercel
3. ✅ Update frontend environment
4. ✅ Test from trade fair form
5. ✅ Monitor MongoDB Atlas dashboard


