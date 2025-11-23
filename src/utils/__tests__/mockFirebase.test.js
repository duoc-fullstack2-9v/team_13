import { createMockFirebaseContext } from '../mockFirebase';

describe('mockFirebase', () => {
  test('provides async auth helpers that resolve with mock users', async () => {
    const mockCtx = createMockFirebaseContext();
    const googleResult = await mockCtx.signInWithGoogle();
    expect(googleResult.user.email).toBe('usuario@demo.com');

    const signUpResult = await mockCtx.signUp('demo@test.com', '123456', {
      nombres: 'Demo',
      apellidos: 'User'
    });
    expect(signUpResult.user.displayName).toContain('Demo User');

    const signInResult = await mockCtx.signIn('demo@test.com', '123456');
    expect(signInResult.user.email).toBe('demo@test.com');

    await expect(mockCtx.signOut()).resolves.toBeUndefined();
    await expect(mockCtx.updateUserProfile({})).resolves.toBeUndefined();
  });
});
