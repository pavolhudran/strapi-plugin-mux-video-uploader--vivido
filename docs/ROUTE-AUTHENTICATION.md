# Strapi Route Authentication and Policies

In Strapi routes, `auth: false` and `policies: []` serve different purposes:

## `auth: false`

- Disables authentication entirely for the route
- No JWT token or user session required
- Route is publicly accessible
- Bypasses Strapi's built-in authentication middleware
- Useful for webhooks, public assets, or health checks

## `policies: []`

- Empty array means no custom policies are applied
- Authentication is still enabled by default (unless auth: false is set)
- User must be authenticated to access the route
- Only skips custom policy checks, not authentication
- Useful when you want authenticated access but no additional policy restrictions

## Examples

```javascript
// Public route - no auth required
{
  path: '/webhook',
  handler: 'webhook.handle',
  config: {
    auth: false,        // Anyone can access
    policies: []        // No additional policies
  }
}

// Authenticated route - auth required, no policies
{
  path: '/user-data',
  handler: 'user.getData',
  config: {
    // auth: true (default)
    policies: []        // Must be logged in, no extra policies
  }
}

// Authenticated route with policies
{
  path: '/admin-only',
  handler: 'admin.action',
  config: {
    policies: ['isAdmin']  // Must be logged in AND pass isAdmin policy
  }
}
```

In your routes, you have `policies: []` which means authentication is required but no custom policies are enforced.