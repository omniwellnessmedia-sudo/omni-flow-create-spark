import { setupSandyProfile } from './setupSandyProfile';

// Sandy's user ID from Supabase Auth
const SANDY_USER_ID = '351e4f5a-a27f-4fe5-957f-fa0ea1210040';

// Run the setup
async function runSetup() {
  console.log('Setting up Sandy Mitchell profile...');
  const success = await setupSandyProfile(SANDY_USER_ID);
  
  if (success) {
    console.log('✅ Sandy Mitchell profile setup completed successfully!');
    console.log('Sandy can now log in with:');
    console.log('Email: sandy@sandymitchell.co.za');
    console.log('Password: OmniWellness2025!');
  } else {
    console.log('❌ Setup failed. Check the console for errors.');
  }
}

// Execute the setup
runSetup().catch(console.error);