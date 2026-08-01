/* LinguaDrive — deployment configuration (the ONLY file that changes per deployment).
 *
 * null  → the game runs fully local (no accounts, no sync, no leaderboards; everything else works).
 * value → { provider: 'supabase', url: '<project url>', anonKey: '<publishable key>' }
 *         The publishable key is public by design (it only identifies the project; security is
 *         enforced server-side by Row Level Security policies — see README "Backend").
 */
window.CLOUD_CONFIG = {
  provider: 'supabase',
  url: 'https://hwkgjsijsjzvtjgjkhpm.supabase.co',
  anonKey: 'sb_publishable_1DuqcLyB0b-gcpdaxZJe_A_RZISUxbV'
};
