import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { supabaseAdmin } from '../src/config/supabase.js';

describe('Authentication & RBAC Middleware', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('GET /api/me without token should return 401 Unauthorized', async () => {
    const res = await request(app).get('/api/me');
    expect(res.status).toBe(401);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toContain('Missing or malformed Bearer token');
  });

  it('GET /api/me with malformed Authorization header should return 401', async () => {
    const res = await request(app)
      .get('/api/me')
      .set('Authorization', 'Basic 123456');
    expect(res.status).toBe(401);
    expect(res.body.status).toBe('error');
  });

  it('GET /api/me with invalid token should return 401', async () => {
    vi.spyOn(supabaseAdmin.auth, 'getUser').mockResolvedValue({
      data: { user: null },
      error: { message: 'jwt malformed or expired' },
    });

    const res = await request(app)
      .get('/api/me')
      .set('Authorization', 'Bearer invalid-token-xyz');

    expect(res.status).toBe(401);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toContain('jwt malformed or expired');
  });

  it('GET /api/me/moderator-only should return 403 Forbidden for a student', async () => {
    // Mock valid student auth
    vi.spyOn(supabaseAdmin.auth, 'getUser').mockResolvedValue({
      data: {
        user: {
          id: '11111111-2222-3333-4444-555555555555',
          email: 'student@campus.edu',
          user_metadata: { role: 'student', display_name: 'John Student' },
        },
      },
      error: null,
    });

    // Mock profiles table lookup
    vi.spyOn(supabaseAdmin, 'from').mockReturnValue({
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: {
              id: '11111111-2222-3333-4444-555555555555',
              display_name: 'John Student',
              campus_email: 'student@campus.edu',
              role: 'student',
              department: 'Computer Science',
              is_active: true,
            },
            error: null,
          }),
        }),
      }),
    });

    const res = await request(app)
      .get('/api/me/moderator-only')
      .set('Authorization', 'Bearer valid-student-token');

    expect(res.status).toBe(403);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toContain('Forbidden');
    expect(res.body.message).toContain("Current role: 'student'");
  });

  it('GET /api/me/moderator-only should return 200 OK for a moderator', async () => {
    // Mock valid moderator auth
    vi.spyOn(supabaseAdmin.auth, 'getUser').mockResolvedValue({
      data: {
        user: {
          id: '99999999-8888-7777-6666-555555555555',
          email: 'mod@campus.edu',
          user_metadata: { role: 'moderator', display_name: 'Campus Moderator' },
        },
      },
      error: null,
    });

    // Mock profiles lookup
    vi.spyOn(supabaseAdmin, 'from').mockReturnValue({
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: {
              id: '99999999-8888-7777-6666-555555555555',
              display_name: 'Campus Moderator',
              campus_email: 'mod@campus.edu',
              role: 'moderator',
              department: 'Campus Security',
              is_active: true,
            },
            error: null,
          }),
        }),
      }),
    });

    const res = await request(app)
      .get('/api/me/moderator-only')
      .set('Authorization', 'Bearer valid-mod-token');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.role).toBe('moderator');
  });

  it('GET /api/me should return current profile data for authenticated user', async () => {
    vi.spyOn(supabaseAdmin.auth, 'getUser').mockResolvedValue({
      data: {
        user: {
          id: '12345678-1234-1234-1234-123456789abc',
          email: 'alex@campus.edu',
          created_at: '2026-01-01T00:00:00Z',
        },
      },
      error: null,
    });

    vi.spyOn(supabaseAdmin, 'from').mockReturnValue({
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: {
              id: '12345678-1234-1234-1234-123456789abc',
              display_name: 'Alex Johnson',
              campus_email: 'alex@campus.edu',
              role: 'student',
              department: 'Robotics',
              is_active: true,
            },
            error: null,
          }),
        }),
      }),
    });

    const res = await request(app)
      .get('/api/me')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.data.profile.display_name).toBe('Alex Johnson');
    expect(res.body.data.profile.role).toBe('student');
  });
});
