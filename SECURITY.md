# Security Policy

## Overview

Omni Wellness Media takes security seriously. This document outlines our security practices, the role-based authorization system, and how to report security vulnerabilities.

---

## Authentication & Authorization

### Authentication System

We use **Supabase Auth** for user authentication with:
- Email/password authentication
- JWT-based sessions
- Automatic token refresh
- Secure password hashing (bcrypt)
- Leaked password protection enabled

### Role-Based Authorization (RBAC)

The application implements a secure role-based access control system using:

1. **`user_roles` table**: Central source of truth for user permissions
2. **Security definer functions**: Server-side role validation
   - `is_admin(user_id)`: Checks if user has admin role
   - `has_role(user_id, role_name)`: Checks for specific role
3. **Edge function validation**: `check-user-role` provides JWT-authenticated role checks
4. **Row Level Security (RLS)**: Database-level access control on all tables

#### Available Roles

- **consumer**: Standard users who purchase services/products
- **provider**: Wellness service providers (yoga instructors, healers, etc.)
- **affiliate**: Affiliate marketers earning commissions
- **admin**: Full system access

---

## Security Features Implemented

### ✅ Phase 1: Critical Security (Production-Ready)

1. **Server-Side Role Validation**
   - Edge function `check-user-role` validates roles using `is_admin()` security definer
   - No client-side role manipulation possible
   - JWT verification enabled on all admin endpoints

2. **Protected Routes**
   - `ProtectedRoute` component uses `useSecureUserRole()` hook
   - Server-validated admin checks for sensitive pages
   - Automatic security event logging for unauthorized access attempts

3. **Secure Order Access**
   - User orders protected by user_id match
   - Guest orders require access token + email match
   - 90-day time limit on guest order visibility
   - Admins have full order visibility with audit logging

### ✅ Phase 2: Enhanced Security

4. **Public Profile Views**
   - `public_profiles` view exposes only safe fields
   - Sensitive data (email, phone) protected by RLS
   - Authenticated users can view provider/member profiles

5. **Deprecated Insecure Patterns**
   - `useUserRole()` marked deprecated for authorization
   - `profiles.user_type` used only for UI display, not security
   - All authorization uses `useSecureUserRole()` and `user_roles` table

6. **Leaked Password Protection**
   - Enabled in Supabase Dashboard
   - Prevents users from using compromised passwords
   - Checks against known data breach databases

### ✅ Phase 3: Advanced Security

7. **Guest Order Access Tokens**
   - Secure 256-bit random tokens for guest orders
   - Auto-generated on order creation
   - Used in `/guest-order-lookup` page
   - Prevents unauthorized order viewing

8. **Comprehensive Audit Logging**
   - `audit_logs` table tracks all admin actions
   - Automatic triggers on sensitive table modifications
   - Stores old/new data for complete audit trail
   - Only admins can view audit logs

9. **Security Monitoring**
   - `security_events` table logs security incidents
   - `SecurityMonitor` class for centralized logging
   - Alert system for critical events
   - Failed admin access attempts tracked

---

## How to Add Admin Users

⚠️ **Important**: Never set admin status through user metadata or profiles table.

### Method 1: Using Supabase Dashboard

1. Go to Supabase Dashboard → SQL Editor
2. Run the following query:
```sql
-- Replace USER_EMAIL with the actual email address
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'USER_EMAIL'
ON CONFLICT (user_id, role) DO NOTHING;
```

### Method 2: Using Admin Panel (Future)

Once logged in as an admin:
1. Navigate to Admin Dashboard → User Management
2. Search for user by email
3. Click "Grant Admin Role"
4. Confirm the action (logged in audit_logs)

---

## Security Best Practices for Developers

### ✅ DO

- **Use `useSecureUserRole()`** for all authorization checks
- **Call `is_admin()` or `has_role()`** in RLS policies
- **Enable RLS** on all tables containing user data
- **Validate input** on both client and server side
- **Use parameterized queries** to prevent SQL injection
- **Store secrets** in Supabase environment variables only
- **Log security events** using `SecurityMonitor` class
- **Test RLS policies** thoroughly before deployment

### ❌ DON'T

- **Don't use `useUserRole()` for authorization** (deprecated, display only)
- **Don't trust `user_metadata.role`** (client-controllable)
- **Don't check `profiles.user_type` for permissions** (insecure)
- **Don't hardcode admin emails** (use user_roles table)
- **Don't disable JWT verification** on sensitive edge functions
- **Don't expose sensitive data** in public API responses
- **Don't commit API keys** or secrets to version control

---

## Database Security

### Row Level Security (RLS) Policies

All tables have RLS enabled. Key policies:

**profiles**
- Authenticated users can view public profile fields
- Users can update their own profile (except user_type)
- Admin checks validated server-side

**orders**
- Users can view orders where `user_id` matches
- Guest orders viewable with valid access token + email (90 days)
- Admins can view all orders

**user_roles**
- Only readable through security definer functions
- Only admins can modify (with audit logging)

**service_quotes**
- Public can insert (rate-limited)
- Only admins can view

**affiliate_commissions**
- Users can view their own commissions
- Admins can view and approve all

### Security Definer Functions

These functions run with elevated privileges and are safe to call:

```sql
-- Check if user is admin
SELECT is_admin('USER_ID_HERE');

-- Check if user has specific role
SELECT has_role('USER_ID_HERE', 'provider');
```

---

## Reporting Security Vulnerabilities

If you discover a security vulnerability, please report it responsibly:

### 🔒 Private Disclosure (Preferred)

**Email**: security@omniwellnessmedia.com  
**Subject**: [SECURITY] Brief description

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

**Response Time**: We aim to respond within 24 hours.

### ⚠️ Do NOT

- Publicly disclose the vulnerability before we've addressed it
- Exploit the vulnerability beyond proof-of-concept
- Access or modify data belonging to other users
- Perform actions that could harm our services or users

---

## Security Incident Response

### If You Detect a Security Issue

1. **Isolate**: If possible, temporarily disable the affected feature
2. **Document**: Capture logs, screenshots, and reproduction steps
3. **Report**: Contact the security team immediately
4. **Monitor**: Watch for unusual activity in audit_logs and security_events

### Our Response Process

1. **Acknowledge** (within 24 hours)
2. **Assess** severity and impact
3. **Patch** the vulnerability
4. **Deploy** security fix
5. **Notify** affected users (if necessary)
6. **Post-mortem** and preventive measures

---

## Security Checklist for Deployments

Before deploying to production:

- [ ] All RLS policies tested and enabled
- [ ] No hardcoded credentials in code
- [ ] JWT verification enabled on all sensitive edge functions
- [ ] Leaked password protection enabled in Supabase
- [ ] Security event logging active
- [ ] Admin users properly assigned via user_roles table
- [ ] Input validation on all user-facing forms
- [ ] Rate limiting configured on public endpoints
- [ ] HTTPS enforced on all connections
- [ ] CORS properly configured
- [ ] Audit logging triggers active

---

## Contact

For security concerns:  
📧 **security@omniwellnessmedia.com**

For general inquiries:  
📧 **contact@omniwellnessmedia.com**

---

**Last Updated**: November 16, 2024  
**Security Policy Version**: 1.0
