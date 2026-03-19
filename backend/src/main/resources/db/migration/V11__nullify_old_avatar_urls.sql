-- Clean up any existing avatar URLs since the bucket is being renamed from 'avatars' to 'images'
UPDATE users SET avatar_url = NULL WHERE avatar_url IS NOT NULL;
