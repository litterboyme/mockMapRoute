# React + TypeScript + Vite

This project uses the Google Maps API to generate route for user.

---

# Feature
- Auto-complete locations
- Actual drive route
- Responsive layout
- deal with error request

---

# set your key
Before start this project,

In the root of your React project (same level as `package.json`), create a new file named:`.env`

Add the following content:

```bash
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

>make sure your key allow you to use the server of GoogleMap API

# Start dev

```bash
npm install 
npm run dev
```
# BUILD

```bash
npm run build
```

# BUILD

```bash
npm run test
```

P.S. If you need to see the actual effect, modify ``getRoute`` and ``postRoute`` to like ``getRouteSuccess`` and ``postRouteSuccess`` in the 'mainPage/index.tsx'.