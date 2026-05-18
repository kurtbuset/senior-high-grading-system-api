# Dependency Upgrade Notes

## Current Issues

### express-jwt@5.3.3 (Deprecated)

- Uses old `buffer-equal-constant-time` package
- Not compatible with Node.js 18+
- API has changed significantly in newer versions

## Recommended Upgrades (Future)

### Option 1: Update to express-jwt@8.x

```bash
npm install express-jwt@8.4.1
```

**Breaking Changes:**

- Middleware signature changed
- Need to update all JWT middleware usage
- See: https://github.com/auth0/express-jwt/blob/master/MIGRATION_NOTES.md

### Option 2: Switch to jsonwebtoken directly

Since you already have `jsonwebtoken@9.0.2`, you can create custom middleware:

```javascript
// _middleware/jwt.js
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
```

## Current Workaround

Using Node.js 18 LTS in Docker, which is stable and compatible with most packages.

## When to Upgrade

Consider upgrading when:

1. You have time for testing
2. express-jwt@5.3.3 has security vulnerabilities
3. You need features from newer versions
