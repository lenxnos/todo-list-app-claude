import { http, HttpResponse } from 'msw';

const users = [
  { id: '1', email: 'test@test.com', password: '123456' },
];

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    const user = users.find((u) => u.email === body.email && u.password === body.password);

    if (!user) {
      return HttpResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    return HttpResponse.json({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: { id: user.id, email: user.email },
    });
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json() as { email: string; password: string };

    if (users.some((u) => u.email === body.email)) {
      return HttpResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    return HttpResponse.json(
      { id: '2', email: body.email, createdAt: new Date().toISOString() },
      { status: 201 },
    );
  }),

  http.post('/api/auth/request-reset', async () => {
    return HttpResponse.json({ message: 'If the email exists, a reset link has been sent.' });
  }),

  http.post('/api/auth/reset-password', async () => {
    return HttpResponse.json({ message: 'Password has been reset successfully.' });
  }),

  http.post('/api/auth/refresh', async () => {
    return HttpResponse.json({
      accessToken: 'new-mock-access-token',
      refreshToken: 'new-mock-refresh-token',
    });
  }),
];
